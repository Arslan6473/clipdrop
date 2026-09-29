import { ERROR_MESSAGES, isErrorCode, type ErrorCode } from "@/lib/providers/errors";
import type { AnalyzeResponse, DownloadResponse } from "@/lib/providers/types";

export interface ClientError {
  success: false;
  code: ErrorCode;
  message: string;
}

const clientError = (code: ErrorCode): ClientError => ({ success: false, code, message: ERROR_MESSAGES[code] });

/** POSTs JSON and always resolves to either the success payload or a friendly error — never throws. */
async function postJson<T extends { success: true }>(
  path: string,
  body: unknown,
  { signal, timeoutMs = 35_000 }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<T | ClientError> {
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: combined,
    });
  } catch (err) {
    if (signal?.aborted) throw err; // caller cancelled — let it handle that
    return clientError("PROVIDER_UNAVAILABLE");
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return clientError(res.status === 429 ? "RATE_LIMITED" : "INTERNAL_ERROR");
  }
  if (data && typeof data === "object" && (data as { success?: unknown }).success === true) return data as T;
  const code = (data as { code?: unknown } | null)?.code;
  return clientError(isErrorCode(code) ? code : "INTERNAL_ERROR");
}

export const analyzeVideoRequest = (url: string, signal?: AbortSignal) =>
  postJson<AnalyzeResponse>("/api/video/analyze", { url }, { signal });

export const createDownloadRequest = (url: string, formatId: string) =>
  // Preparing an HD file on the downloader API can take a few minutes.
  postJson<DownloadResponse>("/api/video/download", { url, formatId }, { timeoutMs: 300_000 });
