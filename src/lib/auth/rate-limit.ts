const WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_MAX) || 20;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function assertAiRateLimit(userId: string): void {
  const now = Date.now();
  const key = `ai:${userId}`;
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    throw new Response(
      JSON.stringify({ error: "AI rate limit exceeded. Try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSec),
        },
      }
    );
  }

  entry.count += 1;
}
