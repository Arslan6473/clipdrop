import { Scale } from "lucide-react";
import Link from "next/link";

export function UsageNotice({ text }: { text: string }) {
  return (
    <section aria-labelledby="usage-notice-heading" className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:p-7">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Scale className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="usage-notice-heading" className="text-lg font-semibold">
              Usage notice
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
            <p className="mt-3 text-sm">
              <Link href="/terms" className="font-medium underline underline-offset-4 hover:text-primary">
                Terms
              </Link>
              <span className="mx-2 text-muted-foreground" aria-hidden="true">·</span>
              <Link href="/copyright" className="font-medium underline underline-offset-4 hover:text-primary">
                Copyright
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
