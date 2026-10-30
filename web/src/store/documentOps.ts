import { NAME_RULE, NODE_ID_PREFIX } from "../constants/palette";
import { NODE_TYPE } from "../constants/topology";
import type { PaletteEntry } from "../types/palette";
import type { Document, Node, Position } from "../types/topology";
import { nextFreeName } from "./naming";

const withoutRefs = (node: Node, ids: Set<string>): Node => ({
  ...node,
  routes: node.routes?.filter((r) => !ids.has(r.interfaceId ?? "")),
  natRules: node.natRules?.filter((r) => !ids.has(r.interfaceId)),
});

/** Removes interfaces, their links, and route or NAT references to them. */
export const removeInterfaces = (
  document: Document,
  ids: Set<string>,
): Document => ({
  ...document,
  nodes: document.nodes.map((n) => withoutRefs(n, ids)),
  interfaces: document.interfaces.filter((i) => !ids.has(i.id)),
  links: document.links.filter(
    (l) => !ids.has(l.endpointA) && !ids.has(l.endpointB),
  ),
});

/** Adds a node built from a palette entry; the name is unique among all nodes. */
export function createNode(
  document: Document,
  entry: PaletteEntry,
  position: Position,
): { document: Document; nodeId: string } {
  const { create } = entry;
  const rule = NAME_RULE[entry.id];
  if (!create || !rule) return { document, nodeId: "" };
  const node: Node = {
    id: `${NODE_ID_PREFIX}${crypto.randomUUID()}`,
    name: nextFreeName(
      rule.prefix,
      rule.start,
      document.nodes.map((n) => n.name),
    ),
    type: create.type,
    ...(create.role && { role: create.role }),
    ...(create.type === NODE_TYPE.BRIDGE && { bridge: { stp: false } }),
  };
  return {
    document: {
      ...document,
      nodes: [...document.nodes, node],
      layout: { ...document.layout, [node.id]: position },
    },
    nodeId: node.id,
  };
}
