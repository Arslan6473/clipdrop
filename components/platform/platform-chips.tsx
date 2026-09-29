import Link from "next/link";
import { PLATFORM_LIST, type PlatformId } from "@/lib/platforms/platforms";
import { cn } from "@/lib/utils";
import { BrandIcon } from "./brand-icon";

/** "Choose a platform" row under the hero input. Scrolls horizontally on small screens. */
export function PlatformChips({ current }: { current?: PlatformId }) {
  return (
    <nav aria-label="Choose a platform" className="w-full">
      <p className="text-sm font-medium text-muted-foreground">Choose a platform</p>
      <ul className="scrollbar-none -mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {PLATFORM_LIST.map((p) => {
          const active = p.id === current;
          const mono = p.color === "#000000";
          return (
            <li key={p.id} className="snap-start">
              <Link
                href={p.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium whitespace-nowrap shadow-soft transition-[transform,border-color,background-color] duration-150 outline-none hover:-translate-y-px hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50",
                  active && "border-primary/50 bg-brand-soft",
                )}
              >
                <BrandIcon
                  platform={p.id}
                  className={cn("size-4", mono ? "text-foreground" : "text-(--c)")}
                  style={mono ? undefined : ({ "--c": p.color } as React.CSSProperties)}
                />
                {p.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
