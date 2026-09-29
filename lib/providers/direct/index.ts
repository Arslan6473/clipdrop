import "server-only";

import { directVideoExtension, matchVideoUrl } from "@/lib/platforms/detect-platform";
import { SOURCE_NAMES } from "@/lib/platforms/platforms";
import { safeHead, type SafeHeadResult } from "@/lib/security/ssrf";
import { sanitizeFilename } from "@/lib/utils/sanitize-filename";
import { ProviderError } from "../errors";
import type { VideoFormat, VideoInfo, VideoProvider } from "../types";
import { createTtlCache } from "@/lib/utils/ttl-cache";

/**
 * Direct links to publicly hosted video files (e.g. https://example.org/talk.mp4), such as
 * public-domain archives or your own storage. We only inspect response headers through the
 * SSRF-guarded client; the browser downloads the file straight from its host.
 */

const VIDEO_TYPES = /^(video\/[a-z0-9.+-]+|application\/octet-stream)$/i;

function header(res: SafeHeadResult, name: string): string | undefined {
  const value = res.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

type Inspection = { finalUrl: URL; ext: string; sizeBytes?: number };
const inspections = createTtlCache<Promise<Inspection>>({ ttlMs: 30_000 });

/** analyze + getFormats run together; share one header check between them. */
function inspect(url: URL): Promise<Inspection> {
  const cached = inspections.get(url.href);
  if (cached) return cached;
  const pending = inspectUncached(url);
  inspections.set(url.href, pending);
  pending.catch(() => inspections.delete(url.href));
  return pending;
}

async function inspectUncached(url: URL): Promise<Inspection> {
  let res = await safeHead(url);
  // Some hosts don't implement HEAD; ask for a single byte instead.
  if (res.status === 405 || res.status === 501 || res.status === 403) {
    res = await safeHead(url, { method: "GET", headers: { range: "bytes=0-0" } });
  }
  if (res.status === 401 || res.status === 403) throw new ProviderError("PRIVATE_CONTENT", `HTTP ${res.status}`);
  if (res.status === 404 || res.status === 410) throw new ProviderError("NOT_FOUND", `HTTP ${res.status}`);
  if (res.status >= 500 || res.status === 429) throw new ProviderError("PROVIDER_UNAVAILABLE", `HTTP ${res.status}`);
  if (res.status < 200 || res.status >= 300) throw new ProviderError("NOT_FOUND", `HTTP ${res.status}`);

  const type = (header(res, "content-type") ?? "").split(";")[0].trim();
  if (!VIDEO_TYPES.test(type)) throw new ProviderError("UNSUPPORTED_URL", "Not a video file");

  const range = header(res, "content-range");
  const size = range ? Number(range.split("/")[1]) : Number(header(res, "content-length"));
  const ext = directVideoExtension(res.finalUrl) ?? directVideoExtension(url) ?? "mp4";
  return { finalUrl: res.finalUrl, ext, sizeBytes: Number.isFinite(size) && size > 0 ? size : undefined };
}

function titleFrom(url: URL): string {
  const last = url.pathname.split("/").pop() ?? "video";
  let decoded = last;
  try {
    decoded = decodeURIComponent(last);
  } catch {
    /* keep raw */
  }
  return decoded.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim().slice(0, 200) || "Video file";
}

export const directProvider: VideoProvider = {
  name: SOURCE_NAMES.direct,
  source: "direct",
  canHandle: (url) => matchVideoUrl(url)?.source === "direct",

  async analyze(url): Promise<VideoInfo> {
    const { finalUrl } = await inspect(url);
    return {
      source: "direct",
      sourceName: SOURCE_NAMES.direct,
      title: titleFrom(url),
      pageUrl: url.href,
      author: finalUrl.hostname,
    };
  },

  async getFormats(url): Promise<VideoFormat[]> {
    const { ext, sizeBytes } = await inspect(url);
    return [
      {
        id: "original",
        label: "Original file",
        description: "As published by the host",
        container: ext.toUpperCase(),
        sizeBytes,
      },
    ];
  },

  async createDownload(url, formatId) {
    if (formatId !== "original") throw new ProviderError("FORMAT_NOT_FOUND");
    const { finalUrl, ext } = await inspect(url);
    return { downloadUrl: finalUrl.href, filename: sanitizeFilename(titleFrom(url), ext) };
  },
};
