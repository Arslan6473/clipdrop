export const MAX_URL_LENGTH = 2048;

/** Query params that only carry tracking information and never identify a video. */
const TRACKING_PARAMS = [
  /^utm_/i,
  /^fbclid$/i,
  /^gclid$/i,
  /^igshid$/i,
  /^igsh$/i,
  /^mibextid$/i,
  /^si$/i,
  /^feature$/i,
  /^ref_src$/i,
  /^ref_url$/i,
  /^share_app_id$/i,
  /^_r$/i,
];

/**
 * Turns user input into a parsed URL: trims whitespace, adds a missing
 * scheme, lowercases the host, drops the fragment and tracking params.
 * Returns null when the input can't be parsed as a URL at all.
 */
export function normalizeUrl(input: string): URL | null {
  if (typeof input !== "string") return null;
  let value = input.trim();
  if (!value || value.length > MAX_URL_LENGTH) return null;
  // Reject embedded whitespace/control characters rather than silently fixing them.
  if (/[\s\u0000-\u001f\u007f]/.test(value)) return null;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) && !/^[^/:]+:\d+/.test(value);
  // Bare "youtube.com/watch?v=…" gets https://. Other schemes ("javascript:", "file:") are
  // left intact so validation rejects them.
  if (!hasScheme) value = `https://${value.replace(/^\/+/, "")}`;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  url.hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.some((re) => re.test(key))) url.searchParams.delete(key);
  }
  return url;
}

/** Hostname without a leading "www.". */
export function bareHost(url: URL): string {
  return url.hostname.replace(/^www\./, "");
}
