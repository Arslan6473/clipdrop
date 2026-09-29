"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Clock, ExternalLink, FileVideo, RotateCcw, User } from "lucide-react";
import { BrandIcon } from "@/components/platform/brand-icon";
import type { AnalyzeResponse } from "@/lib/providers/types";
import { formatDuration } from "@/lib/utils/format-duration";
import { FormatList } from "./format-list";

export function VideoResult({
  data,
  sourceUrl,
  onReset,
}: {
  data: AnalyzeResponse;
  /** The URL the user analyzed; download requests are made against the same URL. */
  sourceUrl: string;
  onReset: () => void;
}) {
  const { video, formats, notice } = data;
  const duration = formatDuration(video.durationSeconds);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <article className="animate-fade-up text-left">
      <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border">
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 320px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-secondary text-muted-foreground">
              {video.source === "direct" ? (
                <FileVideo className="size-10" aria-hidden="true" />
              ) : (
                <BrandIcon platform={video.source} className="size-10 opacity-70" />
              )}
            </div>
          )}
          {duration && (
            <span className="absolute right-2 bottom-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
              {duration}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            {video.source !== "direct" && <BrandIcon platform={video.source} className="size-3.5" />}
            {video.sourceName}
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 line-clamp-3 text-xl leading-snug font-semibold break-words outline-none sm:text-[22px]"
            title={video.title}
          >
            {video.title}
          </h2>
          <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {video.author && (
              <div className="flex min-w-0 items-center gap-1.5">
                <dt className="sr-only">Author</dt>
                <User className="size-4 shrink-0" aria-hidden="true" />
                <dd className="truncate">{video.author}</dd>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Duration</dt>
                <Clock className="size-4" aria-hidden="true" />
                <dd className="tabular-nums">{duration}</dd>
              </div>
            )}
          </dl>
          <a
            href={video.pageUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-2 inline-flex w-fit items-center gap-1 rounded text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            View original
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>

          <div className="mt-5">
            <FormatList formats={formats} videoUrl={sourceUrl} notice={notice} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center border-t pt-5">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Analyze another video
        </button>
      </div>
    </article>
  );
}
