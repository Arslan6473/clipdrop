"use client";

import { forwardRef, useEffect, useState } from "react";
import { ArrowRight, ClipboardPaste, Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  error?: string | null;
  buttonLabel?: string;
}

export const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(function UrlInput(
  { value, onChange, onSubmit, placeholder, error, buttonLabel = "Analyze Video" },
  ref,
) {
  const [canPaste, setCanPaste] = useState(false);
  useEffect(() => {
    // Clipboard reads are only offered where the browser supports them.
    setCanPaste(typeof navigator !== "undefined" && typeof navigator.clipboard?.readText === "function");
  }, []);

  async function paste() {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) onChange(text.slice(0, 2048));
    } catch {
      // Permission denied — the user can still paste manually.
    }
  }

  const errorId = "video-url-error";

  return (
    <div>
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2"
    >
      <div
        className={cn(
          "group relative flex min-w-0 flex-1 items-center rounded-2xl border bg-background transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/15",
        )}
      >
        <Link2 className="pointer-events-none absolute left-4 size-5 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="video-url" className="sr-only">
          Video URL
        </label>
        <input
          ref={ref}
          id="video-url"
          name="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="go"
          maxLength={2048}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-[60px] w-full min-w-0 truncate rounded-2xl bg-transparent pr-[6.5rem] pl-12 text-base outline-none placeholder:text-muted-foreground/80 sm:h-16"
        />
        <div className="absolute right-2 flex items-center">
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label="Clear URL"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : (
            canPaste && (
              <button
                type="button"
                onClick={paste}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ClipboardPaste className="size-4" aria-hidden="true" />
                Paste
              </button>
            )
          )}
        </div>
      </div>
      <button
        type="submit"
        className="group/btn inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow,transform] outline-none hover:bg-primary/90 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-ring/40 active:translate-y-px sm:h-16"
      >
        {buttonLabel}
        <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
      </button>
    </form>
    {error && (
      <p id={errorId} role="alert" className="mt-2.5 px-1 text-left text-sm font-medium text-destructive">
        {error}
      </p>
    )}
    </div>
  );
});
