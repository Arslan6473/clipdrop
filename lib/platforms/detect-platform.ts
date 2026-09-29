import { bareHost } from "./normalize-url";
import { PLATFORM_LIST, type PlatformId, type SourceId } from "./platforms";

export interface VideoMatch {
  source: SourceId;
  /** Platform-specific identifier (video ID, shortcode, share code or file name). */
  id: string;
}

export const DIRECT_VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v", "ogv"] as const;

function hostMatches(host: string, candidates: readonly string[]): boolean {
  return candidates.some((h) => host === h || host.endsWith(`.${h}`));
}

/** Which platform does this host belong to (regardless of whether the path is a video)? */
export function detectPlatform(url: URL): PlatformId | null {
  const host = bareHost(url);
  return PLATFORM_LIST.find((p) => hostMatches(host, p.hosts))?.id ?? null;
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

type Extractor = (url: URL, host: string, segments: string[]) => string | null;

const EXTRACTORS: Record<PlatformId, Extractor> = {
  youtube(url, host, s) {
    let id: string | null = null;
    if (host === "youtu.be") id = s[0] ?? null;
    else if (s[0] === "watch") id = url.searchParams.get("v");
    else if (["shorts", "embed", "live", "v"].includes(s[0] ?? "")) id = s[1] ?? null;
    return id && YT_ID.test(id) ? id : null;
  },
  instagram(_url, _host, s) {
    // /p/{code}, /reel/{code}, /reels/{code}, /tv/{code}, optionally prefixed by /{username}
    const i = s.findIndex((seg) => ["p", "reel", "reels", "tv"].includes(seg));
    if (i < 0 || i > 1) return null;
    const code = s[i + 1];
    return code && /^[A-Za-z0-9_-]{5,64}$/.test(code) ? code : null;
  },
  tiktok(_url, host, s) {
    if (host === "vm.tiktok.com" || host === "vt.tiktok.com") {
      return s[0] && /^[A-Za-z0-9]{5,20}$/.test(s[0]) ? s[0] : null;
    }
    if (s[0] === "t" && s[1] && /^[A-Za-z0-9]{5,20}$/.test(s[1])) return s[1];
    if (s[0]?.startsWith("@") && (s[1] === "video" || s[1] === "photo") && /^\d{5,25}$/.test(s[2] ?? "")) {
      return s[1] === "video" ? s[2] : null;
    }
    if (s[0] === "v" && /^\d{5,25}\.html$/.test(s[1] ?? "")) return s[1].replace(".html", "");
    return null;
  },
  facebook(url, host, s) {
    if (host === "fb.watch") return s[0] && /^[A-Za-z0-9_-]{4,32}$/.test(s[0]) ? s[0] : null;
    if (s[0] === "watch") {
      const v = url.searchParams.get("v");
      return v && /^\d{5,25}$/.test(v) ? v : null;
    }
    if (s[0] === "video.php") {
      const v = url.searchParams.get("v");
      return v && /^\d{5,25}$/.test(v) ? v : null;
    }
    if (s[0] === "reel" && /^\d{5,25}$/.test(s[1] ?? "")) return s[1];
    // Page posts that contain a video: /{page}/posts/{id or pfbid…}
    if (s[1] === "posts" && /^(\d{5,25}|pfbid[A-Za-z0-9]{10,80})$/.test(s[2] ?? "")) return s[2];
    if (s[0] === "share" && (s[1] === "v" || s[1] === "r") && /^[A-Za-z0-9_-]{4,32}$/.test(s[2] ?? "")) {
      return s[2];
    }
    const i = s.indexOf("videos");
    if (i >= 0) {
      const id = s.slice(i + 1).find((seg) => /^\d{5,25}$/.test(seg));
      return id ?? null;
    }
    return null;
  },
};

function pathSegments(url: URL): string[] {
  return url.pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => {
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    });
}

/** Extension of a URL's last path segment if it's a known direct video file type. */
export function directVideoExtension(url: URL): string | null {
  const last = url.pathname.split("/").pop() ?? "";
  const ext = last.includes(".") ? last.split(".").pop()!.toLowerCase() : "";
  return (DIRECT_VIDEO_EXTENSIONS as readonly string[]).includes(ext) ? ext : null;
}

/**
 * Identifies which source a URL belongs to and extracts the video identifier.
 * Returns null for URLs that aren't a recognisable video link.
 */
export function matchVideoUrl(url: URL): VideoMatch | null {
  const platform = detectPlatform(url);
  if (platform) {
    const id = EXTRACTORS[platform](url, bareHost(url), pathSegments(url));
    return id ? { source: platform, id } : null;
  }
  if (directVideoExtension(url)) {
    return { source: "direct", id: url.pathname.split("/").pop()! };
  }
  return null;
}
