/**
 * Brand + site configuration. Change the name, tagline or URL here and it
 * propagates to the navbar, footer, metadata and structured data.
 */
export const siteConfig = {
  name: "ClipDrop",
  tagline: "Simple video downloads, wherever you're watching.",
  footerTagline: "Simple video downloads for content you're allowed to save.",
  description:
    "ClipDrop is a free online video downloader. Paste a supported video link, see the available formats and download content you own or are allowed to save. No signup required.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://clipdrop.example").replace(/\/+$/, ""),
  copyrightYear: 2026,
  contactEmail: "copyright@clipdrop.example",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
