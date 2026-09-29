import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/config/site";

/**
 * Builds unique, complete metadata for a page: title, description, canonical URL,
 * OpenGraph and X/Twitter cards. Titles get the " | ClipDrop" suffix from the root template.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Use the title as-is, without the site-name template. */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const url = absoluteUrl(path);
  const images = [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.tagline}` }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}
