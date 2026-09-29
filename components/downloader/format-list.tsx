import { Info } from "lucide-react";
import type { VideoFormat } from "@/lib/providers/types";
import { FormatCard } from "./format-card";

export function FormatList({ formats, videoUrl, notice }: { formats: VideoFormat[]; videoUrl: string; notice?: string }) {
  return (
    <section aria-labelledby="formats-heading">
      <h3 id="formats-heading" className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Available downloads
      </h3>
      {formats.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2.5">
          {formats.map((format) => (
            <FormatCard key={format.id} format={format} videoUrl={videoUrl} />
          ))}
        </ul>
      ) : (
        <div className="mt-3 flex gap-3 rounded-xl border border-dashed bg-muted/60 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="text-left">
            <p className="font-medium">{notice ?? "Downloads aren't currently available for this source."}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We found the video, but there are no download options for it right now. Private and DRM-protected videos
              are never supported.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
