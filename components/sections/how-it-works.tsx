import { HOW_IT_WORKS_STEPS } from "@/lib/content/home";
import { Section } from "./section";

export function HowItWorks({
  id = "how-it-works",
  title = "How it works",
  description = "From link to file in a few seconds. No account, no app, no extension.",
  muted,
}: {
  id?: string;
  title?: string;
  description?: string;
  muted?: boolean;
}) {
  return (
    <Section id={id} eyebrow="How it works" title={title} description={description} muted={muted}>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <li key={step.title} className="relative rounded-2xl border bg-card p-5 shadow-soft">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-primary">
              {i + 1}
            </span>
            <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
