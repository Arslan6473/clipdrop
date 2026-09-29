import type { PlatformId } from "@/lib/platforms/platforms";
import { PlatformChips } from "./platform-chips";
import { PlatformDownloader } from "./platform-downloader";
import { PlatformIcon } from "./platform-icon";

export const SUPPORT_LINE =
  "Works with supported public URLs from YouTube, Instagram, TikTok and Facebook.";

export function PlatformHero({
  eyebrow,
  title,
  description,
  placeholder,
  platform,
  headingLevel = "h1",
  breadcrumbs,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description: string;
  placeholder: string;
  platform?: PlatformId;
  headingLevel?: "h1";
  breadcrumbs?: React.ReactNode;
}) {
  const Heading = headingLevel;
  return (
    <section className="relative overflow-hidden">
      {/* Soft glow behind the hero; purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[520px] max-w-4xl rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand)_16%,transparent),transparent)] blur-2xl"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 pb-14 text-center sm:px-6 sm:pt-16 sm:pb-20">
        {breadcrumbs}
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium shadow-soft">
            {platform && <PlatformIcon platform={platform} size="sm" className="size-5 rounded-md [&_svg]:size-3" />}
            {eyebrow}
          </p>
        )}
        <Heading className="mt-5 text-[2.5rem] leading-[1.05] font-bold tracking-tight sm:text-6xl">{title}</Heading>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-8 w-full sm:mt-10">
          <PlatformDownloader placeholder={placeholder} />
        </div>
        <p className="mt-4 max-w-lg text-sm text-muted-foreground">{SUPPORT_LINE}</p>
        <div className="mt-8 w-full sm:w-[min(52rem,calc(100vw-3rem))]">
          <PlatformChips current={platform} />
        </div>
      </div>
    </section>
  );
}
