import { useMemo } from "react";
import { SEVERITY } from "../constants/validation";
import { issueTarget } from "../store/validation/issueTarget";
import { useTopologyStore } from "../store/topologyStore";
import type { Issue, Severity } from "../types/validation";
import { useIssues } from "./useIssues";

export interface Highlights {
  nodes: Map<string, Severity>;
  links: Map<string, Severity>;
}

function worst(map: Map<string, Severity>, id: string, severity: Severity) {
  if (map.get(id) !== SEVERITY.ERROR) map.set(id, severity);
}

function collect(
  document: Parameters<typeof issueTarget>[0],
  issues: Issue[],
): Highlights {
  const found: Highlights = { nodes: new Map(), links: new Map() };
  issues.forEach((issue) => {
    const { nodeIds, linkId } = issueTarget(document, issue);
    nodeIds.forEach((id) => worst(found.nodes, id, issue.severity));
    if (linkId) worst(found.links, linkId, issue.severity);
  });
  return found;
}

/** Worst severity per node and link; empty while the issue list is closed. */
export function useIssueHighlights(): Highlights {
  const issues = useIssues();
  const document = useTopologyStore((s) => s.document);
  return useMemo(() => collect(document, issues), [document, issues]);
}
