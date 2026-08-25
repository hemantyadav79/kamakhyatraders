import 'server-only';

// -----------------------------------------------------------------------------
// Simple in-memory sliding-window rate limiter. Protects the contact form and
// admin login from brute-force / spam. Good enough for a single-instance app.
//
// NOTE: On serverless (Vercel) each instance keeps its own memory, so this is a
// best-effort throttle. For strict global limits, back it with Upstash Redis
// (see README). For this site's traffic, in-memory is sufficient.
// -----------------------------------------------------------------------------

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Periodically drop expired entries so the map can't grow unbounded.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * @param key        unique bucket (e.g. `contact:${ip}`)
 * @param limit      max requests per window
 * @param windowMs   window size in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return headers.get('x-real-ip') || '0.0.0.0';
}
