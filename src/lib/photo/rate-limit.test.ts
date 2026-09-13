// @vitest-environment node
import { describe, expect, test } from "vitest";
import { clientKey, createMemoryRateLimiter, saoPauloDay } from "./rate-limit";

describe("saoPauloDay", () => {
  test("uses Brazil time, not UTC", () => {
    // 01:30 UTC on the 14th is still 22:30 on the 13th in São Paulo.
    expect(saoPauloDay(new Date("2026-09-14T01:30:00Z"))).toBe("2026-09-13");
  });
});

describe("clientKey", () => {
  test("is a hash that never contains the raw IP", () => {
    const key = clientKey("203.0.113.7", new Date("2026-09-13T12:00:00Z"));
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.7");
  });

  test("changes from one day to the next", () => {
    const ip = "203.0.113.7";
    expect(clientKey(ip, new Date("2026-09-13T12:00:00Z"))).not.toBe(
      clientKey(ip, new Date("2026-09-14T12:00:00Z")),
    );
  });
});

describe("memory rate limiter", () => {
  test("allows up to the per-person limit, then refuses that person", async () => {
    const limiter = createMemoryRateLimiter({ perKey: 2, total: 100 });
    expect(await limiter.consume("a")).toEqual({ allowed: true });
    expect(await limiter.consume("a")).toEqual({ allowed: true });
    expect(await limiter.consume("a")).toEqual({ allowed: false, reason: "person" });
    expect(await limiter.consume("b")).toEqual({ allowed: true });
  });

  test("refuses everyone once the daily total is reached", async () => {
    const limiter = createMemoryRateLimiter({ perKey: 10, total: 2 });
    await limiter.consume("a");
    await limiter.consume("b");
    expect(await limiter.consume("c")).toEqual({ allowed: false, reason: "global" });
  });

  test("resets on the next São Paulo day", async () => {
    let now = new Date("2026-09-13T12:00:00-03:00");
    const limiter = createMemoryRateLimiter({ perKey: 1, total: 1, now: () => now });
    await limiter.consume("a");
    expect(await limiter.consume("a")).toEqual({ allowed: false, reason: "global" });
    now = new Date("2026-09-14T00:01:00-03:00");
    expect(await limiter.consume("a")).toEqual({ allowed: true });
  });
});
