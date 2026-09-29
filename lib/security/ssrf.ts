import "server-only";

import dns from "node:dns";
import https from "node:https";
import net from "node:net";
import type { LookupFunction } from "node:net";
import { ProviderError } from "@/lib/providers/errors";
import { validateVideoUrl } from "@/lib/platforms/validate-url";

const blockList = new net.BlockList();
// IPv4 special-purpose ranges (RFC 6890 and friends)
for (const [addr, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blockList.addSubnet(addr, prefix, "ipv4");
}
// IPv6 special-purpose ranges
for (const [addr, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001::", 23],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["fc00::", 7],
  ["fe80::", 10],
  ["fec0::", 10],
  ["ff00::", 8],
] as const) {
  blockList.addSubnet(addr, prefix, "ipv6");
}

/** Extracts an embedded IPv4 address from IPv4-mapped/compatible IPv6 forms. */
function embeddedIpv4(ip: string): string | null {
  const dotted = /^(?:::ffff:|::)(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  if (dotted) return dotted[1];
  const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(ip);
  if (!hex) return null;
  const hi = parseInt(hex[1], 16);
  const lo = parseInt(hex[2], 16);
  return [hi >> 8, hi & 255, lo >> 8, lo & 255].join(".");
}

/** True for loopback, private, link-local, multicast, reserved and otherwise non-public addresses. */
export function isPrivateIp(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 0) return true; // not an IP — treat as unsafe
  if (family === 4) return blockList.check(ip, "ipv4");
  const v4 = embeddedIpv4(ip);
  if (v4) return blockList.check(v4, "ipv4");
  return blockList.check(ip, "ipv6");
}

/** DNS lookup that refuses to hand back non-public addresses. Used at connect time to defeat rebinding. */
export const safeLookup: LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "", 0);
    const list = addresses as dns.LookupAddress[];
    const unsafe = list.length === 0 || list.some((a) => isPrivateIp(a.address));
    if (unsafe) {
      const blocked = Object.assign(new Error("Blocked non-public address"), { code: "EBLOCKED" });
      return callback(blocked, "", 0);
    }
    if (options.all) return (callback as unknown as (e: null, a: dns.LookupAddress[]) => void)(null, list);
    callback(null, list[0].address, list[0].family);
  });
};

/** Resolves a hostname and throws unless every address is public. */
export async function assertPublicHost(hostname: string): Promise<void> {
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new ProviderError("INVALID_URL", "IP literal blocked");
    return;
  }
  let addresses: dns.LookupAddress[];
  try {
    addresses = await dns.promises.lookup(hostname, { all: true });
  } catch {
    throw new ProviderError("NOT_FOUND", "DNS lookup failed");
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new ProviderError("INVALID_URL", "Resolved to non-public address");
  }
}

export interface SafeHeadResult {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  finalUrl: URL;
}

interface SafeRequestOptions {
  method?: "HEAD" | "GET";
  headers?: Record<string, string>;
  timeoutMs?: number;
  maxRedirects?: number;
}

function requestOnce(url: URL, opts: Required<Omit<SafeRequestOptions, "maxRedirects">>) {
  return new Promise<{ status: number; headers: SafeHeadResult["headers"] }>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: opts.method,
        headers: { "user-agent": "ClipDropBot/1.0 (+metadata check)", ...opts.headers },
        lookup: safeLookup,
        timeout: opts.timeoutMs,
      },
      (res) => {
        // We only need headers; never buffer the body.
        res.destroy();
        resolve({ status: res.statusCode ?? 0, headers: res.headers });
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

/**
 * Fetches only the response headers of a user-supplied URL, with SSRF protection:
 * HTTPS only, public DNS results only (checked at connect time), redirects re-validated
 * hop by hop, strict timeout, and no response body ever read.
 */
export async function safeHead(input: URL, options: SafeRequestOptions = {}): Promise<SafeHeadResult> {
  const opts = {
    method: options.method ?? "HEAD",
    headers: options.headers ?? {},
    timeoutMs: options.timeoutMs ?? 6000,
  };
  const maxRedirects = options.maxRedirects ?? 3;
  let url = input;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const checked = validateVideoUrl(url.href);
    if (!checked.ok) throw new ProviderError("INVALID_URL", "Redirect target failed validation");
    url = checked.url;

    let res: Awaited<ReturnType<typeof requestOnce>>;
    try {
      res = await requestOnce(url, opts);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "EBLOCKED") throw new ProviderError("INVALID_URL", "Blocked address");
      if (code === "ENOTFOUND") throw new ProviderError("NOT_FOUND", "Host not found");
      throw new ProviderError("PROVIDER_UNAVAILABLE", "Request failed");
    }

    if (res.status >= 300 && res.status < 400 && typeof res.headers.location === "string") {
      try {
        url = new URL(res.headers.location, url);
      } catch {
        throw new ProviderError("NOT_FOUND", "Bad redirect");
      }
      continue;
    }
    return { status: res.status, headers: res.headers, finalUrl: url };
  }
  throw new ProviderError("NOT_FOUND", "Too many redirects");
}
