import { SIZE_RANGE } from "../constants/layout";

/** Shrinks the right column first, then the left, until both fit in the space. Stored sizes stay unchanged. */
export function fitColumns(left: number, right: number, space: number) {
  const over = Math.max(0, left + right - space);
  const fromRight = Math.min(over, right - SIZE_RANGE.rightWidth.min);
  return {
    left: Math.max(SIZE_RANGE.leftWidth.min, left - (over - fromRight)),
    right: right - fromRight,
  };
}
