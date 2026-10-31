import { NODE_TYPE } from "../constants/topology";
import { setInterfaceMtu } from "./namespaceOps";
import type { BridgeSettings, Document, Link, State } from "../types/topology";

const DEFAULT_BRIDGE: BridgeSettings = { stp: false };

const mapBridge = (
  document: Document,
  nodeId: string,
  change: (bridge: BridgeSettings) => BridgeSettings,
): Document => ({
  ...document,
  nodes: document.nodes.map((n) =>
    n.id === nodeId ? { ...n, bridge: change(n.bridge ?? DEFAULT_BRIDGE) } : n,
  ),
});

const mapLink = (
  document: Document,
  linkId: string,
  change: (link: Link) => Link,
): Document => ({
  ...document,
  links: document.links.map((l) => (l.id === linkId ? change(l) : l)),
});

export const setStp = (document: Document, nodeId: string, stp: boolean) =>
  mapBridge(document, nodeId, (bridge) => ({ ...bridge, stp }));

export const setStpPriority = (
  document: Document,
  nodeId: string,
  priority: number,
) =>
  mapBridge(document, nodeId, (bridge) => ({
    ...bridge,
    stpPriority: priority,
  }));

/** The link and both of its endpoint interfaces share one MTU. */
export function setLinkMtu(
  document: Document,
  linkId: string,
  mtu: number,
): Document {
  const link = document.links.find((l) => l.id === linkId);
  if (!link) return document;
  const ends = [link.endpointA, link.endpointB];
  return {
    ...mapLink(document, linkId, (l) => ({ ...l, mtu })),
    interfaces: document.interfaces.map((i) =>
      ends.includes(i.id) ? { ...i, mtu } : i,
    ),
  };
}

/** An interface in a link changes the whole link, so both ends and the label agree. */
export function setLinkedInterfaceMtu(
  document: Document,
  interfaceId: string,
  mtu: number,
): Document {
  const link = document.links.find(
    (l) => l.endpointA === interfaceId || l.endpointB === interfaceId,
  );
  return link
    ? setLinkMtu(document, link.id, mtu)
    : setInterfaceMtu(document, interfaceId, mtu);
}

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
