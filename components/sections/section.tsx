import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  muted,
  className,
  align = "center",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
  align?: "center" | "left";
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-20 py-16 sm:py-24", muted && "bg-muted/60", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
          {eyebrow && <p className="text-sm font-semibold text-primary">{eyebrow}</p>}
          <h2 id={headingId} className="mt-2 text-3xl font-bold sm:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-3 text-base text-muted-foreground sm:text-[17px]">{description}</p>}
        </div>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
