import type { Edge, Node } from "@xyflow/react";
import { LINK_ISSUE_CLASS } from "../constants/validation";
import type { Severity } from "../types/validation";
import { LINK_LABEL_BG, LINK_LABEL_STYLE, linkLabel } from "../constants/links";
import { DEFAULT_POSITION, NODE_STATUS } from "../constants/topology";
import type { FlowNodeData } from "../types/flow";
import type { Document } from "../types/topology";

export const toFlowNodes = (
  document: Document,
  issues: Map<string, Severity> = new Map(),
): Node<FlowNodeData>[] =>
  document.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: document.layout?.[node.id] ?? DEFAULT_POSITION,
    data: { status: NODE_STATUS.DESIRED, issue: issues.get(node.id) },
  }));

/** Links whose interface is missing are skipped, not drawn. */
export function toFlowEdges(
  document: Document,
  issues: Map<string, Severity> = new Map(),
): Edge[] {
  const byId = new Map(document.interfaces.map((i) => [i.id, i]));
  return document.links.flatMap((link) => {
    const from = byId.get(link.endpointA);
    const to = byId.get(link.endpointB);
    if (!from || !to) return [];
    return [
      {
        id: link.id,
        source: from.nodeId,
        target: to.nodeId,
        label: linkLabel(from.name, to.name, link.mtu),
        className: issues.has(link.id)
          ? LINK_ISSUE_CLASS[issues.get(link.id)!]
          : undefined,
        labelStyle: LINK_LABEL_STYLE,
        labelBgStyle: LINK_LABEL_BG,
        sourceHandle: link.endpointA,
        targetHandle: link.endpointB,
      },
    ];
  });
}
