import type {
  DrawerTab,
  LayoutState,
  SizeRange,
  ToolbarAction,
} from "../types/layout";

export const APP_NAME = "NetLab";
export const DEFAULT_PROJECT_NAME = "Untitled lab";
export const NOT_AVAILABLE_TEXT = "Not available yet";

export const LAYOUT_STORAGE_KEY = "netlab.layout";
export const APP_MIN_WIDTH = 1024;
export const CENTER_MIN_WIDTH = 400;
export const RESIZE_STEP = 16;

export const SIZE_RANGE = {
  leftWidth: { min: 180, max: 400, fallback: 240 },
  rightWidth: { min: 240, max: 480, fallback: 300 },
  drawerHeight: { min: 120, max: 480, fallback: 240 },
} as const satisfies Record<string, SizeRange>;

export const DRAWER_TAB_ID = {
  DEPLOYMENT_LOGS: "deploymentLogs",
  INTERFACE_STATE: "interfaceState",
  ADDRESSES: "addresses",
  ROUTES: "routes",
  NEIGHBORS: "neighbors",
  BRIDGE_STATE: "bridgeState",
  FIREWALL_NAT: "firewallNat",
  PACKET_CAPTURE: "packetCapture",
  DIAGNOSTICS: "diagnostics",
} as const;

export const DRAWER_TABS: readonly DrawerTab[] = [
  { id: DRAWER_TAB_ID.DEPLOYMENT_LOGS, label: "Deployment logs" },
  { id: DRAWER_TAB_ID.INTERFACE_STATE, label: "Interface state" },
  { id: DRAWER_TAB_ID.ADDRESSES, label: "Addresses" },
  { id: DRAWER_TAB_ID.ROUTES, label: "Routes" },
  { id: DRAWER_TAB_ID.NEIGHBORS, label: "Neighbors" },
  { id: DRAWER_TAB_ID.BRIDGE_STATE, label: "Bridge state" },
  { id: DRAWER_TAB_ID.FIREWALL_NAT, label: "Firewall/NAT" },
  { id: DRAWER_TAB_ID.PACKET_CAPTURE, label: "Packet capture" },
  { id: DRAWER_TAB_ID.DIAGNOSTICS, label: "Diagnostics" },
];

export const DEFAULT_LAYOUT: LayoutState = {
  leftWidth: SIZE_RANGE.leftWidth.fallback,
  rightWidth: SIZE_RANGE.rightWidth.fallback,
  drawerHeight: SIZE_RANGE.drawerHeight.fallback,
  drawerCollapsed: false,
  activeTab: DRAWER_TAB_ID.DEPLOYMENT_LOGS,
};

const disabledAction = (id: string, label: string): ToolbarAction => ({
  id,
  label,
  enabled: false,
  disabledReason: NOT_AVAILABLE_TEXT,
});

export const FILE_ACTIONS: readonly ToolbarAction[] = [
  disabledAction("save", "Save"),
  disabledAction("validate", "Validate"),
];

export const LAB_ACTIONS: readonly ToolbarAction[] = [
  disabledAction("deploy", "Deploy"),
  disabledAction("stop", "Stop lab"),
  disabledAction("reset", "Reset lab"),
];

export const REGION = {
  COMPONENTS: {
    label: "Components",
    hint: "The device palette arrives with the editor.",
  },
  CANVAS: {
    label: "Canvas",
    hint: "Your topology will be drawn here.",
  },
  INSPECTOR: {
    label: "Inspector",
    hint: "Settings for the selected device or link will show here.",
  },
} as const;
