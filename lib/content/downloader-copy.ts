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
      body: `Paste a public YouTube video or Short and ClipDrop lists the resolutions YouTube serves, from 360p up to 4K where available, plus audio only. HD options are delivered as MP4 with audio. ${LIMITS}`,
    },
    faqs: [
      {
        question: "Which YouTube qualities can I download?",
        answer: "Whatever the video offers publicly, typically 360p to 1080p and sometimes 1440p or 4K, plus an audio-only M4A file.",
      },
      {
        question: "Can I download private or members-only YouTube videos?",
        answer: "No. ClipDrop never signs in to YouTube, so only public videos work.",
      },
      {
        question: "Why does YouTube sometimes show “temporarily unavailable”?",
        answer: "YouTube occasionally limits automated access. When that happens you'll still see the video details, and you can try again a little later.",
      },
      {
        question: "Am I allowed to download YouTube videos?",
        answer: "Only download videos you own, have permission to download, or that are licensed for it (for example Creative Commons). You're responsible for following YouTube's terms and copyright law.",
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
      body: `Paste a public link from YouTube, Instagram, TikTok or Facebook, or a direct link to a video file (.mp4, .webm, .mov). ClipDrop detects the source and lists the formats available. ${LIMITS}`,
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
  youtube: "Public videos & Shorts",
  instagram: "Public Reels & posts",
  tiktok: "Public videos",
  facebook: "Public videos & Reels",
};
