import type { Role, State } from "../types/topology";

export const INTERFACE_NAME_MAX = 15;
export const PLAIN_NAME = /^[A-Za-z0-9_-]+$/;

export const DEFAULT_DESTINATION = { IPV4: "0.0.0.0/0", IPV6: "::/0" } as const;

export const ROLE_CHOICES: { value: Role; label: string }[] = [
  { value: "host", label: "Host" },
  { value: "router", label: "Router" },
];

export const STATE_CHOICES: { value: State; label: string }[] = [
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
];

export const FIELD_LABEL = {
  NODE_NAME: "Namespace name",
  ROLE: "Role",
  INTERFACE_NAME: "Interface name",
  STATE: "State",
  ADDRESS: "Add address",
  GATEWAY_ADDRESS: "Gateway address",
  DESTINATION: "Destination",
  ROUTE_GATEWAY: "Gateway",
  OUTPUT_INTERFACE: "Output interface",
  METRIC: "Metric",
  LAB_NAME: "Lab name",
} as const;

export const ACTION_LABEL = {
  ADD_ROUTE: "Add route",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
} as const;

export const GROUP_TITLE = {
  NAMESPACE: "Namespace",
  INTERFACES: "Interfaces",
  GATEWAY: "Default gateway",
  ROUTES: "Static routes",
} as const;

export const ADDRESSES_LABEL = "Addresses";
export const ADD_ADDRESS_HINT = "Press Enter to add";

export const REMOVE_TEXT = {
  ADDRESS: "Remove address",
  INTERFACE: "Remove interface",
  ROUTE: "Remove route",
  PORT: "Remove port",
} as const;

export const removeLabel = (text: string, target: string) =>
  `${text} ${target}`;

export const NEW_ROUTE_TITLE = "New route";
export const routeTitle = (destination: string) => `Route to ${destination}`;

export const SECTION_ERROR = {
  TEXT: "This section could not be shown",
  RETRY: "Try again",
} as const;

export const NONE_CHOICE_LABEL = "None";
export const PLACEHOLDER = {
  ADDRESS: "e.g. 10.0.0.5/24",
  GATEWAY: "e.g. 10.0.0.1",
} as const;

export const NO_ROUTES_TEXT = "No static routes";
export const ROLE_NAME = {
  host: "Host",
  router: "Router",
} as const;
export const NO_ROLE_TEXT = "Namespace (no role)";

export const FIELD_ERROR = {
  NAME_CHARS: "Name can use only letters, digits, - and _",
  NAME_TAKEN: "Another interface on this node uses this name",
  CIDR_INVALID: "Enter an address like 10.0.0.5/24 or fd00::1/64",
  ADDRESS_DUPLICATE: "This interface already has this address",
  GATEWAY_INVALID: "Enter an IPv4 or IPv6 address like 10.0.0.1",
  METRIC_INVALID: "Metric must be a whole number, 0 or more",
  ROUTE_NEXT_HOP: "Set a gateway or an output interface",
  LAB_NAME_EMPTY: "Lab name cannot be empty",
} as const;

export const errorBannerText = (count: number) =>
  `This lab has errors (${count})`;
