import type { PlatformId } from "@/lib/platforms/platforms";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface ToolPageContent {
  path: string;
  /** Short name used in breadcrumbs and related-tool cards. */
  name: string;
  platform?: PlatformId;
  meta: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; title: string; description: string };
  inputPlaceholder: string;
  /** Honest summary of what's actually available for this source. */
  availability: { title: string; body: string };
  supportedUrls: { label: string; example: string }[];
  features: FeatureItem[];
  why: { title: string; body: string };
  faqs: FaqItem[];
  related: string[];
  notice: string;
  /** Optional extra section, used by the Video to MP4 page. */
  extra?: { title: string; paragraphs: string[] };
}
