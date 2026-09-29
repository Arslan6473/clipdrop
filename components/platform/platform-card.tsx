import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import type { PlatformId } from "@/lib/platforms/platforms";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "./platform-icon";

export function PlatformCard({
  href,
  name,
  platform,
  description,
  className,
}: {
  href: string;
  name: string;
  platform?: PlatformId;
  description?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-200 outline-none hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-ring/30",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        {platform ? (
          <PlatformIcon platform={platform} size="lg" />
        ) : (
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-primary">
            <Globe className="size-6" aria-hidden="true" />
          </span>
        )}
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>
      <p className="mt-4 font-semibold">{name}</p>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
    </Link>
  );
}
