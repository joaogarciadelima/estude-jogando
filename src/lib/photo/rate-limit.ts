import { createHash } from "node:crypto";

export type RateLimitResult = { allowed: true } | { allowed: false; reason: "person" | "global" };

/** Async so a persistent store (e.g. Redis) can replace the in-memory one. */
export interface RateLimiter {
  consume(key: string): Promise<RateLimitResult>;
}

type Limits = { perKey: number; total: number; now?: () => Date };

const dayFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

/** Calendar day in Brazil, as YYYY-MM-DD. */
export function saoPauloDay(date: Date): string {
  return dayFormat.format(date);
}

/** Hash of IP + day: the limiter never holds a raw IP, and keys don't link across days. */
export function clientKey(ip: string, date: Date): string {
  return createHash("sha256")
    .update(`${saoPauloDay(date)}:${ip}`)
    .digest("hex");
}

/**
 * Correct only for a single server instance: counters live in this process's memory.
 * A public deploy with several instances needs a persistent implementation.
 */
export function createMemoryRateLimiter({
  perKey,
  total,
  now = () => new Date(),
}: Limits): RateLimiter {
  let day = "";
  let used = 0;
  let usedByKey = new Map<string, number>();

  return {
    async consume(key) {
      const today = saoPauloDay(now());
      if (today !== day) {
        day = today;
        used = 0;
        usedByKey = new Map();
      }
      const usedByThisKey = usedByKey.get(key) ?? 0;
      if (used >= total) return { allowed: false, reason: "global" };
      if (usedByThisKey >= perKey) return { allowed: false, reason: "person" };
      used += 1;
      usedByKey.set(key, usedByThisKey + 1);
      return { allowed: true };
    },
  };
}
