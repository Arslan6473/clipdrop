import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/config/navigation";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { MoreMenu } from "./more-menu";
import { StartDownloadingButton } from "./start-button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.name}
            </Link>
          ))}
          <MoreMenu />
        </nav>
        <div className="ml-auto hidden items-center gap-1.5 lg:flex">
          <ThemeToggle />
          <StartDownloadingButton />
        </div>
        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
