import { LINK_KIND } from "../../constants/links.ts";
import { NODE_TYPE } from "../../constants/topology.ts";
import { ISSUE_CODE } from "../../constants/validation.ts";
import type { Document, Link } from "../../types/topology.ts";
import type { Issue } from "../../types/validation.ts";
import { makeIssue } from "./makeIssue.ts";

const NODE_TYPES: string[] = Object.values(NODE_TYPE);

function linkIssues(document: Document, link: Link): Issue[] {
  const ends = [link.endpointA, link.endpointB].map((id) =>
    document.interfaces.find((i) => i.id === id),
  );
  const issue = (code: Issue["code"]) => makeIssue(code, link.id, link.id);
  const found: Issue[] = [];
  if (ends.some((end) => !end)) found.push(issue(ISSUE_CODE.DANGLING_ENDPOINT));
  if (link.endpointA === link.endpointB)
    found.push(issue(ISSUE_CODE.LINK_SAME_INTERFACE));
  const badEnd = ends.some((end) => {
    const node = document.nodes.find((n) => n.id === end?.nodeId);
    return end && !(node && NODE_TYPES.includes(node.type));
  });
  if (badEnd || link.kind !== LINK_KIND.VETH)
    found.push(issue(ISSUE_CODE.LINK_ENDPOINT_KIND));
  return found;
}

function sharedInterfaceIssues(document: Document): Issue[] {
  const linksOf = new Map<string, string[]>();
  document.links.forEach((link) =>
    new Set([link.endpointA, link.endpointB]).forEach((id) =>
      linksOf.set(id, [...(linksOf.get(id) ?? []), link.id]),
    ),
  );
  return document.interfaces.flatMap((iface) => {
    const linkIds = linksOf.get(iface.id) ?? [];
    return linkIds.length > 1
      ? [
          makeIssue(
            ISSUE_CODE.INTERFACE_IN_TWO_LINKS,
            iface.id,
            iface.name,
            linkIds,
          ),
        ]
      : [];
  });
}

export const linkRules = (document: Document): Issue[] => [
  ...document.links.flatMap((link) => linkIssues(document, link)),
  ...sharedInterfaceIssues(document),
];
