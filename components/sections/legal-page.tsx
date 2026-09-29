import { Breadcrumbs } from "@/components/platform/breadcrumbs";

export function LegalPage({
  title,
  path,
  updated,
  intro,
  sections,
}: {
  title: string;
  path: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: React.ReactNode }[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-16">
      <div className="text-center">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path }]} />
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">{intro}</p>
      </div>
      <div className="mt-12 flex flex-col gap-4">
        {sections.map((s) => (
          <section key={s.heading} className="rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{s.heading}</h2>
            <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
