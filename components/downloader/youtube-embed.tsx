"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-play YouTube player. Shows the thumbnail with a play button and only loads YouTube's
 * official embed (privacy-enhanced youtube-nocookie.com) once the user asks for it, so nothing
 * from YouTube loads — and no YouTube cookies are set — until then.
 */
export function YouTubeEmbed({
  videoId,
  title,
  thumbnailUrl,
}: {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = thumbnailUrl ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group/play absolute inset-0 size-full cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:ring-inset"
    >
      <Image src={thumb} alt="" fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
      <span className="absolute inset-0 bg-black/10 transition-colors group-hover/play:bg-black/25" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 inline-flex size-14 -translate-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lift backdrop-blur-sm transition-transform group-hover/play:scale-110 sm:size-16"
      >
        <Play className="ml-0.5 size-6 fill-current sm:size-7" />
      </span>
    </button>
  );
}
