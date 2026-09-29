import { createHash, randomBytes } from "node:crypto";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitResult;
  size(): number;
  reset(): void;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * In-memory fixed-window rate limiter. Keys are hashed with a per-process salt so raw IP
 * addresses are never held in memory, and entries expire on their own — nothing persists.
 *
 * On multi-instance deployments each instance counts separately; put a platform firewall
 * rule (e.g. Vercel WAF rate limiting) in front for a global limit.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxEntries = 10_000,
}: {
  limit: number;
  windowMs: number;
  maxEntries?: number;
}): RateLimiter {
  const salt = randomBytes(16).toString("hex");
  const buckets = new Map<string, Bucket>();

  const hashKey = (key: string) => createHash("sha256").update(salt).update(key).digest("base64url").slice(0, 22);

  function sweep(now: number) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    // Still too big (under attack): drop the oldest windows first.
    if (buckets.size > maxEntries) {
      const excess = buckets.size - maxEntries;
      let i = 0;
      for (const k of buckets.keys()) {
        if (i++ >= excess) break;
        buckets.delete(k);
      }
    }
  }

  return {
    check(key, now = Date.now()) {
      if (buckets.size >= maxEntries) sweep(now);
      const hashed = hashKey(key);
      let bucket = buckets.get(hashed);
      if (!bucket || bucket.resetAt <= now) {
        bucket = { count: 0, resetAt: now + windowMs };
        buckets.set(hashed, bucket);
      }
      bucket.count++;
      const allowed = bucket.count <= limit;
      return {
        allowed,
        limit,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    },
    size: () => buckets.size,
    reset: () => buckets.clear(),
  };
}

/** Best-effort client IP from proxy headers. Falls back to a shared bucket. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown";
}

export const analyzeLimiter = createRateLimiter({ limit: 20, windowMs: 60_000 });
export const downloadLimiter = createRateLimiter({ limit: 30, windowMs: 60_000 });
