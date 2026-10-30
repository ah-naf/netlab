import type { Role, State } from "../types/topology";

export const MTU_MIN = 68;
export const MTU_MAX = 65535;
export const INTERFACE_NAME_MAX = 15;
export const PATH_SEPARATOR = "/";

export const DEFAULT_DESTINATION = { IPV4: "0.0.0.0/0", IPV6: "::/0" } as const;
export const OBSERVED_LABEL = "Observed";
export const OBSERVED_TEXT = "Not deployed";

export const ROLE_CHOICES: { value: Role; label: string }[] = [
  { value: "host", label: "Host" },
  { value: "router", label: "Router" },
];

export const STATE_CHOICES: { value: State; label: string }[] = [
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
];

export const FIELD_LABEL = {
  NODE_NAME: "Name",
  ROLE: "Role",
  INTERFACE_NAME: "Interface name",
  MTU: "MTU",
  STATE: "State",
  ADDRESS: "Add address",
  GATEWAY: "Default gateway",
  DESTINATION: "Destination",
  ROUTE_GATEWAY: "Gateway",
  OUTPUT_INTERFACE: "Output interface",
  METRIC: "Metric",
  LAB_NAME: "Lab name",
} as const;

export const ACTION_LABEL = {
  ADD_ADDRESS: "Add",
  ADD_ROUTE: "Add route",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
  REMOVE: "Remove",
} as const;

export const SECTION_TITLE = {
  INTERFACES: "Interfaces",
  GATEWAY: "Default gateway",
  ROUTES: "Static routes",
} as const;

export const NONE_CHOICE_LABEL = "None";
export const PLACEHOLDER = {
  ADDRESS: "10.0.0.5/24",
  GATEWAY: "10.0.0.1",
} as const;

export const NO_ROUTES_TEXT = "No static routes";
export const NO_ROLE_TEXT = "Namespace";

export const FIELD_ERROR = {
  NAME_EMPTY: "Name cannot be empty",
  NAME_LONG: `Name must be at most ${INTERFACE_NAME_MAX} characters`,
  NAME_CHARS: "Name cannot contain a slash or spaces",
  NAME_DOT: "Name cannot be . or ..",
  NAME_TAKEN: "Another interface on this node uses this name",
  MTU_RANGE: `MTU must be a whole number from ${MTU_MIN} to ${MTU_MAX}`,
  CIDR_INVALID: "Enter an address like 10.0.0.5/24 or fd00::1/64",
  ADDRESS_DUPLICATE: "This interface already has this address",
  GATEWAY_INVALID: "Enter an IPv4 or IPv6 address like 10.0.0.1",
  METRIC_INVALID: "Metric must be a whole number, 0 or more",
  ROUTE_NEXT_HOP: "Set a gateway or an output interface",
  LAB_NAME_EMPTY: "Lab name cannot be empty",
} as const;

export const errorBannerText = (count: number) =>
  `This lab has errors (${count})`;
