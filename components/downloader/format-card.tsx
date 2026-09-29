"use client";

import { useEffect, useState } from "react";
import { Check, Download, ExternalLink, Loader2 } from "lucide-react";
import { createDownloadRequest } from "@/lib/api/client";
import type { DownloadResult, VideoFormat } from "@/lib/providers/types";
import { formatSize } from "@/lib/utils/format-size";
import { cn } from "@/lib/utils";

type DownloadState =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "ready"; download: DownloadResult }
  | { status: "error"; message: string };

function triggerBrowserDownload({ downloadUrl, filename, attachment }: DownloadResult) {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  // Attachment responses download without leaving the page; other files open in a new tab.
  if (!attachment) link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function FormatCard({ format, videoUrl }: { format: VideoFormat; videoUrl: string }) {
  const [state, setState] = useState<DownloadState>({ status: "idle" });
  const size = formatSize(format.sizeBytes);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (state.status !== "preparing") return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [state.status]);

  async function download() {
    if (state.status === "preparing") return;
    setState({ status: "preparing" });
    const result = await createDownloadRequest(videoUrl, format.id);
    if (!result.success) {
      setState({ status: "error", message: result.message });
      return;
    }
    setState({ status: "ready", download: result.download });
    triggerBrowserDownload(result.download);
  }

  return (
    <li className="@container rounded-xl border bg-background p-4 transition-[border-color,box-shadow] hover:border-foreground/15 hover:shadow-soft">
      <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:gap-4">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 @md:justify-start @md:gap-4">
          <div className="min-w-0">
            <p className="text-lg leading-tight font-semibold">{format.label}</p>
            {format.description && <p className="text-sm text-muted-foreground">{format.description}</p>}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 @md:ml-auto">
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tracking-wide">{format.container}</span>
            {size && <span className="text-sm text-muted-foreground tabular-nums">{size}</span>}
          </div>
        </div>
        <button
          type="button"
          onClick={download}
          disabled={state.status === "preparing"}
          aria-live="polite"
          className={cn(
            "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold outline-none transition-[background-color,transform] focus-visible:ring-4 focus-visible:ring-ring/40 active:translate-y-px disabled:cursor-wait @md:h-11 @md:w-44",
            state.status === "ready"
              ? "bg-success/12 text-success hover:bg-success/18"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {state.status === "preparing" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Preparing…
            </>
          ) : state.status === "ready" ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              Download ready
            </>
          ) : (
            <>
              Download
              <Download className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      {state.status === "preparing" && slow && (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          Preparing your file. HD videos can take a minute or two, so keep this page open.
        </p>
      )}
      {state.status === "ready" && (
        <p className="mt-3 text-sm text-muted-foreground">
          Your browser should start the download.{" "}
          <a
            href={state.download.downloadUrl}
            download={state.download.filename}
            target={state.download.attachment ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Didn&apos;t start? Open the file
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {state.message}
        </p>
      )}
    </li>
  );
}
