import type { Document } from "../../types/topology.ts";
import type { Issue, IssueTarget } from "../../types/validation.ts";

/** Resolves an issue to the nodes and link it points at; missing resources add nothing. */
export function issueTarget(document: Document, issue: Issue): IssueTarget {
  const nodeIds = new Set<string>();
  let linkId: string | null = null;
  [issue.resourceId, ...issue.relatedIds].forEach((id) => {
    if (document.nodes.some((n) => n.id === id)) nodeIds.add(id);
    const owner = document.interfaces.find((i) => i.id === id)?.nodeId;
    if (owner && document.nodes.some((n) => n.id === owner)) nodeIds.add(owner);
    if (!linkId && document.links.some((l) => l.id === id)) linkId = id;
  });
  return { nodeIds: [...nodeIds], linkId };
}
