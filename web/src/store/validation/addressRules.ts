import { NODE_TYPE } from "../../constants/topology.ts";
import { ISSUE_CODE } from "../../constants/validation.ts";
import type { Document, Interface, Node } from "../../types/topology.ts";
import type { Issue } from "../../types/validation.ts";
import { cidrContains, isCidr, parseIp } from "../ipAddress.ts";
import { makeIssue } from "./makeIssue.ts";

const KEY_SEPARATOR = "|";

const invalidCidrIssues = (document: Document): Issue[] =>
  document.interfaces.flatMap((iface) =>
    (iface.addresses ?? [])
      .filter((a) => !isCidr(a.cidr))
      .map(() => makeIssue(ISSUE_CODE.INVALID_CIDR, iface.id, iface.name)),
  );

function unreachableRoutes(document: Document, node: Node): Issue[] {
  const owned = document.interfaces.filter((i) => i.nodeId === node.id);
  const reachable = (gateway: string, interfaceId?: string) =>
    owned
      .filter((i) => !interfaceId || i.id === interfaceId)
      .some((i) => i.addresses?.some((a) => cidrContains(a.cidr, gateway)));
  const bad = (node.routes ?? []).some(
    (r) =>
      r.gateway &&
      (!r.interfaceId || owned.some((i) => i.id === r.interfaceId)) &&
      !reachable(r.gateway, r.interfaceId),
  );
  return bad
    ? [makeIssue(ISSUE_CODE.ROUTE_GATEWAY_UNREACHABLE, node.id, node.name)]
    : [];
}

/** Interfaces joined by a link, or sitting on the same bridge, share a segment. */
function segmentOf(document: Document): (interfaceId: string) => string {
  const parent = new Map<string, string>();
  const find = (id: string): string => {
    const up = parent.get(id) ?? id;
    return up === id ? id : find(up);
  };
  const join = (a: string, b: string) => parent.set(find(a), find(b));
  document.links.forEach((l) => join(l.endpointA, l.endpointB));
  document.nodes
    .filter((n) => n.type === NODE_TYPE.BRIDGE)
    .forEach((bridge) => {
      const ports = document.interfaces.filter((i) => i.nodeId === bridge.id);
      ports.forEach((p) => join(ports[0].id, p.id));
    });
  return find;
}

function duplicateAddressIssues(document: Document): Issue[] {
  const segment = segmentOf(document);
  const holders = new Map<string, Interface[]>();
  document.interfaces.forEach((iface) =>
    iface.addresses?.forEach((a) => {
      const ip = parseIp(a.cidr.split("/")[0]);
      if (!ip || !isCidr(a.cidr)) return;
      const key = `${segment(iface.id)}${KEY_SEPARATOR}${ip.bits}${KEY_SEPARATOR}${ip.value}`;
      const list = holders.get(key) ?? [];
      if (!list.includes(iface)) holders.set(key, [...list, iface]);
    }),
  );
  return [...holders.values()].flatMap(([first, ...rest]) =>
    rest.map((iface) =>
      makeIssue(ISSUE_CODE.DUPLICATE_IP_ON_SEGMENT, iface.id, iface.name, [
        first.id,
      ]),
    ),
  );
}

export const addressRules = (document: Document): Issue[] => [
  ...invalidCidrIssues(document),
  ...document.nodes.flatMap((node) => unreachableRoutes(document, node)),
  ...duplicateAddressIssues(document),
];
