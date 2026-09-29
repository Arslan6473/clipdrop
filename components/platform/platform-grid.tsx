import { downloaderEnabled } from "@/lib/config/features";
import { PLATFORM_AVAILABILITY_WITH_DOWNLOADER } from "@/lib/content/downloader-copy";
import { PLATFORM_AVAILABILITY } from "@/lib/content/home";
import { PLATFORM_LIST } from "@/lib/platforms/platforms";
import { PlatformCard } from "./platform-card";

/** All supported platforms plus the universal tool. */
export function PlatformGrid() {
  const availability = downloaderEnabled() ? PLATFORM_AVAILABILITY_WITH_DOWNLOADER : PLATFORM_AVAILABILITY;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4 [&>li:last-child]:col-span-2 sm:[&>li:last-child]:col-span-1">
      {PLATFORM_LIST.map((p) => (
        <li key={p.id}>
          <PlatformCard href={p.href} name={p.name} platform={p.id} description={availability[p.id]} />
        </li>
      ))}
      <li>
        <PlatformCard href="/universal-video-downloader" name="Any link" description="Auto-detect & direct files" />
      </li>
    </ul>
  );
}
