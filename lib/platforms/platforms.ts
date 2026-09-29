export const PLATFORM_IDS = [
  "youtube",
  "instagram",
  "tiktok",
  "facebook",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

/** A source that isn't a social platform, e.g. a direct link to a public .mp4 file. */
export type SourceId = PlatformId | "direct";

export interface PlatformDefinition {
  id: PlatformId;
  name: string;
  /** Tool page path. */
  href: string;
  /** Brand color used for the icon tile. */
  color: string;
  /** Hostnames (without "www.") this platform serves video from. */
  hosts: readonly string[];
}

export const PLATFORMS: Record<PlatformId, PlatformDefinition> = {
  youtube: {
    id: "youtube",
    name: "YouTube",
    href: "/youtube-downloader",
    color: "#FF0000",
    hosts: ["youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "youtube-nocookie.com"],
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    href: "/instagram-downloader",
    color: "#E1306C",
    hosts: ["instagram.com", "instagr.am"],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    href: "/tiktok-downloader",
    color: "#000000",
    hosts: ["tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"],
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    href: "/facebook-downloader",
    color: "#0866FF",
    hosts: ["facebook.com", "m.facebook.com", "fb.watch", "fb.com"],
  },
};

export const PLATFORM_LIST: PlatformDefinition[] = PLATFORM_IDS.map((id) => PLATFORMS[id]);

export const SOURCE_NAMES: Record<SourceId, string> = {
  ...Object.fromEntries(PLATFORM_LIST.map((p) => [p.id, p.name])),
  direct: "Direct video file",
} as Record<SourceId, string>;

export const TOOL_LINKS = [
  { name: "Universal Downloader", href: "/universal-video-downloader" },
  { name: "Video to MP4", href: "/video-to-mp4" },
] as const;
