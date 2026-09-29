/** True when the downloader API (github.com/Arslan6473/clipdrop-api) is configured. Read at build/render time on the server. */
export function downloaderEnabled(): boolean {
  return Boolean(process.env.DOWNLOADER_API_URL?.trim());
}
