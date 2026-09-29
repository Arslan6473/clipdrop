import { Downloader } from "@/components/downloader/downloader";

/** The shared Downloader, configured for a specific tool page. */
export function PlatformDownloader({ placeholder }: { placeholder: string }) {
  return <Downloader placeholder={placeholder} buttonLabel="Analyze Video" />;
}
