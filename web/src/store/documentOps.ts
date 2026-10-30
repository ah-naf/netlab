import {
  DUPLICATE_OFFSET,
  LINK_ID_PREFIX,
  NAME_ERROR,
  NAME_RULE,
  NODE_ID_PREFIX,
} from "../constants/palette";
import {
  DEFAULT_INTERFACE_MTU,
  DEFAULT_INTERFACE_STATE,
  DEFAULT_POSITION,
  INTERFACE_ID_PREFIX,
  INTERFACE_NAME_PREFIX,
  INTERFACE_NAME_START,
  NODE_TYPE,
} from "../constants/topology";
import type { LinkEnd } from "../types/links";
import type { PaletteEntry } from "../types/palette";
import type {
  Document,
  Interface,
  Link,
  Node,
  Position,
} from "../types/topology";
import { nextFreeName } from "./naming";
import { nodeKindOf } from "./nodeKind";

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

/** Removes nodes with their interfaces, links, and references to those interfaces. */
export function deleteNodes(document: Document, ids: Set<string>): Document {
  const interfaceIds = new Set(
    document.interfaces.filter((i) => ids.has(i.nodeId)).map((i) => i.id),
  );
  const layout = Object.fromEntries(
    Object.entries(document.layout ?? {}).filter(([id]) => !ids.has(id)),
  );
  const rest = removeInterfaces(document, interfaceIds);
  return {
    ...rest,
    nodes: rest.nodes.filter((n) => !ids.has(n.id)),
    layout,
  };
}

/** Returns an error text when the name cannot be used, else null. */
export function validateNodeName(
  document: Document,
  nodeId: string,
  name: string,
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return NAME_ERROR.EMPTY;
  const taken = document.nodes.some(
    (n) => n.id !== nodeId && n.name === trimmed,
  );
  return taken ? NAME_ERROR.TAKEN : null;
}

export const renameNode = (
  document: Document,
  nodeId: string,
  name: string,
): Document => ({
  ...document,
  nodes: document.nodes.map((n) =>
    n.id === nodeId ? { ...n, name: name.trim() } : n,
  ),
});

const newId = (prefix: string) => `${prefix}${crypto.randomUUID()}`;

/** Copies nodes with their interfaces; links are kept only between copied nodes. */
export function duplicateNodes(
  document: Document,
  ids: Set<string>,
): { document: Document; nodeIds: string[] } {
  const originals = document.nodes.filter((n) => ids.has(n.id));
  const nodeMap = new Map(originals.map((n) => [n.id, newId(NODE_ID_PREFIX)]));
  const interfaceMap = new Map<string, string>();
  const names = new Set(document.nodes.map((n) => n.name));
  const layout = { ...document.layout };

  const interfaces = document.interfaces
    .filter((i) => nodeMap.has(i.nodeId))
    .map((i) => {
      interfaceMap.set(i.id, newId(INTERFACE_ID_PREFIX));
      return {
        ...i,
        id: interfaceMap.get(i.id)!,
        nodeId: nodeMap.get(i.nodeId)!,
        addresses: i.addresses?.map((a) => ({ ...a })),
      };
    });

  const nodes = originals.map((n) => {
    const rule = NAME_RULE[nodeKindOf(n)]!;
    const name = nextFreeName(rule.prefix, rule.start, names);
    names.add(name);
    const id = nodeMap.get(n.id)!;
    const origin = document.layout?.[n.id] ?? DEFAULT_POSITION;
    layout[id] = {
      x: origin.x + DUPLICATE_OFFSET.x,
      y: origin.y + DUPLICATE_OFFSET.y,
    };
    const mapRef = <T extends { interfaceId?: string }>(refs?: T[]) =>
      refs
        ?.filter((r) => !r.interfaceId || interfaceMap.has(r.interfaceId))
        .map((r) => ({
          ...r,
          interfaceId: r.interfaceId && interfaceMap.get(r.interfaceId),
        }));
    return {
      ...n,
      id,
      name,
      routes: mapRef(n.routes),
      natRules: mapRef(n.natRules),
    } as Node;
  });

  const links = document.links
    .filter(
      (l) => interfaceMap.has(l.endpointA) && interfaceMap.has(l.endpointB),
    )
    .map((l) => ({
      ...l,
      id: newId(LINK_ID_PREFIX),
      endpointA: interfaceMap.get(l.endpointA)!,
      endpointB: interfaceMap.get(l.endpointB)!,
    }));

  return {
    document: {
      ...document,
      nodes: [...document.nodes, ...nodes],
      interfaces: [...document.interfaces, ...interfaces],
      links: [...document.links, ...links],
      layout,
    },
    nodeIds: nodes.map((n) => n.id),
  };
}

const newPort = (document: Document, nodeId: string): Interface => ({
  id: newId(INTERFACE_ID_PREFIX),
  nodeId,
  name: nextFreeName(
    INTERFACE_NAME_PREFIX[NODE_TYPE.BRIDGE],
    INTERFACE_NAME_START[NODE_TYPE.BRIDGE],
    document.interfaces.filter((i) => i.nodeId === nodeId).map((i) => i.name),
  ),
  mtu: DEFAULT_INTERFACE_MTU,
  state: DEFAULT_INTERFACE_STATE,
});

/** Joins two ends with a veth link; an end without an interface gets a new bridge port. */
export function createLink(
  document: Document,
  from: LinkEnd,
  to: LinkEnd,
): { document: Document; linkId: string } {
  let next = document;
  const endpointOf = (end: LinkEnd) => {
    if (end.interfaceId) return end.interfaceId;
    const port = newPort(next, end.nodeId);
    next = { ...next, interfaces: [...next.interfaces, port] };
    return port.id;
  };
  const endpointA = endpointOf(from);
  const endpointB = endpointOf(to);
  const linkId = newId(LINK_ID_PREFIX);
  const link: Link = {
    id: linkId,
    endpointA,
    endpointB,
    kind: "veth",
    mtu: DEFAULT_INTERFACE_MTU,
    state: DEFAULT_INTERFACE_STATE,
  };
  return { document: { ...next, links: [...next.links, link] }, linkId };
}

/** Removes a link and its bridge ports; namespace interfaces stay. */
export function removeLink(document: Document, linkId: string): Document {
  const link = document.links.find((l) => l.id === linkId);
  if (!link) return document;
  const bridgeIds = new Set(
    document.nodes.filter((n) => n.type === NODE_TYPE.BRIDGE).map((n) => n.id),
  );
  const ports = document.interfaces
    .filter(
      (i) =>
        [link.endpointA, link.endpointB].includes(i.id) &&
        bridgeIds.has(i.nodeId),
    )
    .map((i) => i.id);
  const rest = removeInterfaces(document, new Set(ports));
  return { ...rest, links: rest.links.filter((l) => l.id !== linkId) };
}
