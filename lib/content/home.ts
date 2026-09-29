import type { PlatformId } from "@/lib/platforms/platforms";
import type { FaqItem, FeatureItem } from "./types";

export const HOW_IT_WORKS_STEPS = [
  { title: "Copy a supported video URL", description: "Grab the link from your browser's address bar or the app's Share menu." },
  { title: "Paste it above", description: "Drop it into the box. Tracking parameters are cleaned up for you." },
  { title: "Analyze the video", description: "We check the link and fetch the details and formats the source provides." },
  { title: "Choose an available format", description: "Compare the real options with their quality, format and size." },
  { title: "Download", description: "Your browser downloads the file directly from the source." },
];

export const FEATURES: (FeatureItem & { icon: "zap" | "sparkles" | "layers" | "smartphone" | "shield" | "download" })[] = [
  { icon: "zap", title: "Fast", description: "Analyze supported URLs quickly." },
  { icon: "sparkles", title: "Simple", description: "No account or signup required." },
  { icon: "layers", title: "Multiple Platforms", description: "Use separate tools for supported platforms." },
  { icon: "smartphone", title: "Mobile Friendly", description: "Works across phones, tablets and desktops." },
  { icon: "shield", title: "Privacy Focused", description: "We don't create accounts or permanently store download history." },
  { icon: "download", title: "Easy Downloads", description: "Choose an available format and download." },
];

/** What each platform actually offers today — shown on the homepage so expectations are clear. */
export const PLATFORM_AVAILABILITY: Record<PlatformId, string> = {
  youtube: "Video details",
  instagram: "Link recognition",
  tiktok: "Video details",
  facebook: "Link recognition",
};

export const HOME_FAQS: FaqItem[] = [
  {
    question: "Is ClipDrop free to use?",
    answer: "Yes. ClipDrop is free, and there's no account, signup or subscription.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "ClipDrop recognizes links from YouTube, Instagram, TikTok and Facebook, plus direct links to public video files. What you can download depends on each platform.",
  },
  {
    question: "Why don't I see a download option for some videos?",
    answer:
      "Some platforms don't offer an authorized way for third-party tools to download videos. When that's the case we say so clearly instead of working around the platform's rules.",
  },
  {
    question: "Can I download private videos?",
    answer:
      "No. Private, login-protected and DRM-protected content isn't supported, and ClipDrop never asks for your social media passwords.",
  },
  {
    question: "Do you keep a history of my downloads?",
    answer:
      "No. There are no accounts and no download history. Links are processed for your request and not stored. See our Privacy page for details.",
  },
  {
    question: "What am I allowed to download?",
    answer:
      "Content you own, content you have permission to download, public-domain content, and content the platform or license makes available for downloading. You're responsible for making sure you have the right to download it.",
  },
];

export const HOME_NOTICE =
  "ClipDrop is for downloading content you own, have permission to download, or that is legally available for downloading. We don't bypass DRM, authentication, private-content restrictions or platform access controls. Please respect creators and each platform's terms.";
