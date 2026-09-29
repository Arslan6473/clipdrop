"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, Clock, Link2Off, Lock, RotateCcw, SearchX, Ban } from "lucide-react";
import type { ErrorCode } from "@/lib/providers/errors";
import { ERROR_MESSAGES } from "@/lib/providers/errors";

const ERROR_UI: Partial<Record<ErrorCode, { title: string; icon: typeof AlertCircle }>> = {
  INVALID_URL: { title: "Invalid URL", icon: Link2Off },
  UNSUPPORTED_URL: { title: "Unsupported URL", icon: Link2Off },
  PRIVATE_CONTENT: { title: "Private video", icon: Lock },
  NOT_FOUND: { title: "Video not found", icon: SearchX },
  DOWNLOADS_UNAVAILABLE: { title: "Downloads unavailable", icon: Ban },
  PROVIDER_UNAVAILABLE: { title: "Temporarily unavailable", icon: Clock },
  RATE_LIMITED: { title: "Slow down a little", icon: Clock },
  SERVER_BUSY: { title: "Busy right now", icon: Clock },
  FILE_TOO_LARGE: { title: "Video too large", icon: Ban },
  REGION_BLOCKED: { title: "Not available here", icon: Ban },
};

export function ErrorState({ code, onRetry }: { code: ErrorCode; onRetry: () => void }) {
  const ui = ERROR_UI[code] ?? { title: "Something went wrong", icon: AlertCircle };
  const Icon = ui.icon;
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => buttonRef.current?.focus(), []);

  return (
    <div role="alert" className="flex animate-fade-up flex-col items-center px-2 py-6 text-center sm:py-8">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-semibold">{ui.title}</h2>
      <p className="mt-1.5 max-w-md text-[15px] text-muted-foreground">{ERROR_MESSAGES[code]}</p>
      <button
        ref={buttonRef}
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-soft outline-none hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-ring/40 sm:w-auto"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Try another URL
      </button>
    </div>
  );
}
