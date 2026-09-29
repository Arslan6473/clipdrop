import type { PlatformId } from "@/lib/platforms/platforms";
import type { FaqItem, ToolPageContent } from "./types";

/**
 * Copy used when the downloader API is configured. Replaces the "details only" wording
 * so pages never promise less, or more, than the site actually does.
 */
const LIMITS =
  "Only public videos are supported: private, members-only, age-restricted and login-protected content isn't, and DRM-protected videos are never downloaded.";

export const DOWNLOADER_COPY: Record<string, { availability: ToolPageContent["availability"]; faqs?: FaqItem[] }> = {
  "/youtube-downloader": {
    availability: {
      title: "What's available for YouTube",
      body: "Paste a public YouTube video or Short and ClipDrop shows its title, channel and thumbnail. YouTube currently blocks downloads from our servers, so download options usually won't appear for YouTube links. When YouTube allows it, the available formats are listed automatically. To keep videos for offline viewing, use YouTube's own download button (YouTube Premium). Creators can download their own uploads from YouTube Studio.",
    },
    faqs: [
      {
        question: "Why can't I download this YouTube video?",
        answer:
          "YouTube blocks automated downloads from cloud servers like ours with a “confirm you're not a bot” check. We don't try to get around it, so most YouTube links show video details only.",
      },
      {
        question: "How can I watch YouTube videos offline?",
        answer:
          "YouTube Premium lets you download videos in the official YouTube app for offline viewing. It's the supported way to save YouTube videos.",
      },
      {
        question: "How do I download my own YouTube videos?",
        answer:
          "Open YouTube Studio → Content, then choose Download from the menu next to your video. For all your uploads at once, use Google Takeout.",
      },
      {
        question: "Which platforms can I download from?",
        answer: "Public videos from Instagram, TikTok and Facebook, plus direct links to video files.",
      },
    ],
  },
  "/instagram-downloader": {
    availability: {
      title: "What's available for Instagram",
      body: `Paste a public Instagram Reel or video post and ClipDrop lists the available qualities as MP4, plus audio only when Instagram provides it. ${LIMITS}`,
    },
  },
  "/tiktok-downloader": {
    availability: {
      title: "What's available for TikTok",
      body: `Paste a public TikTok video or share link and ClipDrop lists the MP4 qualities TikTok serves. We deliver the file as TikTok provides it and never alter videos. ${LIMITS}`,
    },
    faqs: [
      {
        question: "Does ClipDrop remove TikTok watermarks?",
        answer: "No. ClipDrop never edits videos. You get the file exactly as TikTok serves it.",
      },
      {
        question: "Do vm.tiktok.com share links work?",
        answer: "Yes. Links copied from the TikTok app's share sheet work without any cleanup.",
      },
      {
        question: "Can I download private TikTok videos?",
        answer: "No. Only public videos are supported.",
      },
    ],
  },
  "/facebook-downloader": {
    availability: {
      title: "What's available for Facebook",
      body: `Paste a public Facebook video, Watch or Reel link and ClipDrop lists the SD and HD versions Facebook serves as MP4. ${LIMITS}`,
    },
  },
  "/universal-video-downloader": {
    availability: {
      title: "What the universal downloader supports",
      body: `Paste a public link from YouTube, Instagram, TikTok or Facebook, or a direct link to a video file (.mp4, .webm, .mov). ClipDrop detects the source and lists the formats available. YouTube links usually show details only, because YouTube blocks downloads from our servers. ${LIMITS}`,
    },
  },
  "/video-to-mp4": {
    availability: {
      title: "How MP4 availability works",
      body: "For supported platforms ClipDrop prepares MP4 files at each available resolution, combining the video and audio streams the platform serves. Nothing is re-encoded, so quality is exactly what the source provides. Direct links are delivered in their original format.",
    },
  },
};

export const PLATFORM_AVAILABILITY_WITH_DOWNLOADER: Record<PlatformId, string> = {
  youtube: "Video details",
  instagram: "Public Reels & posts",
  tiktok: "Public videos",
  facebook: "Public videos & Reels",
};
