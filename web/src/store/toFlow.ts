import type { Edge, Node } from "@xyflow/react";
import { DEFAULT_POSITION, NODE_STATUS } from "../constants/topology";
import type { FlowNodeData } from "../types/flow";
import type { Document } from "../types/topology";

export const toFlowNodes = (document: Document): Node<FlowNodeData>[] =>
  document.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: document.layout?.[node.id] ?? DEFAULT_POSITION,
    data: { status: NODE_STATUS.DESIRED },
  }));

/** Links whose interface is missing are skipped, not drawn. */
export function toFlowEdges(document: Document): Edge[] {
  const nodeOf = new Map(document.interfaces.map((i) => [i.id, i.nodeId]));
  return document.links.flatMap((link) => {
    const source = nodeOf.get(link.endpointA);
    const target = nodeOf.get(link.endpointB);
    if (!source || !target) return [];
    return [
      {
        id: link.id,
        source,
        target,
        sourceHandle: link.endpointA,
        targetHandle: link.endpointB,
      },
    ];
  });
}
