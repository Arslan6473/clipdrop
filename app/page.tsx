import { PlatformCard } from "@/components/platform/platform-card";
import { PlatformFAQ } from "@/components/platform/platform-faq";
import { PlatformGrid } from "@/components/platform/platform-grid";
import { PlatformHero } from "@/components/platform/platform-hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Section } from "@/components/sections/section";
import { UsageNotice } from "@/components/sections/usage-notice";
import { WebAppSchema, WebsiteSchema } from "@/components/seo/web-app-schema";
import { downloaderEnabled } from "@/lib/config/features";
import { siteConfig } from "@/lib/config/site";
import { FEATURES, HOME_FAQS, HOME_NOTICE } from "@/lib/content/home";
import { TOOL_PAGE_LIST } from "@/lib/content/tool-pages";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "ClipDrop is a free online video downloader. Paste a link from YouTube, Instagram, TikTok or Facebook, see the available formats and download content you're allowed to save.";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — Video Downloader Online`,
  absoluteTitle: true,
  description: DESCRIPTION,
  path: "/",
  keywords: ["video downloader", "online video downloader", "video downloader online", "download video", "video download tool"],
});

const DOWNLOADER_PLATFORMS_ANSWER =
  "ClipDrop downloads public videos from Instagram, TikTok and Facebook, plus direct links to video files. YouTube links show the video's details; YouTube currently blocks downloads from our servers. Private, login-protected and DRM-protected content isn't supported.";

export default function HomePage() {
  const faqs = downloaderEnabled()
    ? HOME_FAQS.map((f, i) => (i === 1 ? { ...f, answer: DOWNLOADER_PLATFORMS_ANSWER } : f))
    : HOME_FAQS;
  return (
    <>
      <WebsiteSchema />
      <WebAppSchema name={siteConfig.name} description={DESCRIPTION} path="/" />
      <PlatformHero
        title={
          <>
            Download videos.
            <br />
            <span className="text-muted-foreground">Simple. Fast. Anywhere.</span>
          </>
        }
        description="Paste a supported video link and choose an available download format."
        placeholder="Paste video URL…"
      />

      <Section
        id="platforms"
        eyebrow="Supported platforms"
        title="Works with the links you already have"
        description="Every platform sets its own rules. Here's what ClipDrop can do for each one today."
        muted
      >
        <PlatformGrid />
      </Section>

      <HowItWorks />

      <Features
        title="Everything you need, nothing you don't"
        description="A focused tool that does one job well."
        items={FEATURES}
        muted
      />

      <Section id="tools" eyebrow="Platform tools" title="Pick a dedicated tool" description="Each tool is tuned for its platform's link formats.">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {TOOL_PAGE_LIST.map((tool) => (
            <li key={tool.path}>
              <PlatformCard href={tool.path} name={tool.name} platform={tool.platform} />
            </li>
          ))}
        </ul>
      </Section>

      <PlatformFAQ faqs={faqs} muted />
      <UsageNotice text={HOME_NOTICE} />
    </>
  );
}
