import { Download, Layers, ShieldCheck, Smartphone, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import type { FeatureItem } from "@/lib/content/types";
import { Section } from "./section";

const ICONS = { zap: Zap, sparkles: Sparkles, layers: Layers, smartphone: Smartphone, shield: ShieldCheck, download: Download };

export function Features({
  id = "features",
  eyebrow = "Features",
  title,
  description,
  items,
  muted,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  items: (FeatureItem & { icon?: keyof typeof ICONS })[];
  muted?: boolean;
}) {
  return (
    <Section id={id} eyebrow={eyebrow} title={title} description={description} muted={muted}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {items.map((item) => {
          const Icon = item.icon ? ICONS[item.icon] : CheckCircle2;
          return (
            <li
              key={item.title}
              className="rounded-2xl border bg-card p-6 shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
