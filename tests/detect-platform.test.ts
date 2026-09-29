import { describe, expect, it } from "vitest";
import { detectPlatform, matchVideoUrl } from "@/lib/platforms/detect-platform";
import { validateVideoUrl } from "@/lib/platforms/validate-url";

function match(input: string) {
  const checked = validateVideoUrl(input);
  if (!checked.ok) throw new Error(`invalid: ${input}`);
  return matchVideoUrl(checked.url);
}

describe("platform detection", () => {
  it.each([
    ["https://www.youtube.com/watch?v=aqz-KE-bpKQ", "youtube", "aqz-KE-bpKQ"],
    ["https://youtu.be/aqz-KE-bpKQ?si=tracking", "youtube", "aqz-KE-bpKQ"],
    ["https://m.youtube.com/watch?v=aqz-KE-bpKQ&t=30", "youtube", "aqz-KE-bpKQ"],
    ["https://www.youtube.com/shorts/aqz-KE-bpKQ", "youtube", "aqz-KE-bpKQ"],
    ["https://www.youtube.com/embed/aqz-KE-bpKQ", "youtube", "aqz-KE-bpKQ"],
    ["youtube.com/live/aqz-KE-bpKQ", "youtube", "aqz-KE-bpKQ"],
  ])("YouTube: %s", (url, source, id) => {
    expect(match(url)).toEqual({ source, id });
  });

  it.each([
    ["https://www.instagram.com/reel/C8abcDEF123/", "C8abcDEF123"],
    ["https://instagram.com/p/C8abcDEF123/?igsh=xyz", "C8abcDEF123"],
    ["https://www.instagram.com/reels/C8abcDEF123/", "C8abcDEF123"],
    ["https://www.instagram.com/someuser/p/C8abcDEF123/", "C8abcDEF123"],
  ])("Instagram: %s", (url, id) => {
    expect(match(url)).toEqual({ source: "instagram", id });
  });

  it.each([
    ["https://www.tiktok.com/@creator/video/7234567890123456789", "7234567890123456789"],
    ["https://vm.tiktok.com/ZMabc123/", "ZMabc123"],
    ["https://www.tiktok.com/t/ZTabc123/", "ZTabc123"],
  ])("TikTok: %s", (url, id) => {
    expect(match(url)).toEqual({ source: "tiktok", id });
  });

  it.each([
    ["https://www.facebook.com/watch/?v=1234567890", "1234567890"],
    ["https://www.facebook.com/SomePage/videos/1234567890/", "1234567890"],
    ["https://www.facebook.com/reel/1234567890", "1234567890"],
    ["https://fb.watch/abc123/", "abc123"],
    ["https://www.facebook.com/share/v/AbC123xyz/", "AbC123xyz"],
    ["https://www.facebook.com/video.php?v=274175099429670", "274175099429670"],
    ["https://www.facebook.com/barackobama/posts/10153664894881749", "10153664894881749"],
  ])("Facebook: %s", (url, id) => {
    expect(match(url)).toEqual({ source: "facebook", id });
  });

  it.each([
    "https://x.com/user/status/1234567890123456789",
    "https://twitter.com/user/status/1234567890123456789",
    "https://vimeo.com/1084537",
    "https://player.vimeo.com/video/1084537",
    "https://www.reddit.com/r/videos/comments/abc123/some_title/",
    "https://v.redd.it/abc123def456",
  ])("no longer supports removed platforms: %s", (url) => {
    const checked = validateVideoUrl(url);
    expect(checked.ok && detectPlatform(checked.url)).toBe(null);
    expect(match(url)).toBeNull();
  });

  it("detects direct video files on unknown hosts", () => {
    expect(match("https://archive.example.org/films/Night%20Film.mp4")).toEqual({
      source: "direct",
      id: "Night%20Film.mp4",
    });
    expect(match("https://cdn.example.com/clip.webm?x=1")?.source).toBe("direct");
  });

  it("recognises the platform but rejects non-video pages", () => {
    const profile = validateVideoUrl("https://www.youtube.com/@somechannel");
    expect(profile.ok && detectPlatform(profile.url)).toBe("youtube");
    expect(profile.ok && matchVideoUrl(profile.url)).toBeNull();
    expect(match("https://www.instagram.com/someuser/")).toBeNull();
    expect(match("https://www.youtube.com/watch?v=short")).toBeNull();
  });

  it("returns null for unsupported sites", () => {
    expect(match("https://example.com/some/page")).toBeNull();
    expect(match("https://notyoutube.com/watch?v=aqz-KE-bpKQ")).toBeNull();
    expect(match("https://youtube.com.evil.example/watch?v=aqz-KE-bpKQ")).toBeNull();
  });
});
