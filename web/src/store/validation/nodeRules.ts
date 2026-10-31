import { NODE_TYPE } from "../../constants/topology.ts";
import { ISSUE_CODE } from "../../constants/validation.ts";
import type { Document, Node } from "../../types/topology.ts";
import type { Issue } from "../../types/validation.ts";
import { makeIssue } from "./makeIssue.ts";

const hasNamespaceFields = (node: Node) =>
  node.role !== undefined ||
  node.router !== undefined ||
  !!node.natRules?.length ||
  !!node.routes?.length;

function nodeIssues(document: Document, node: Node): Issue[] {
  const issue = (code: Issue["code"]) => makeIssue(code, node.id, node.name);
  const onNode = (interfaceId?: string) =>
    document.interfaces.some(
      (i) => i.id === interfaceId && i.nodeId === node.id,
    );
  const found: Issue[] = [];
  if (node.type === NODE_TYPE.BRIDGE && hasNamespaceFields(node))
    found.push(issue(ISSUE_CODE.BRIDGE_HAS_NAMESPACE_FIELDS));
  if (node.natRules?.some((rule) => !onNode(rule.interfaceId)))
    found.push(issue(ISSUE_CODE.NAT_INTERFACE_NOT_ON_NODE));
  if (node.routes?.some((r) => r.interfaceId && !onNode(r.interfaceId)))
    found.push(issue(ISSUE_CODE.ROUTE_INTERFACE_MISSING));
  return found;
}

export const nodeRules = (document: Document): Issue[] => [
  ...document.interfaces
    .filter((i) => !document.nodes.some((n) => n.id === i.nodeId))
    .map((i) => makeIssue(ISSUE_CODE.INTERFACE_NODE_MISSING, i.id, i.name)),
  ...document.nodes.flatMap((node) => nodeIssues(document, node)),
];
