import "server-only";

import { detectPlatform, matchVideoUrl } from "@/lib/platforms/detect-platform";
import { validateVideoUrl } from "@/lib/platforms/validate-url";
import { ERROR_MESSAGES, ProviderError } from "@/lib/providers/errors";
import { findProvider } from "@/lib/providers/registry";
import type { AnalyzeResponse, DownloadResult, VideoProvider } from "@/lib/providers/types";

function resolve(rawUrl: string): { url: URL; provider: VideoProvider } {
  const checked = validateVideoUrl(rawUrl);
  if (!checked.ok) throw new ProviderError("INVALID_URL");
  const { url } = checked;

  if (!matchVideoUrl(url)) {
    // Known platform but not a video page (e.g. a profile), or an unknown site.
    throw new ProviderError("UNSUPPORTED_URL", detectPlatform(url) ? "Not a video path" : "Unknown host");
  }
  const provider = findProvider(url);
  if (!provider) throw new ProviderError("UNSUPPORTED_URL");
  return { url, provider };
}

export async function analyzeVideo(rawUrl: string): Promise<AnalyzeResponse> {
  const { url, provider } = resolve(rawUrl);
  const [video, formats] = await Promise.all([provider.analyze(url), provider.getFormats(url)]);
  return {
    success: true,
    video,
    formats,
    notice: formats.length === 0 ? ERROR_MESSAGES.DOWNLOADS_UNAVAILABLE : undefined,
  };
}

export async function createVideoDownload(rawUrl: string, formatId: string): Promise<DownloadResult> {
  const { url, provider } = resolve(rawUrl);
  return provider.createDownload(url, formatId);
}
