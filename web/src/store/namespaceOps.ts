import { DEFAULT_DESTINATION } from "../constants/inspector";
import type {
  Document,
  Interface,
  Node,
  Role,
  Route,
  State,
} from "../types/topology";
import { isIpv6 } from "./ipAddress";

const DEFAULT_DESTINATIONS: string[] = Object.values(DEFAULT_DESTINATION);

export const isDefaultRoute = (route: Route) =>
  DEFAULT_DESTINATIONS.includes(route.destination);

const mapNode = (
  document: Document,
  nodeId: string,
  change: (node: Node) => Node,
): Document => ({
  ...document,
  nodes: document.nodes.map((n) => (n.id === nodeId ? change(n) : n)),
});

const mapInterface = (
  document: Document,
  interfaceId: string,
  change: (item: Interface) => Interface,
): Document => ({
  ...document,
  interfaces: document.interfaces.map((i) =>
    i.id === interfaceId ? change(i) : i,
  ),
});

export const setRole = (document: Document, nodeId: string, role: Role) =>
  mapNode(document, nodeId, (n) => ({ ...n, role }));

export const renameInterface = (
  document: Document,
  interfaceId: string,
  name: string,
) => mapInterface(document, interfaceId, (i) => ({ ...i, name: name.trim() }));

export const setInterfaceState = (
  document: Document,
  interfaceId: string,
  state: State,
) => mapInterface(document, interfaceId, (i) => ({ ...i, state }));

export const addAddress = (
  document: Document,
  interfaceId: string,
  cidr: string,
) =>
  mapInterface(document, interfaceId, (i) => ({
    ...i,
    addresses: [...(i.addresses ?? []), { cidr }],
  }));

export const removeAddress = (
  document: Document,
  interfaceId: string,
  cidr: string,
) =>
  mapInterface(document, interfaceId, (i) => ({
    ...i,
    addresses: i.addresses?.filter((a) => a.cidr !== cidr),
  }));

/** Replaces the node's default route; an empty gateway removes it. */
export function setDefaultGateway(
  document: Document,
  nodeId: string,
  gateway: string,
): Document {
  return mapNode(document, nodeId, (node) => {
    const rest = (node.routes ?? []).filter((r) => !isDefaultRoute(r));
    if (!gateway) return { ...node, routes: rest };
    const destination = isIpv6(gateway)
      ? DEFAULT_DESTINATION.IPV6
      : DEFAULT_DESTINATION.IPV4;
    return { ...node, routes: [...rest, { destination, gateway }] };
  });
}

/** Static routes are the node's routes without the default routes. */
const withStatic = (node: Node, change: (routes: Route[]) => Route[]): Node => {
  const all = node.routes ?? [];
  const defaults = all.filter(isDefaultRoute);
  return {
    ...node,
    routes: [...defaults, ...change(all.filter((r) => !isDefaultRoute(r)))],
  };
};

export const addRoute = (document: Document, nodeId: string, route: Route) =>
  mapNode(document, nodeId, (n) =>
    withStatic(n, (routes) => [...routes, route]),
  );

export const updateRoute = (
  document: Document,
  nodeId: string,
  index: number,
  route: Route,
) =>
  mapNode(document, nodeId, (n) =>
    withStatic(n, (routes) => routes.map((r, i) => (i === index ? route : r))),
  );

export const removeRoute = (
  document: Document,
  nodeId: string,
  index: number,
) =>
  mapNode(document, nodeId, (n) =>
    withStatic(n, (routes) => routes.filter((_, i) => i !== index)),
  );

export const renameLab = (document: Document, name: string): Document => ({
  ...document,
  lab: { ...document.lab, name: name.trim() },
});
