import "server-only";

import type { SourceId } from "@/lib/platforms/platforms";
import { directProvider } from "./direct";
import { facebookProvider } from "./facebook";
import { instagramProvider } from "./instagram";
import { tiktokProvider } from "./tiktok";
import { createRemoteProvider, downloaderApiUrl } from "./remote";
import type { VideoProvider } from "./types";
import { youtubeProvider } from "./youtube";

/** Built-in providers: platform metadata via oEmbed, and real downloads for direct video files. */
export const providers: Record<SourceId, VideoProvider> = {
  youtube: youtubeProvider,
  instagram: instagramProvider,
  tiktok: tiktokProvider,
  facebook: facebookProvider,
  direct: directProvider,
};

const REMOTE_SOURCES = ["youtube", "instagram", "tiktok", "facebook"] as const;

/**
 * When DOWNLOADER_API_URL is set, platform links go to the downloader API (with the built-in
 * provider as a fallback).
 */
export function activeProviders(): VideoProvider[] {
  if (!downloaderApiUrl()) return Object.values(providers);
  return Object.values(providers).map((p) => {
    const remote = (REMOTE_SOURCES as readonly string[]).includes(p.source);
    if (!remote) return p;
    return createRemoteProvider(p.source as (typeof REMOTE_SOURCES)[number], p);
  });
}

export function findProvider(url: URL): VideoProvider | null {
  return activeProviders().find((p) => p.canHandle(url)) ?? null;
}
