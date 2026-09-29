import "server-only";

import { requestContext } from "@/lib/api/request-context";
import { isAllowedThumbnail } from "@/lib/config/remote-images";
import { matchVideoUrl } from "@/lib/platforms/detect-platform";
import { SOURCE_NAMES, type PlatformId } from "@/lib/platforms/platforms";
import { sanitizeFilename } from "@/lib/utils/sanitize-filename";
import { createTtlCache } from "@/lib/utils/ttl-cache";
import { isErrorCode, ProviderError } from "../errors";
import { cleanText } from "../http";
import type { DownloadResult, VideoFormat, VideoInfo, VideoProvider } from "../types";

/**
 * Talks to the ClipDrop downloader API (github.com/Arslan6473/clipdrop-api, deployed on e.g. Railway).
 * That service extracts public videos with yt-dlp and hosts prepared files for a few minutes.
 * The browser downloads files straight from it, so large videos never pass through this server.
 */

interface RemoteAnalyze {
  video: {
    title?: string;
    author?: string | null;
    durationSeconds?: number | null;
    thumbnailCandidates?: string[];
  };
  formats: unknown[];
}

interface RemoteDownload {
  download: { downloadUrl: string; filename: string; expiresAt?: string };
}

export function downloaderApiUrl(): string | null {
  const raw = process.env.DOWNLOADER_API_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    return url.protocol === "https:" || (local && url.protocol === "http:") ? url.origin : null;
  } catch {
    return null;
  }
}

async function call<T>(path: string, body: object, timeoutMs: number): Promise<T> {
  const base = downloaderApiUrl();
  if (!base) throw new ProviderError("DOWNLOADS_UNAVAILABLE", "Downloader API not configured");
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.DOWNLOADER_API_KEY ?? "",
        "x-client-ip": requestContext.getStore()?.clientIp ?? "unknown",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch {
    throw new ProviderError("PROVIDER_UNAVAILABLE", "Downloader API unreachable");
  }
  let data: { success?: boolean; code?: unknown } & Partial<T>;
  try {
    data = await res.json();
  } catch {
    throw new ProviderError("PROVIDER_UNAVAILABLE", `Downloader API HTTP ${res.status}`);
  }
  if (data.success === true) return data as T;
  const code = data.code;
  // Auth/validation problems between our two servers are our fault, not the user's.
  if (!isErrorCode(code) || code === "BAD_REQUEST" || code === "INTERNAL_ERROR") {
    console.error("[downloader-api] request failed", res.status, typeof code === "string" ? code : "");
    throw new ProviderError("PROVIDER_UNAVAILABLE", "Downloader API error");
  }
  throw new ProviderError(code);
}

const FORMAT_ID = /^[A-Za-z0-9_.-]{1,32}$/;

function toFormats(raw: unknown[]): VideoFormat[] {
  return raw.flatMap((item) => {
    const f = item as Record<string, unknown>;
    if (typeof f?.id !== "string" || !FORMAT_ID.test(f.id) || typeof f.label !== "string") return [];
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : undefined);
    return [
      {
        id: f.id,
        label: cleanText(f.label, 24) ?? f.id,
        description: cleanText(f.description, 40),
        container: (cleanText(f.container, 8) ?? "MP4").toUpperCase(),
        sizeBytes: num(f.sizeBytes),
        width: num(f.width),
        height: num(f.height),
        hasAudio: f.hasAudio === true,
      },
    ];
  });
}

const analyzeCache = createTtlCache<Promise<RemoteAnalyze>>({ ttlMs: 60_000 });

/** analyze() and getFormats() run in parallel; share one upstream request between them. */
function remoteAnalyze(url: URL): Promise<RemoteAnalyze> {
  const hit = analyzeCache.get(url.href);
  if (hit) return hit;
  const pending = call<RemoteAnalyze>("/analyze", { url: url.href }, 50_000);
  analyzeCache.set(url.href, pending);
  pending.catch(() => analyzeCache.delete(url.href));
  return pending;
}

/**
 * Remote downloads, falling back to the metadata-only provider when the downloader API is
 * temporarily unavailable (e.g. a platform is blocking it) so users still see the video details.
 */
export function createRemoteProvider(source: PlatformId, fallback: VideoProvider): VideoProvider {
  const recoverable = (err: unknown) => err instanceof ProviderError && err.code === "PROVIDER_UNAVAILABLE";

  return {
    name: SOURCE_NAMES[source],
    source,
    canHandle: (url) => matchVideoUrl(url)?.source === source,

    async analyze(url): Promise<VideoInfo> {
      try {
        const { video } = await remoteAnalyze(url);
        return {
          source,
          sourceName: SOURCE_NAMES[source],
          title: cleanText(video.title) ?? `${SOURCE_NAMES[source]} video`,
          pageUrl: url.href,
          author: cleanText(video.author, 120),
          durationSeconds:
            typeof video.durationSeconds === "number" && video.durationSeconds > 0 ? video.durationSeconds : undefined,
          thumbnailUrl: (video.thumbnailCandidates ?? []).find((t) => isAllowedThumbnail(t)),
        };
      } catch (err) {
        if (recoverable(err)) {
          // Platforms sometimes block the download server (e.g. YouTube's bot check); say so plainly.
          const info = await fallback.analyze(url);
          return {
            ...info,
            downloadNotice: `${SOURCE_NAMES[source]} is limiting downloads from our server right now. Please try again later.`,
          };
        }
        throw err;
      }
    },

    async getFormats(url) {
      try {
        return toFormats((await remoteAnalyze(url)).formats ?? []);
      } catch (err) {
        if (recoverable(err)) return fallback.getFormats(url);
        throw err;
      }
    },

    async createDownload(url, formatId): Promise<DownloadResult> {
      const { download } = await call<RemoteDownload>("/download", { url: url.href, formatId }, 290_000);
      let link: URL;
      try {
        link = new URL(download.downloadUrl);
      } catch {
        throw new ProviderError("PROVIDER_UNAVAILABLE", "Bad download link");
      }
      // Only ever hand the browser a link on the downloader API's own origin.
      if (link.origin !== downloaderApiUrl()) throw new ProviderError("PROVIDER_UNAVAILABLE", "Unexpected link origin");
      const ext = download.filename?.split(".").pop() ?? "mp4";
      return {
        downloadUrl: link.href,
        filename: sanitizeFilename(download.filename?.replace(/\.[^.]+$/, "") ?? "video", ext),
        expiresAt: download.expiresAt,
        attachment: true,
      };
    },
  };
}
