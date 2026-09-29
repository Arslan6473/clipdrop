import dns from "node:dns";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assertPublicHost, isPrivateIp, safeHead } from "@/lib/security/ssrf";

describe("isPrivateIp", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "224.0.0.1",
    "255.255.255.255",
    "::1",
    "::",
    "fc00::1",
    "fd12:3456::1",
    "fe80::1",
    "::ffff:127.0.0.1",
    "::ffff:169.254.169.254",
    "::ffff:7f00:1",
    "not-an-ip",
  ])("blocks %s", (ip) => {
    expect(isPrivateIp(ip)).toBe(true);
  });

  it.each(["8.8.8.8", "1.1.1.1", "151.101.1.69", "172.32.0.1", "2606:4700:4700::1111"])("allows %s", (ip) => {
    expect(isPrivateIp(ip)).toBe(false);
  });
});

describe("assertPublicHost", () => {
  afterEach(() => vi.restoreAllMocks());

  it("rejects hosts that resolve to private addresses (DNS rebinding style)", async () => {
    vi.spyOn(dns.promises, "lookup").mockResolvedValue([
      { address: "93.184.216.34", family: 4 },
      { address: "10.0.0.5", family: 4 },
    ] as never);
    await expect(assertPublicHost("evil.example")).rejects.toMatchObject({ code: "INVALID_URL" });
  });

  it("accepts hosts that resolve only to public addresses", async () => {
    vi.spyOn(dns.promises, "lookup").mockResolvedValue([{ address: "93.184.216.34", family: 4 }] as never);
    await expect(assertPublicHost("example.com")).resolves.toBeUndefined();
  });

  it("rejects private IP literals", async () => {
    await expect(assertPublicHost("169.254.169.254")).rejects.toMatchObject({ code: "INVALID_URL" });
  });
});

describe("safeHead", () => {
  afterEach(() => vi.restoreAllMocks());

  it("refuses to connect when DNS returns a private address", async () => {
    vi.spyOn(dns, "lookup").mockImplementation(((_h: string, _o: unknown, cb: (e: null, a: dns.LookupAddress[]) => void) =>
      cb(null, [{ address: "127.0.0.1", family: 4 }])) as never);
    await expect(safeHead(new URL("https://rebind.example/video.mp4"))).rejects.toMatchObject({ code: "INVALID_URL" });
  });

  it("refuses URLs that fail structural validation", async () => {
    await expect(safeHead(new URL("https://localhost/video.mp4"))).rejects.toMatchObject({ code: "INVALID_URL" });
  });
});
