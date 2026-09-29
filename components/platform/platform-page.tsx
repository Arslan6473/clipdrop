import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Section } from "@/components/sections/section";
import { UsageNotice } from "@/components/sections/usage-notice";
import { WebAppSchema } from "@/components/seo/web-app-schema";
import type { ToolPageContent } from "@/lib/content/types";
import { downloaderEnabled } from "@/lib/config/features";
import { siteConfig } from "@/lib/config/site";
import { DOWNLOADER_COPY } from "@/lib/content/downloader-copy";
import { Breadcrumbs } from "./breadcrumbs";
import { PlatformFAQ } from "./platform-faq";
import { PlatformHero } from "./platform-hero";
import { RelatedTools } from "./related-tools";
import { SupportedUrls } from "./supported-urls";

/** Shared template for every tool page; each page only supplies its content. */
export function PlatformPage({ page: base }: { page: ToolPageContent }) {
  const override = downloaderEnabled() ? DOWNLOADER_COPY[base.path] : undefined;
  const page: ToolPageContent = override ? { ...base, availability: override.availability, faqs: override.faqs ?? base.faqs } : base;
  return (
    <>
      <WebAppSchema name={`${siteConfig.name} ${page.name}`} description={page.meta.description} path={page.path} />
      <PlatformHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        placeholder={page.inputPlaceholder}
        platform={page.platform}
        breadcrumbs={<Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.name, path: page.path }]} />}
      />
      <HowItWorks muted description={`Five quick steps with the ${page.name.replace(/ Downloader$/, "")} tool.`} />
      <SupportedUrls page={page} />
      <Features id="features" title={`${page.hero.title} features`} items={page.features} />
      <Section id="why" eyebrow={`Why ${siteConfig.name}`} title={page.why.title} muted>
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-[17px]">{page.why.body}</p>
      </Section>
      {page.extra && (
        <Section id="details" eyebrow="Good to know" title={page.extra.title}>
          <div className="mx-auto flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            {page.extra.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>
      )}
      <PlatformFAQ faqs={page.faqs} title={`${page.hero.title} FAQ`} muted={!!page.extra} />
      <RelatedTools paths={page.related} muted={!page.extra} />
      <UsageNotice text={page.notice} />
    </>
  );
}
