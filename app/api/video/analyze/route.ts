import { handleJsonRequest, jsonError } from "@/lib/api/response";
import { analyzeRequestSchema } from "@/lib/api/schemas";
import { analyzeLimiter } from "@/lib/security/rate-limit";
import { analyzeVideo } from "@/lib/video/service";

export const maxDuration = 60;

export async function POST(request: Request) {
  return handleJsonRequest(request, {
    schema: analyzeRequestSchema,
    limiter: analyzeLimiter,
    run: ({ url }) => analyzeVideo(url),
  });
}

export function GET() {
  return jsonError("BAD_REQUEST", { allow: "POST" });
}
