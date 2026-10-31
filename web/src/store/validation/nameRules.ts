import { INTERFACE_NAME_MAX, PLAIN_NAME } from "../../constants/inspector.ts";
import { ISSUE_CODE } from "../../constants/validation.ts";
import type { Document, Interface, Node } from "../../types/topology.ts";
import type { Issue, IssueCode } from "../../types/validation.ts";
import { linuxName } from "./linuxName.ts";
import { makeIssue } from "./makeIssue.ts";

interface Finding {
  code: IssueCode;
  relatedId?: string;
}

/** `scope` is the nodes to compare with; the aggregate rule passes only earlier nodes. */
function nodeNameFindings(
  document: Document,
  node: Node | undefined,
  name: string,
  scope: Node[],
): Finding[] {
  const trimmed = name.trim();
  if (!trimmed) return [{ code: ISSUE_CODE.NODE_NAME_EMPTY }];
  if (!PLAIN_NAME.test(trimmed)) return [{ code: ISSUE_CODE.NODE_NAME_CHARS }];
  const others = scope.filter((n) => n !== node);
  const same = others.find((n) => n.name === trimmed);
  if (same)
    return [{ code: ISSUE_CODE.DUPLICATE_NODE_NAME, relatedId: same.id }];
  const derived = linuxName(document.lab.id, trimmed);
  const clash = others.find(
    (n) => linuxName(document.lab.id, n.name.trim()) === derived,
  );
  return clash
    ? [{ code: ISSUE_CODE.LINUX_NAME_COLLISION, relatedId: clash.id }]
    : [];
}

function interfaceNameFindings(
  iface: Interface | undefined,
  name: string,
  scope: Interface[],
): Finding[] {
  const found: Finding[] = [];
  if (!name || name.length > INTERFACE_NAME_MAX)
    found.push({ code: ISSUE_CODE.INTERFACE_NAME_LENGTH });
  if (name && !PLAIN_NAME.test(name))
    found.push({ code: ISSUE_CODE.INTERFACE_NAME_CHARS });
  const same = scope.find(
    (i) => i !== iface && i.nodeId === iface?.nodeId && i.name === name,
  );
  if (same)
    found.push({
      code: ISSUE_CODE.DUPLICATE_INTERFACE_NAME,
      relatedId: same.id,
    });
  return found;
}

/** Codes a candidate node name would raise; used by the field check. */
export const nodeNameCodes = (
  document: Document,
  nodeId: string,
  name: string,
): IssueCode[] =>
  nodeNameFindings(
    document,
    document.nodes.find((n) => n.id === nodeId),
    name,
    document.nodes,
  ).map((f) => f.code);

/** Codes a candidate interface name would raise; used by the field check. */
export const interfaceNameCodes = (
  document: Document,
  interfaceId: string,
  name: string,
): IssueCode[] =>
  interfaceNameFindings(
    document.interfaces.find((i) => i.id === interfaceId),
    name,
    document.interfaces,
  ).map((f) => f.code);

export const nameRules = (document: Document): Issue[] => [
  ...document.nodes.flatMap((node, index) =>
    nodeNameFindings(
      document,
      node,
      node.name,
      document.nodes.slice(0, index),
    ).map((f) =>
      makeIssue(f.code, node.id, node.name, f.relatedId ? [f.relatedId] : []),
    ),
  ),
  ...document.interfaces.flatMap((iface, index) =>
    interfaceNameFindings(
      iface,
      iface.name,
      document.interfaces.slice(0, index),
    ).map((f) =>
      makeIssue(f.code, iface.id, iface.name, f.relatedId ? [f.relatedId] : []),
    ),
  ),
];
