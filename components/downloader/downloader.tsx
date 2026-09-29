"use client";

import { useEffect, useRef, useState } from "react";
import { analyzeVideoRequest } from "@/lib/api/client";
import { validateVideoUrl } from "@/lib/platforms/validate-url";
import { ERROR_MESSAGES, type ErrorCode } from "@/lib/providers/errors";
import type { AnalyzeResponse } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { ErrorState } from "./error-state";
import { LoadingState } from "./loading-state";
import { UrlInput } from "./url-input";
import { VideoResult } from "./video-result";

type State =
  | { status: "idle" }
  | { status: "analyzing"; url: string }
  | { status: "success"; url: string; data: AnalyzeResponse }
  | { status: "error"; code: ErrorCode };

export interface DownloaderProps {
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const STEPS = ["Paste", "Analyze", "Download"] as const;

function Steps({ active }: { active: number }) {
  return (
    <ol className="flex items-center justify-center gap-1.5 text-[13px] sm:gap-3 sm:text-sm" aria-label="Download steps">
      {STEPS.map((label, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <li key={label} className="flex items-center gap-1.5 sm:gap-3" aria-current={current ? "step" : undefined}>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-medium transition-colors",
                current ? "text-foreground" : done ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  current
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-brand-soft text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-3 bg-border min-[360px]:w-5 sm:w-8" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export function Downloader({ placeholder = "Paste video URL…", buttonLabel, className }: DownloaderProps) {
  const [value, setValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const focusInputRef = useRef(false);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (state.status === "idle" && focusInputRef.current) {
      focusInputRef.current = false;
      inputRef.current?.focus();
    }
  }, [state.status]);

  async function analyze() {
    const checked = validateVideoUrl(value);
    if (!checked.ok) {
      setInputError(value.trim() ? ERROR_MESSAGES.INVALID_URL : "Paste a video link to get started.");
      inputRef.current?.focus();
      return;
    }
    setInputError(null);
    const url = checked.url.href;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "analyzing", url });

    try {
      const result = await analyzeVideoRequest(url, controller.signal);
      if (controller.signal.aborted) return;
      setState(result.success ? { status: "success", url, data: result } : { status: "error", code: result.code });
    } catch {
      // Aborted by the user — state was already reset.
    }
  }

  function reset({ clear }: { clear: boolean }) {
    abortRef.current?.abort();
    if (clear) setValue("");
    focusInputRef.current = true;
    setState({ status: "idle" });
  }

  const activeStep = state.status === "success" ? 2 : state.status === "analyzing" ? 1 : value.trim() ? 1 : 0;

  return (
    <div id="downloader" className={cn("w-full scroll-mt-24", className)}>
      <div className="rounded-3xl border bg-card p-3 shadow-lift sm:p-4">
        {state.status === "idle" && (
          <UrlInput
            ref={inputRef}
            value={value}
            onChange={(v) => {
              setValue(v);
              if (inputError) setInputError(null);
            }}
            onSubmit={analyze}
            placeholder={placeholder}
            error={inputError}
            buttonLabel={buttonLabel}
          />
        )}
        {state.status !== "idle" && (
          <div className="p-2 sm:p-3">
            {state.status === "analyzing" && <LoadingState url={state.url} onCancel={() => reset({ clear: false })} />}
            {state.status === "success" && (
              <VideoResult data={state.data} sourceUrl={state.url} onReset={() => reset({ clear: true })} />
            )}
            {state.status === "error" && <ErrorState code={state.code} onRetry={() => reset({ clear: true })} />}
          </div>
        )}
      </div>
      <div className="mt-5">
        <Steps active={activeStep} />
      </div>
    </div>
  );
}
