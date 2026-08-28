import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// The chat endpoint calls a paid API, so it must be rate-limited per IP.
// When Upstash is configured we use a sliding-window limiter and fail CLOSED
// if Redis is unreachable (see route handler). When not configured we export
// null so the route can degrade with a noisy log and an in-memory fallback.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const askAmarRatelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(8, "60 s"),
        prefix: "ratelimit:ask-amar",
        analytics: false,
      })
    : null;

export const askAmarDailyRatelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(60, "1 d"),
        prefix: "ratelimit:ask-amar:daily",
        analytics: false,
      })
    : null;

// ── In-memory fallback (dev / Upstash-unconfigured envs) ──
// Bounded Map with periodic pruning — mirrors portfolio-parm's contact fallback
// but with Amar's tighter limits. Production with Upstash should never hit this.
const WINDOW_MS = 60_000;
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_MINUTE = 8;
const MAX_PER_DAY = 60;
const MAX_TRACKED_IPS = 500;

type Bucket = { minute: number[]; day: number[] };
const memBuckets = new Map<string, Bucket>();

function prune() {
  const now = Date.now();
  for (const [key, b] of memBuckets) {
    b.minute = b.minute.filter((t) => now - t < WINDOW_MS);
    b.day = b.day.filter((t) => now - t < DAILY_WINDOW_MS);
    if (b.minute.length === 0 && b.day.length === 0) memBuckets.delete(key);
    else memBuckets.set(key, b);
  }
  if (memBuckets.size > MAX_TRACKED_IPS) {
    const keys = Array.from(memBuckets.keys());
    for (let i = 0; i < keys.length - MAX_TRACKED_IPS; i++) {
      memBuckets.delete(keys[i]);
    }
  }
}

export function checkMemoryRatelimit(ip: string): { success: boolean; kind?: "minute" | "daily" } {
  const now = Date.now();
  if (memBuckets.size > MAX_TRACKED_IPS || Math.random() < 0.02) prune();

  const bucket = memBuckets.get(ip) ?? { minute: [], day: [] };
  bucket.minute = bucket.minute.filter((t) => now - t < WINDOW_MS);
  bucket.day = bucket.day.filter((t) => now - t < DAILY_WINDOW_MS);

  if (bucket.minute.length >= MAX_PER_MINUTE) return { success: false, kind: "minute" };
  if (bucket.day.length >= MAX_PER_DAY) return { success: false, kind: "daily" };

  bucket.minute.push(now);
  bucket.day.push(now);
  memBuckets.set(ip, bucket);
  return { success: true };
}
