"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Jumps to the downloader on the current page, or to the homepage one when there isn't one. */
export function StartDownloadingButton({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/#downloader"
      onClick={(event) => {
        onNavigate?.();
        const input = document.getElementById("video-url");
        if (!input) return;
        event.preventDefault();
        document.getElementById("downloader")?.scrollIntoView({ block: "center" });
        input.focus({ preventScroll: true });
      }}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-soft transition-[background-color,transform] outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px",
        className,
      )}
    >
      Start Downloading
      <ArrowDown className="size-4" aria-hidden="true" />
    </Link>
  );
}
