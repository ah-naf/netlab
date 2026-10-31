import { NODE_TYPE } from "../constants/topology";
import type { Document, Link, State } from "../types/topology";

const mapLink = (
  document: Document,
  linkId: string,
  change: (link: Link) => Link,
): Document => ({
  ...document,
  links: document.links.map((l) => (l.id === linkId ? change(l) : l)),
});

export const setLinkState = (
  document: Document,
  linkId: string,
  state: State,
) => mapLink(document, linkId, (l) => ({ ...l, state }));

/** The node and interface at the other end of the link that uses this interface. */
export function peerOf(
  document: Document,
  interfaceId: string,
): { nodeName: string; interfaceName: string } | null {
  const link = document.links.find(
    (l) => l.endpointA === interfaceId || l.endpointB === interfaceId,
  );
  if (!link) return null;
  const otherId =
    link.endpointA === interfaceId ? link.endpointB : link.endpointA;
  const other = document.interfaces.find((i) => i.id === otherId);
  const node = document.nodes.find((n) => n.id === other?.nodeId);
  return other && node
    ? { nodeName: node.name, interfaceName: other.name }
    : null;
}

export const summarize = (document: Document) => ({
  namespaces: document.nodes.filter((n) => n.type === NODE_TYPE.NAMESPACE)
    .length,
  bridges: document.nodes.filter((n) => n.type === NODE_TYPE.BRIDGE).length,
  interfaces: document.interfaces.length,
  links: document.links.length,
});
