import "server-only";

import { ProviderError } from "./errors";

const MAX_RESPONSE_BYTES = 1_000_000;
const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Fetches JSON from a fixed, provider-owned API endpoint (never a user-supplied host).
 * Maps HTTP failures onto safe error codes and caps the response size.
 */
export async function fetchProviderJson<T>(
  endpoint: string,
  { headers, timeoutMs = DEFAULT_TIMEOUT_MS }: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      headers: { accept: "application/json", "user-agent": "ClipDrop/1.0", ...headers },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    throw new ProviderError("PROVIDER_UNAVAILABLE", "Network error");
  }

  if (res.status === 401 || res.status === 403) throw new ProviderError("PRIVATE_CONTENT", `HTTP ${res.status}`);
  if (res.status === 404 || res.status === 400 || res.status === 410) {
    throw new ProviderError("NOT_FOUND", `HTTP ${res.status}`);
  }
  if (!res.ok) throw new ProviderError("PROVIDER_UNAVAILABLE", `HTTP ${res.status}`);

  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared > MAX_RESPONSE_BYTES) throw new ProviderError("PROVIDER_UNAVAILABLE", "Response too large");
  const text = await res.text();
  if (text.length > MAX_RESPONSE_BYTES) throw new ProviderError("PROVIDER_UNAVAILABLE", "Response too large");

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ProviderError("PROVIDER_UNAVAILABLE", "Invalid JSON");
  }
}

/** Trims and bounds a string coming from a provider. */
export function cleanText(value: unknown, max = 300): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
