import { describe, expect, it, vi, beforeEach } from "vitest";

describe("assertAiRateLimit", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("AI_RATE_LIMIT_MAX", "2");
    vi.stubEnv("AI_RATE_LIMIT_WINDOW_MS", "3600000");
  });

  it("allows requests under the limit", async () => {
    const { assertAiRateLimit } = await import("@/lib/auth/rate-limit");
    expect(() => assertAiRateLimit("user-a")).not.toThrow();
    expect(() => assertAiRateLimit("user-a")).not.toThrow();
  });

  it("throws 429 when limit exceeded", async () => {
    const { assertAiRateLimit } = await import("@/lib/auth/rate-limit");
    assertAiRateLimit("user-b");
    assertAiRateLimit("user-b");
    try {
      assertAiRateLimit("user-b");
      expect.fail("expected rate limit error");
    } catch (err) {
      expect(err).toBeInstanceOf(Response);
      const res = err as Response;
      expect(res.status).toBe(429);
      expect(await res.json()).toEqual({ error: "AI rate limit exceeded. Try again later." });
    }
  });
});
