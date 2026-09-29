/**
 * Thumbnail hosts next/image is allowed to optimise. Providers only return thumbnails
 * from these hosts, so the image optimiser can never be pointed at arbitrary URLs.
 */
export const THUMBNAIL_HOSTS = [
  "i.ytimg.com",
  "**.tiktokcdn.com",
  "**.tiktokcdn-us.com",
  "**.tiktokcdn-eu.com",
  "**.cdninstagram.com",
  "**.fbcdn.net",
] as const;

export function isAllowedThumbnail(value: string | undefined | null): value is string {
  if (!value) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  return THUMBNAIL_HOSTS.some((pattern) =>
    pattern.startsWith("**.") ? url.hostname.endsWith(pattern.slice(2)) : url.hostname === pattern,
  );
}
