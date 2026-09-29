import { MAX_URL_LENGTH, normalizeUrl } from "./normalize-url";

export type UrlValidationResult =
  | { ok: true; url: URL }
  | { ok: false; code: "INVALID_URL" };

const IPV4_LITERAL = /^\d{1,3}(\.\d{1,3}){3}$/;
const BLOCKED_HOST_SUFFIXES = [".local", ".localhost", ".internal", ".lan", ".home", ".corp", ".intranet", ".arpa"];

/**
 * Structural validation that is safe to run on both client and server.
 * The server additionally resolves DNS before fetching anything (see lib/security/ssrf.ts).
 */
export function validateVideoUrl(input: unknown): UrlValidationResult {
  if (typeof input !== "string") return { ok: false, code: "INVALID_URL" };
  const url = normalizeUrl(input);
  if (!url) return { ok: false, code: "INVALID_URL" };

  if (url.protocol === "http:") url.protocol = "https:";
  if (url.protocol !== "https:") return { ok: false, code: "INVALID_URL" };
  if (url.username || url.password) return { ok: false, code: "INVALID_URL" };
  if (url.port && url.port !== "443" && url.port !== "80") return { ok: false, code: "INVALID_URL" };
  url.port = "";

  const host = url.hostname;
  if (!host || host.length > 253) return { ok: false, code: "INVALID_URL" };
  // IP literals (v4, v6 in brackets, or exotic numeric forms normalised by URL) are never video pages.
  if (IPV4_LITERAL.test(host) || host.startsWith("[") || /^[0-9.]+$/.test(host)) {
    return { ok: false, code: "INVALID_URL" };
  }
  if (host === "localhost" || !host.includes(".")) return { ok: false, code: "INVALID_URL" };
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    return { ok: false, code: "INVALID_URL" };
  }
  if (!/^[a-z0-9.-]+$/.test(host) || host.split(".").some((label) => !label || label.length > 63)) {
    return { ok: false, code: "INVALID_URL" };
  }
  if (url.href.length > MAX_URL_LENGTH) return { ok: false, code: "INVALID_URL" };

  return { ok: true, url };
}
