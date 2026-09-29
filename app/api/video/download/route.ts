import { handleJsonRequest, jsonError } from "@/lib/api/response";
import { downloadRequestSchema } from "@/lib/api/schemas";
import { downloadLimiter } from "@/lib/security/rate-limit";
import { createVideoDownload } from "@/lib/video/service";

export const maxDuration = 300;

export async function POST(request: Request) {
  return handleJsonRequest(request, {
    schema: downloadRequestSchema,
    limiter: downloadLimiter,
    run: async ({ url, formatId }) => ({ success: true, download: await createVideoDownload(url, formatId) }),
  });
}

export function GET() {
  return jsonError("BAD_REQUEST", { allow: "POST" });
}
