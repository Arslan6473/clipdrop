import type { SourceId } from "@/lib/platforms/platforms";

export interface VideoInfo {
  source: SourceId;
  /** Human-readable source name, e.g. "YouTube". */
  sourceName: string;
  title: string;
  /** Canonical page URL of the video. */
  pageUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  author?: string;
  /** Why no downloads are offered, when the reason is known (e.g. the platform is blocking us). */
  downloadNotice?: string;
}

export interface VideoFormat {
  /** Opaque ID passed back to createDownload. */
  id: string;
  /** Primary label, e.g. "1080p" or "Original file". */
  label: string;
  /** Secondary label, e.g. "HD Video". */
  description?: string;
  /** Container, e.g. "MP4". */
  container: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  hasAudio?: boolean;
}

export interface DownloadResult {
  /** HTTPS URL the browser can fetch directly. */
  downloadUrl: string;
  /** Sanitised suggested filename. */
  filename: string;
  /** ISO timestamp after which the link may stop working. */
  expiresAt?: string;
  /** True when the server sends Content-Disposition: attachment, so the page can download in place. */
  attachment?: boolean;
}

export interface VideoProvider {
  name: string;
  source: SourceId;
  canHandle(url: URL): boolean;
  analyze(url: URL): Promise<VideoInfo>;
  /** Only formats the source actually offers via an authorised mechanism. Empty = none available. */
  getFormats(url: URL): Promise<VideoFormat[]>;
  createDownload(url: URL, formatId: string): Promise<DownloadResult>;
}

/** Shape returned by POST /api/video/analyze on success. */
export interface AnalyzeResponse {
  success: true;
  video: VideoInfo;
  formats: VideoFormat[];
  /** Present when the source was recognised but offers no downloads. */
  notice?: string;
}

export interface DownloadResponse {
  success: true;
  download: DownloadResult;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
}
