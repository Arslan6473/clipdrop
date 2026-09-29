import { describe, expect, it } from "vitest";
import { formatDuration } from "@/lib/utils/format-duration";
import { formatSize } from "@/lib/utils/format-size";
import { sanitizeFilename } from "@/lib/utils/sanitize-filename";

describe("sanitizeFilename", () => {
  it("keeps normal titles readable", () => {
    expect(sanitizeFilename("My Holiday Video 1080p")).toBe("My Holiday Video 1080p.mp4");
  });

  it("strips path traversal and separators", () => {
    const name = sanitizeFilename("../../etc/passwd");
    expect(name).not.toContain("/");
    expect(name).not.toContain("..");
    expect(sanitizeFilename("..\\..\\windows\\system32")).not.toContain("\\");
  });

  it("removes reserved, control and bidi characters", () => {
    expect(sanitizeFilename('a<b>c:d"e|f?g*h')).toBe("a b c d e f g h.mp4");
    expect(sanitizeFilename("evil‮gpj.exe")).not.toContain("‮");
    expect(sanitizeFilename("line\nbreak\u0000")).toBe("linebreak.mp4");
  });

  it("falls back for empty or reserved names", () => {
    expect(sanitizeFilename("")).toBe("video.mp4");
    expect(sanitizeFilename("...")).toBe("video.mp4");
    expect(sanitizeFilename("CON")).toBe("video.mp4");
  });

  it("caps length and whitelists the extension", () => {
    expect(sanitizeFilename("a".repeat(500)).length).toBeLessThanOrEqual(124);
    expect(sanitizeFilename("clip", "exe;rm -rf")).toBe("clip.mp4");
    expect(sanitizeFilename("clip", "WEBM")).toBe("clip.webm");
  });
});

describe("formatSize", () => {
  it("formats bytes", () => {
    expect(formatSize(512)).toBe("512 B");
    expect(formatSize(2048)).toBe("2 KB");
    expect(formatSize(42 * 1024 * 1024)).toBe("42 MB");
    expect(formatSize(1.5 * 1024 ** 3)).toBe("1.5 GB");
    expect(formatSize(undefined)).toBeUndefined();
    expect(formatSize(-1)).toBeUndefined();
  });
});

describe("formatDuration", () => {
  it("formats seconds", () => {
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(125)).toBe("2:05");
    expect(formatDuration(3725)).toBe("1:02:05");
    expect(formatDuration(undefined)).toBeUndefined();
    expect(formatDuration(Number.NaN)).toBeUndefined();
  });
});
