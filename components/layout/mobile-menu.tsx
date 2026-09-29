"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PlatformIcon } from "@/components/platform/platform-icon";
import { ALL_PLATFORM_LINKS, TOOL_NAV } from "@/lib/config/navigation";
import { LogoMark } from "./logo";
import { StartDownloadingButton } from "./start-button";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "@/lib/config/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-full text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm gap-0 overflow-y-auto p-0">
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <LogoMark />
          <SheetTitle className="text-[17px] font-semibold">{siteConfig.name}</SheetTitle>
          <SheetDescription className="sr-only">Video downloader tools</SheetDescription>
        </div>
        <nav aria-label="Mobile" className="flex flex-col gap-6 px-3 py-5">
          <div>
            <p className="px-2 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Platforms</p>
            <ul className="flex flex-col">
              {ALL_PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex min-h-12 items-center gap-3 rounded-xl px-2 text-[15px] font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <PlatformIcon platform={link.platform!} size="sm" />
                    <span className="flex-1">{link.name} Downloader</span>
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="px-2 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Tools</p>
            <ul className="flex flex-col">
              {TOOL_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex min-h-12 items-center justify-between rounded-xl px-2 text-[15px] font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {link.name}
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="mt-auto flex items-center gap-2 border-t px-5 py-4">
          <StartDownloadingButton className="h-11 flex-1" onNavigate={close} />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
