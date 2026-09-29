import type { Metadata } from "next";
import { PlatformPage } from "@/components/platform/platform-page";
import { TOOL_PAGES } from "@/lib/content/tool-pages";
import { buildMetadata } from "@/lib/seo/metadata";

const page = TOOL_PAGES.mp4;

export function generateMetadata(): Metadata {
  return buildMetadata({ ...page.meta, path: page.path });
}

export default function Page() {
  return <PlatformPage page={page} />;
}
