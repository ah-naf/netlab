export const BRIDGE_LINK_GROUP_TITLE = {
  BRIDGE: "Bridge",
  PORTS: "Ports",
  LINK: "Link",
  ENDPOINT_A: "Endpoint A",
  ENDPOINT_B: "Endpoint B",
  LAB: "Lab",
  SUMMARY: "Summary",
} as const;

export const BRIDGE_LINK_FIELD_LABEL = {
  BRIDGE_NAME: "Bridge name",
  PORT_NAME: "Port name",
  LINK_STATE: "State",
  ENDPOINT_NODE: "Node",
  ENDPOINT_INTERFACE: "Interface name",
} as const;

export const LEADS_TO_LABEL = "Leads to";
export const NOT_LINKED_TEXT = "Not linked";

export const SUMMARY_LABEL = {
  namespaces: "Namespaces",
  bridges: "Bridges",
  interfaces: "Interfaces",
  links: "Links",
} as const;

export const peerText = (nodeName: string, interfaceName: string) =>
  `${nodeName} ${interfaceName}`;
