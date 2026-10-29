import type { SizeRange } from "../types/layout";

export function clamp(
  value: unknown,
  { min, max, fallback }: SizeRange,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
