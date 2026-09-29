import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as analyze } from "@/app/api/video/analyze/route";
import { POST as download } from "@/app/api/video/download/route";
import { analyzeLimiter, downloadLimiter } from "@/lib/security/rate-limit";

const API = "https://dl.example.up.railway.app";

const req = (body: unknown) =>
  new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.7" },
    body: JSON.stringify(body),
  });

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

let urlCounter = 0;
const uniqueYt = () => `https://www.youtube.com/watch?v=${String(++urlCounter).padStart(11, "a")}`;

beforeEach(() => {
  vi.stubEnv("DOWNLOADER_API_URL", API);
  vi.stubEnv("DOWNLOADER_API_KEY", "secret");
  analyzeLimiter.reset();
  downloadLimiter.reset();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("remote downloader provider", () => {
  it("returns formats from the downloader API and forwards the key and client IP", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json({
        success: true,
        video: {
          title: "Clip",
          author: "Chan",
          durationSeconds: 90,
          thumbnailCandidates: ["https://evil.example/t.jpg", "https://i.ytimg.com/vi/x/hq.jpg"],
        },
        formats: [
          { id: "v1080", label: "1080p", description: "HD Video", container: "MP4", sizeBytes: 1000, height: 1080, hasAudio: true },
          { id: "bad id!", label: "x" },
          { id: "audio", label: "Audio only", container: "M4A", hasAudio: true },
        ],
      }),
    );
    const body = await (await analyze(req({ url: uniqueYt() }))).json();
    expect(body.success).toBe(true);
    expect(body.video).toMatchObject({ title: "Clip", author: "Chan", thumbnailUrl: "https://i.ytimg.com/vi/x/hq.jpg" });
    expect(body.formats.map((f: { id: string }) => f.id)).toEqual(["v1080", "audio"]);
    expect(spy).toHaveBeenCalledTimes(1); // analyze + getFormats share one upstream call
    const [url, init] = spy.mock.calls[0];
    expect(String(url)).toBe(`${API}/analyze`);
    expect((init?.headers as Record<string, string>)["x-api-key"]).toBe("secret");
    expect((init?.headers as Record<string, string>)["x-client-ip"]).toBe("203.0.113.7");
  });

  it("falls back to oEmbed details when the downloader API is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) =>
      String(input).startsWith(API)
        ? json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "x" }, 503)
        : json({ title: "From oEmbed", author_name: "Chan" }),
    );
    const body = await (await analyze(req({ url: uniqueYt() }))).json();
    expect(body.video.title).toBe("From oEmbed");
    expect(body.formats).toEqual([]);
  });

  it("passes user-facing errors through (e.g. private videos)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ success: false, code: "PRIVATE_CONTENT", message: "x" }, 403));
    const res = await analyze(req({ url: uniqueYt() }));
    expect((await res.json()).code).toBe("PRIVATE_CONTENT");
  });

  it("returns an attachment link on the downloader API's origin", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json({ success: true, download: { downloadUrl: `${API}/files/${"a".repeat(32)}`, filename: "Clip 1080p.mp4" } }),
    );
    const body = await (await download(req({ url: uniqueYt(), formatId: "v1080" }))).json();
    expect(body.download).toMatchObject({ downloadUrl: `${API}/files/${"a".repeat(32)}`, filename: "Clip 1080p.mp4", attachment: true });
  });

  it("rejects download links on any other origin", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json({ success: true, download: { downloadUrl: "https://evil.example/files/x", filename: "a.mp4" } }),
    );
    const res = await download(req({ url: uniqueYt(), formatId: "v1080" }));
    expect((await res.json()).code).toBe("PROVIDER_UNAVAILABLE");
  });

  it("hides upstream auth problems from users", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ success: false, code: "UNAUTHORIZED", message: "x" }, 401));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await download(req({ url: uniqueYt(), formatId: "v720" }));
    expect((await res.json()).code).toBe("PROVIDER_UNAVAILABLE");
  });
});
