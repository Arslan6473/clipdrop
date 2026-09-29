import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";
import { TOOL_PAGE_LIST } from "@/lib/content/tool-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-29");
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...TOOL_PAGE_LIST.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...["/privacy", "/terms", "/copyright"].map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
