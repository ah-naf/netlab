import type { Document, Node } from "../types/topology";

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
