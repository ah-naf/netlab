import { INTERFACE_NAME_MAX, FIELD_ERROR } from "./inspector.ts";
import { NAME_ERROR } from "./palette.ts";

export const SEVERITY = { ERROR: "error" } as const;

/** Meaning of every code is fixed in specs/013-frontend-validator/contracts/issue-codes.md. */
export const ISSUE_CODE = {
  DUPLICATE_ID: "DUPLICATE_ID",
  NODE_NAME_EMPTY: "NODE_NAME_EMPTY",
  DUPLICATE_NODE_NAME: "DUPLICATE_NODE_NAME",
  NODE_NAME_CHARS: "NODE_NAME_CHARS",
  DUPLICATE_INTERFACE_NAME: "DUPLICATE_INTERFACE_NAME",
  INTERFACE_NAME_LENGTH: "INTERFACE_NAME_LENGTH",
  INTERFACE_NAME_CHARS: "INTERFACE_NAME_CHARS",
  LINUX_NAME_COLLISION: "LINUX_NAME_COLLISION",
  INVALID_CIDR: "INVALID_CIDR",
  INTERFACE_NODE_MISSING: "INTERFACE_NODE_MISSING",
  DANGLING_ENDPOINT: "DANGLING_ENDPOINT",
  LINK_SAME_INTERFACE: "LINK_SAME_INTERFACE",
  INTERFACE_IN_TWO_LINKS: "INTERFACE_IN_TWO_LINKS",
  LINK_ENDPOINT_KIND: "LINK_ENDPOINT_KIND",
  BRIDGE_HAS_NAMESPACE_FIELDS: "BRIDGE_HAS_NAMESPACE_FIELDS",
  NAT_INTERFACE_NOT_ON_NODE: "NAT_INTERFACE_NOT_ON_NODE",
  ROUTE_INTERFACE_MISSING: "ROUTE_INTERFACE_MISSING",
} as const;

/** Tie-break order in the issue list. */
export const ISSUE_ORDER = Object.values(ISSUE_CODE);

export const ISSUE_SEVERITY = Object.fromEntries(
  ISSUE_ORDER.map((code) => [code, SEVERITY.ERROR]),
) as Record<keyof typeof ISSUE_CODE, "error">;

/** One message per code: the issue list and the field checks show the same text. */
export const ISSUE_MESSAGE: Record<keyof typeof ISSUE_CODE, string> = {
  DUPLICATE_ID: "Two resources of the same kind share an id",
  NODE_NAME_EMPTY: NAME_ERROR.EMPTY,
  DUPLICATE_NODE_NAME: NAME_ERROR.TAKEN,
  NODE_NAME_CHARS: FIELD_ERROR.NAME_CHARS,
  DUPLICATE_INTERFACE_NAME: FIELD_ERROR.NAME_TAKEN,
  INTERFACE_NAME_LENGTH: `Name must be 1 to ${INTERFACE_NAME_MAX} characters`,
  INTERFACE_NAME_CHARS: FIELD_ERROR.NAME_CHARS,
  LINUX_NAME_COLLISION: "Another node would get the same deploy-time name",
  INVALID_CIDR: FIELD_ERROR.CIDR_INVALID,
  INTERFACE_NODE_MISSING: "The interface belongs to a node that does not exist",
  DANGLING_ENDPOINT: "A link end points to an interface that does not exist",
  LINK_SAME_INTERFACE: "A link cannot join an interface to itself",
  INTERFACE_IN_TWO_LINKS: "This interface is used by more than one link",
  LINK_ENDPOINT_KIND: "A link end or the link type is not supported",
  BRIDGE_HAS_NAMESPACE_FIELDS:
    "A bridge cannot have a role, routes, or NAT rules",
  NAT_INTERFACE_NOT_ON_NODE: "A NAT rule uses an interface of another node",
  ROUTE_INTERFACE_MISSING: "A route uses an interface that is not on this node",
};

export const LINUX_NAME = {
  PREFIX: "nl-",
  LAB_ID_CHARS: 4,
  MAX: 15,
  HASH_DIGITS: 4,
  SEPARATOR: "-",
} as const;

export const ISSUES_TAB_LABEL = "Issues";
export const ISSUES_TAB_HINT = "Problems found in the lab.";
export const ISSUES_EMPTY_TEXT = "No issues found";
export const ISSUES_PROMPT_TEXT = "Press Validate to check the lab";
export const ISSUES_CLOSE_LABEL = "Close";
export const issuesCountText = (errors: number) =>
  `${errors} ${errors === 1 ? "error" : "errors"}`;

export const SEVERITY_LABEL = { error: "Error" } as const;
export const SEVERITY_GLYPH = { error: "✕" } as const;
export const SEVERITY_TEXT = {
  error: "text-led-fault",
} as const;
export const SELECTED_RING = "ring-2 ring-signal";
export const SELECTED_WITH_ISSUE_OUTLINE =
  "outline outline-2 outline-offset-2 outline-signal";
export const SEVERITY_RING = {
  error: "ring-2 ring-led-fault",
} as const;
export const LINK_ISSUE_CLASS = {
  error: "link-issue-error",
} as const;
