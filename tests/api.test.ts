import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as analyze } from "@/app/api/video/analyze/route";
import { POST as download } from "@/app/api/video/download/route";
import { analyzeLimiter, downloadLimiter } from "@/lib/security/rate-limit";

let ipCounter = 0;
function req(body: unknown, { ip, type = "application/json" }: { ip?: string; type?: string } = {}) {
  return new Request("http://localhost/api/video/analyze", {
    method: "POST",
    headers: { "content-type": type, "x-forwarded-for": ip ?? `198.51.100.${++ipCounter % 250}` },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(((input: string | URL | Request, init?: RequestInit) =>
    Promise.resolve(handler(String(input instanceof Request ? input.url : input), init))) as typeof fetch);
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

beforeEach(() => {
  analyzeLimiter.reset();
  downloadLimiter.reset();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("POST /api/video/analyze — validation", () => {
  it("rejects non-JSON content types", async () => {
    const res = await analyze(req("url=x", { type: "application/x-www-form-urlencoded" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ success: false, code: "BAD_REQUEST", message: expect.any(String) });
  });

  it("rejects malformed JSON", async () => {
    const res = await analyze(req("{not json"));
    expect((await res.json()).code).toBe("BAD_REQUEST");
  });

  it("rejects oversized bodies", async () => {
    const res = await analyze(req({ url: "https://vimeo.com/1", pad: "x".repeat(10_000) }));
    expect(res.status).toBe(413);
    expect((await res.json()).code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("rejects missing and invalid URLs", async () => {
    expect((await (await analyze(req({}))).json()).code).toBe("INVALID_URL");
    expect((await (await analyze(req({ url: "javascript:alert(1)" }))).json()).code).toBe("INVALID_URL");
    expect((await (await analyze(req({ url: "https://169.254.169.254/latest/meta-data" }))).json()).code).toBe(
      "INVALID_URL",
    );
  });

  it("rejects unsupported URLs", async () => {
    const res = await analyze(req({ url: "https://example.com/blog/post" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body).toEqual({
      success: false,
      code: "UNSUPPORTED_URL",
      message: "We couldn't recognize this video link. Check the URL and try again.",
    });
  });
});

describe("POST /api/video/analyze — providers", () => {
  it("returns metadata and no formats for YouTube, with a notice", async () => {
    const fetchSpy = mockFetch(() =>
      json({ title: "Big Buck Bunny", author_name: "Blender", thumbnail_url: "https://i.ytimg.com/vi/x/hqdefault.jpg" }),
    );
    const res = await analyze(req({ url: "https://youtu.be/aqz-KE-bpKQ" }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.video).toMatchObject({ source: "youtube", title: "Big Buck Bunny", author: "Blender" });
    expect(body.formats).toEqual([]);
    expect(body.notice).toBe("Downloads aren't currently available for this source.");
    expect(String(fetchSpy.mock.calls[0][0])).toMatch(/^https:\/\/www\.youtube\.com\/oembed\?/);
  });

  it("drops thumbnails from non-allowlisted hosts", async () => {
    mockFetch(() => json({ title: "x", thumbnail_url: "https://evil.example/t.jpg" }));
    const body = await (await analyze(req({ url: "https://youtu.be/aqz-KE-bpKQ" }))).json();
    expect(body.video.thumbnailUrl).toBeUndefined();
  });

  it("maps 401/403 to PRIVATE_CONTENT", async () => {
    mockFetch(() => json({ error: "Unauthorized" }, 401));
    const res = await analyze(req({ url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" }));
    expect(res.status).toBe(403);
    expect((await res.json()).code).toBe("PRIVATE_CONTENT");
  });

  it("maps network failures to PROVIDER_UNAVAILABLE without leaking details", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("connect ECONNREFUSED 10.0.0.1:443 at /srv/app"));
    const res = await analyze(req({ url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" }));
    const text = await res.text();
    expect(res.status).toBe(503);
    expect(text).toContain("PROVIDER_UNAVAILABLE");
    expect(text).not.toMatch(/ECONNREFUSED|10\.0\.0\.1|\/srv|stack/i);
  });

  it("reports Instagram as unavailable when no Meta token is configured", async () => {
    vi.stubEnv("META_OEMBED_ACCESS_TOKEN", "");
    const res = await analyze(req({ url: "https://www.instagram.com/reel/C8abcDEF123/" }));
    expect((await res.json()).code).toBe("DOWNLOADS_UNAVAILABLE");
  });

});

describe("POST /api/video/download", () => {


  it("returns DOWNLOADS_UNAVAILABLE for sources without an authorized mechanism", async () => {
    const res = await download(req({ url: "https://youtu.be/aqz-KE-bpKQ", formatId: "best" }));
    expect(res.status).toBe(422);
    expect((await res.json()).code).toBe("DOWNLOADS_UNAVAILABLE");
  });

  it("rejects format IDs with unsafe characters", async () => {
    const res = await download(req({ url: "https://youtu.be/aqz-KE-bpKQ", formatId: "../../etc;rm -rf" }));
    expect((await res.json()).code).toBe("BAD_REQUEST");
  });
});

describe("rate limiting", () => {
  it("returns 429 with retry-after once the limit is exceeded", async () => {
    let last: Response | undefined;
    for (let i = 0; i < 21; i++) last = await analyze(req({ url: "https://example.com/nope" }, { ip: "203.0.113.50" }));
    expect(last!.status).toBe(429);
    expect(last!.headers.get("retry-after")).toMatch(/^\d+$/);
    expect((await last!.json()).code).toBe("RATE_LIMITED");
  });
});
