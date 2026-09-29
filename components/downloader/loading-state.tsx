"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const STAGES = ["Fetching video details", "Fetching available formats", "Almost there"];

export function LoadingState({ url, onCancel }: { url: string; onCancel: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [setTimeout(() => setStage(1), 1200), setTimeout(() => setStage(2), 4500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div role="status" aria-live="polite" aria-busy="true" className="animate-fade-up">
      <div className="relative h-1 overflow-hidden rounded-full bg-muted">
        <div className="absolute inset-y-0 w-2/5 animate-progress rounded-full bg-primary/80" />
      </div>
      <div className="mt-5 flex items-start gap-3">
        <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1 text-left">
          <p className="font-semibold">Analyzing video…</p>
          <p className="text-sm text-muted-foreground">{STAGES[stage]}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground/80" title={url}>
            {url}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Cancel
        </button>
      </div>

      <div aria-hidden="true" className="mt-6 grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
      <span className="sr-only">Analyzing video, please wait.</span>
    </div>
  );
}
