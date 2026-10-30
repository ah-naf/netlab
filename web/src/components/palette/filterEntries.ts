import type { PaletteEntry } from "../../types/palette";

export function filterEntries(
  entries: readonly PaletteEntry[],
  query: string,
): readonly PaletteEntry[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return entries;
  return entries.filter((e) =>
    `${e.label} ${e.description}`.toLowerCase().includes(needle),
  );
}
