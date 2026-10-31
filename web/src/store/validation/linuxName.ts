import { LINUX_NAME } from "../../constants/validation.ts";

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const HASH_RADIX = 16;
const LOW_16_BITS = 0xffff;

export function fnv1a32(text: string): number {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(text)) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return hash;
}

/** Deploy-time node name: always at most 15 characters, same rule as the backend. */
export function linuxName(labId: string, name: string): string {
  const { PREFIX, LAB_ID_CHARS, MAX, HASH_DIGITS, SEPARATOR } = LINUX_NAME;
  const base = `${PREFIX}${labId.slice(0, LAB_ID_CHARS)}${SEPARATOR}`;
  if (base.length + name.length <= MAX) return `${base}${name}`;
  const kept = name.slice(
    0,
    MAX - base.length - HASH_DIGITS - SEPARATOR.length,
  );
  const hash = (fnv1a32(name) & LOW_16_BITS)
    .toString(HASH_RADIX)
    .padStart(HASH_DIGITS, "0");
  return `${base}${kept}${SEPARATOR}${hash}`;
}
