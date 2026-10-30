export const NEW_PORT_HANDLE_ID = "new-port";
export const NEW_PORT_LABEL = "New port";
export const LINK_NOTICE_MS = 4000;

export const LINK_REASON = {
  SELF_LINK: "A node cannot link to itself.",
  ALREADY_LINKED: "That interface is already in a link.",
  UNSUPPORTED: "These two node types cannot be linked.",
} as const;

export const linkLabel = (nameA: string, nameB: string, mtu: number) =>
  `${nameA} ↔ ${nameB} · MTU ${mtu}`;
