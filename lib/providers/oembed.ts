import "server-only";

import { isAllowedThumbnail } from "@/lib/config/remote-images";
import { SOURCE_NAMES, type PlatformId } from "@/lib/platforms/platforms";
import { ProviderError } from "./errors";
import { cleanText, fetchProviderJson } from "./http";
import type { DownloadResult, VideoFormat, VideoInfo, VideoProvider } from "./types";
import { matchVideoUrl } from "@/lib/platforms/detect-platform";

export interface OEmbedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
  duration?: number;
  html?: string;
}

export function oembedToVideoInfo(source: PlatformId, url: URL, data: OEmbedResponse): VideoInfo {
  const author = cleanText(data.author_name, 120);
  return {
    source,
    sourceName: SOURCE_NAMES[source],
    title: cleanText(data.title) ?? (author ? `Video by ${author}` : `${SOURCE_NAMES[source]} video`),
    pageUrl: url.href,
    author,
    thumbnailUrl: isAllowedThumbnail(data.thumbnail_url) ? data.thumbnail_url : undefined,
    durationSeconds: typeof data.duration === "number" && data.duration > 0 ? data.duration : undefined,
  };
}

/**
 * Provider for platforms that publish a public oEmbed endpoint for metadata but offer no
 * authorised download mechanism to third parties. It identifies the video and reports
 * that no downloads are available — it never scrapes or bypasses platform controls.
 */
export function createMetadataOnlyProvider({
  source,
  endpoint,
  headers,
  transform,
}: {
  source: PlatformId;
  /** Builds the oEmbed endpoint, or returns null when it can't be used (e.g. missing token). */
  endpoint: (url: URL) => string | null;
  headers?: () => Record<string, string> | undefined;
  transform?: (data: OEmbedResponse) => OEmbedResponse;
}): VideoProvider {
  return {
    name: SOURCE_NAMES[source],
    source,
    canHandle: (url) => matchVideoUrl(url)?.source === source,
    async analyze(url) {
      const target = endpoint(url);
      if (!target) throw new ProviderError("DOWNLOADS_UNAVAILABLE", "No metadata endpoint configured");
      const data = await fetchProviderJson<OEmbedResponse>(target, { headers: headers?.() });
      return oembedToVideoInfo(source, url, transform ? transform(data) : data);
    },
    async getFormats(): Promise<VideoFormat[]> {
      return [];
    },
    async createDownload(): Promise<DownloadResult> {
      throw new ProviderError("DOWNLOADS_UNAVAILABLE");
    },
  };
}
