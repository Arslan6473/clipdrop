import "server-only";

import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { ERROR_MESSAGES, ERROR_STATUS, ProviderError, type ErrorCode } from "@/lib/providers/errors";
import { getClientIp, type RateLimiter } from "@/lib/security/rate-limit";
import { requestContext } from "./request-context";

const MAX_BODY_BYTES = 4096;

const NO_STORE = { "cache-control": "no-store", "x-content-type-options": "nosniff" };

export function jsonOk<T extends object>(data: T): NextResponse {
  return NextResponse.json(data, { headers: NO_STORE });
}

export function jsonError(code: ErrorCode, headers: Record<string, string> = {}): NextResponse {
  return NextResponse.json(
    { success: false, code, message: ERROR_MESSAGES[code] },
    { status: ERROR_STATUS[code], headers: { ...NO_STORE, ...headers } },
  );
}

/** Reads and validates a small JSON body without ever buffering more than MAX_BODY_BYTES. */
async function readJson(request: Request): Promise<unknown> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) throw new ProviderError("BAD_REQUEST");
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) throw new ProviderError("PAYLOAD_TOO_LARGE");
  if (!request.body) throw new ProviderError("BAD_REQUEST");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new ProviderError("PAYLOAD_TOO_LARGE");
    }
    chunks.push(value);
  }
  const text = new TextDecoder().decode(Buffer.concat(chunks));
  try {
    return JSON.parse(text);
  } catch {
    throw new ProviderError("BAD_REQUEST");
  }
}

/**
 * Shared wrapper for API routes: rate limit → parse → validate → run, mapping every failure
 * onto the public error format. Unknown errors are logged server-side only.
 */
export async function handleJsonRequest<T>(
  request: Request,
  { schema, limiter, run }: { schema: ZodType<T>; limiter: RateLimiter; run: (input: T) => Promise<object> },
): Promise<NextResponse> {
  const clientIp = getClientIp(request.headers);
  const limit = limiter.check(clientIp);
  if (!limit.allowed) return jsonError("RATE_LIMITED", { "retry-after": String(limit.retryAfterSeconds) });

  try {
    const parsed = schema.safeParse(await readJson(request));
    if (!parsed.success) {
      const urlProblem = parsed.error.issues.some((issue) => issue.path[0] === "url");
      return jsonError(urlProblem ? "INVALID_URL" : "BAD_REQUEST");
    }
    return jsonOk(await requestContext.run({ clientIp }, () => run(parsed.data)));
  } catch (err) {
    if (err instanceof ProviderError) return jsonError(err.code);
    console.error("[api] unexpected error", err instanceof Error ? err.message : "unknown");
    return jsonError("INTERNAL_ERROR");
  }
}
