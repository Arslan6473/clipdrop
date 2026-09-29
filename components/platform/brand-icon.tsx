import type { SVGProps } from "react";
import type { PlatformId } from "@/lib/platforms/platforms";
import { BRAND_ICON_PATHS } from "./brand-icon-paths";

export function BrandIcon({ platform, ...props }: { platform: PlatformId } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d={BRAND_ICON_PATHS[platform]} />
    </svg>
  );
}
