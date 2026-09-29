/** True when the downloader API (downloader-api/) is configured. Read at build/render time on the server. */
export function downloaderEnabled(): boolean {
  return Boolean(process.env.DOWNLOADER_API_URL?.trim());
}
