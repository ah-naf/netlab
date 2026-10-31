export const STP_PRIORITY_MIN = 0;
export const STP_PRIORITY_MAX = 65535;
export const STP_PRIORITY_DEFAULT = 32768;

export const BRIDGE_LINK_GROUP_TITLE = {
  BRIDGE: "Bridge",
  PORTS: "Ports",
  STP: "Spanning tree",
  VLAN: "VLAN",
  LINK: "Link",
  ENDPOINT_A: "Endpoint A",
  ENDPOINT_B: "Endpoint B",
  LAB: "Lab",
  SUMMARY: "Summary",
} as const;

export const BRIDGE_LINK_FIELD_LABEL = {
  BRIDGE_NAME: "Bridge name",
  PORT_NAME: "Port name",
  STP: "STP enabled",
  STP_PRIORITY: "STP priority",
  LINK_MTU: "MTU",
  LINK_STATE: "State",
  ENDPOINT_NODE: "Node",
  ENDPOINT_INTERFACE: "Interface name",
} as const;

export const LEADS_TO_LABEL = "Leads to";
export const NOT_LINKED_TEXT = "Not linked";
export const VLAN_NOTE = "VLAN settings are not supported yet.";

export const SUMMARY_LABEL = {
  namespaces: "Namespaces",
  bridges: "Bridges",
  interfaces: "Interfaces",
  links: "Links",
} as const;

export const STP_ERROR = `STP priority must be a whole number from ${STP_PRIORITY_MIN} to ${STP_PRIORITY_MAX}`;

export const peerText = (nodeName: string, interfaceName: string) =>
  `${nodeName} ${interfaceName}`;
