import { describe, expect, it } from "vitest";
import { createRateLimiter, getClientIp } from "@/lib/security/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit then blocks with retry-after", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });
    const now = 1_000_000;
    expect(limiter.check("1.2.3.4", now).allowed).toBe(true);
    expect(limiter.check("1.2.3.4", now).allowed).toBe(true);
    expect(limiter.check("1.2.3.4", now).remaining).toBe(0);
    const blocked = limiter.check("1.2.3.4", now + 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(50);
  });

  it("tracks clients independently", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("resets after the window", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("a", 500).allowed).toBe(false);
    expect(limiter.check("a", 1001).allowed).toBe(true);
  });

  it("bounds memory under many distinct keys", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 60_000, maxEntries: 100 });
    for (let i = 0; i < 1000; i++) limiter.check(`ip-${i}`, 0);
    expect(limiter.size()).toBeLessThanOrEqual(101);
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
    expect(getClientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
