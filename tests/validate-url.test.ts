import { describe, expect, it } from "vitest";
import { normalizeUrl } from "@/lib/platforms/normalize-url";
import { validateVideoUrl } from "@/lib/platforms/validate-url";

describe("normalizeUrl", () => {
  it("adds https to bare links and strips tracking + fragments", () => {
    const url = normalizeUrl("  youtube.com/watch?v=aqz-KE-bpKQ&utm_source=x&si=abc#t=10 ");
    expect(url?.href).toBe("https://youtube.com/watch?v=aqz-KE-bpKQ");
  });

  it("lowercases the host", () => {
    expect(normalizeUrl("https://WWW.Vimeo.COM/76979871")?.hostname).toBe("www.vimeo.com");
  });

  it("rejects garbage and embedded whitespace", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl("not a url")).toBeNull();
    expect(normalizeUrl("https://exa mple.com")).toBeNull();
    expect(normalizeUrl("x".repeat(3000))).toBeNull();
  });
});

describe("validateVideoUrl", () => {
  it("accepts normal https and upgrades http", () => {
    const res = validateVideoUrl("http://vimeo.com/76979871");
    expect(res.ok && res.url.protocol).toBe("https:");
  });

  it.each([
    "",
    "   ",
    "javascript:alert(1)",
    "file:///etc/passwd",
    "ftp://example.com/video.mp4",
    "data:text/html,hi",
    "https://user:pass@youtube.com/watch?v=aqz-KE-bpKQ",
    "https://youtube.com:8443/watch?v=aqz-KE-bpKQ",
    "https://localhost/video.mp4",
    "https://127.0.0.1/video.mp4",
    "https://[::1]/video.mp4",
    "https://2130706433/video.mp4",
    "https://0x7f.1/video.mp4",
    "https://printer.local/video.mp4",
    "https://metadata.internal/video.mp4",
    "https://intranet/video.mp4",
  ])("rejects %s", (input) => {
    expect(validateVideoUrl(input)).toEqual({ ok: false, code: "INVALID_URL" });
  });

  it("rejects non-string input", () => {
    expect(validateVideoUrl(undefined).ok).toBe(false);
    expect(validateVideoUrl({ url: "x" }).ok).toBe(false);
  });
});
