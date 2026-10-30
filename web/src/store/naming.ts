/** Prefix plus the smallest number from start that is not used yet. */
export function nextFreeName(
  prefix: string,
  start: number,
  usedNames: Iterable<string>,
): string {
  const used = new Set(usedNames);
  let number = start;
  while (used.has(`${prefix}${number}`)) number++;
  return `${prefix}${number}`;
}
