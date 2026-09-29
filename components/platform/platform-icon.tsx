import { cn } from "@/lib/utils";
import { PLATFORMS, type PlatformId } from "@/lib/platforms/platforms";
import { BrandIcon } from "./brand-icon";

const SIZES = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-10 rounded-xl [&_svg]:size-5",
  lg: "size-12 rounded-2xl [&_svg]:size-6",
} as const;

/** Brand glyph on a soft tinted tile. Monochrome brands (X, TikTok) follow the text color. */
export function PlatformIcon({
  platform,
  size = "md",
  className,
}: {
  platform: PlatformId;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const color = PLATFORMS[platform].color;
  const mono = color === "#000000";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        mono ? "bg-foreground/[0.06] text-foreground" : "bg-(--c)/10 text-(--c)",
        SIZES[size],
        className,
      )}
      style={mono ? undefined : ({ "--c": color } as React.CSSProperties)}
    >
      <BrandIcon platform={platform} />
    </span>
  );
}
