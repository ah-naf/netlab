import type { Document } from "../../types/topology.ts";
import type { Issue } from "../../types/validation.ts";
import { ISSUE_CODE } from "../../constants/validation.ts";
import { makeIssue } from "./makeIssue.ts";

function laterDuplicates<T extends { id: string }>(
  items: T[],
  nameOf: (item: T) => string,
): Issue[] {
  const seen = new Set<string>();
  return items.flatMap((item) => {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      return [];
    }
    return [makeIssue(ISSUE_CODE.DUPLICATE_ID, item.id, nameOf(item))];
  });
}

export const idRules = (document: Document): Issue[] => [
  ...laterDuplicates(document.nodes, (n) => n.name),
  ...laterDuplicates(document.interfaces, (i) => i.name),
  ...laterDuplicates(document.links, (l) => l.id),
];
