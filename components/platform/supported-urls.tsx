import { Info } from "lucide-react";
import { Section } from "@/components/sections/section";
import type { ToolPageContent } from "@/lib/content/types";

export function SupportedUrls({ page }: { page: ToolPageContent }) {
  return (
    <Section id="supported-urls" eyebrow="Supported URLs" title="Links you can paste" muted>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-6">
        <ul className="flex flex-col gap-2.5">
          {page.supportedUrls.map((u) => (
            <li key={u.label} className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold">{u.label}</p>
              <code className="mt-1 block font-mono text-[13px] break-all text-muted-foreground">{u.example}</code>
            </li>
          ))}
        </ul>
        <aside className="rounded-2xl border bg-card p-6" aria-labelledby="availability-heading">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <Info className="size-5" aria-hidden="true" />
          </span>
          <h3 id="availability-heading" className="mt-4 text-lg font-semibold">
            {page.availability.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{page.availability.body}</p>
        </aside>
      </div>
    </Section>
  );
}
