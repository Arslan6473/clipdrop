"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <h1 className="text-4xl font-bold sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground">Please try again. If the problem continues, come back in a little while.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
