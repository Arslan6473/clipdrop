import Link from "next/link";
import { ALL_PLATFORM_LINKS, TOOL_NAV } from "@/lib/config/navigation";
import { siteConfig } from "@/lib/config/site";
import { Logo } from "./logo";

const INFO_LINKS = [
  { name: "How It Works", href: "/#how-it-works" },
  { name: "FAQ", href: "/#faq" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Copyright", href: "/copyright" },
];

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded text-[15px] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-[15px] text-muted-foreground">{siteConfig.footerTagline}</p>
          </div>
          <FooterColumn title="Video Downloaders" links={ALL_PLATFORM_LINKS} />
          <FooterColumn title="Tools" links={TOOL_NAV} />
          <FooterColumn title="Information" links={INFO_LINKS} />
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}
          </p>
          <p>Use responsibly and respect content ownership and platform rules.</p>
        </div>
      </div>
    </footer>
  );
}
