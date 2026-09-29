/**
 * Error codes shared by the API and the UI. Messages are user-facing and must
 * never contain provider responses, stack traces or internal details.
 */
export const ERROR_MESSAGES = {
  INVALID_URL: "Please enter a valid supported video URL.",
  UNSUPPORTED_URL: "We couldn't recognize this video link. Check the URL and try again.",
  PRIVATE_CONTENT:
    "This video appears to require authentication. Private or login-protected videos aren't supported.",
  NOT_FOUND: "We couldn't find this video. It may have been removed or the link may be incomplete.",
  DOWNLOADS_UNAVAILABLE: "Downloads aren't currently available for this source.",
  FORMAT_NOT_FOUND: "That format is no longer available. Analyze the video again to refresh the options.",
  PROVIDER_UNAVAILABLE: "This platform is temporarily unavailable. Please try again later.",
  RATE_LIMITED: "You're going a little fast. Please wait a moment and try again.",
  BAD_REQUEST: "Something about that request wasn't right. Please try again.",
  PAYLOAD_TOO_LARGE: "That request is too large.",
  REGION_BLOCKED: "This video isn't available in our download server's region.",
  FILE_TOO_LARGE: "This video is too large to download here. Try a lower quality.",
  SERVER_BUSY: "We're preparing a lot of downloads right now. Please try again in a minute.",
  DOWNLOAD_EXPIRED: "This download link has expired. Choose the format again to prepare a new one.",
  INTERNAL_ERROR: "Something went wrong on our side. Please try again.",
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;

export const ERROR_STATUS: Record<ErrorCode, number> = {
  INVALID_URL: 400,
  UNSUPPORTED_URL: 422,
  PRIVATE_CONTENT: 403,
  NOT_FOUND: 404,
  DOWNLOADS_UNAVAILABLE: 422,
  FORMAT_NOT_FOUND: 404,
  PROVIDER_UNAVAILABLE: 503,
  RATE_LIMITED: 429,
  BAD_REQUEST: 400,
  PAYLOAD_TOO_LARGE: 413,
  REGION_BLOCKED: 451,
  FILE_TOO_LARGE: 413,
  SERVER_BUSY: 503,
  DOWNLOAD_EXPIRED: 410,
  INTERNAL_ERROR: 500,
};

export class ProviderError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, internalMessage?: string) {
    super(internalMessage ?? code);
    this.name = "ProviderError";
    this.code = code;
  }
}

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && value in ERROR_MESSAGES;
}
