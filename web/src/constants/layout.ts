import type {
  DrawerTab,
  LayoutState,
  SizeRange,
  ToolbarAction,
} from "../types/layout";
import { OPEN_LABEL, SAVE_LABEL } from "./labFile";
import { ISSUES_TAB_HINT, ISSUES_TAB_LABEL } from "./validation";

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
  ISSUES: "issues",
  DEPLOYMENT_LOGS: "deploymentLogs",
} as const;

export const DRAWER_TABS: readonly DrawerTab[] = [
  {
    id: DRAWER_TAB_ID.ISSUES,
    label: ISSUES_TAB_LABEL,
    hint: ISSUES_TAB_HINT,
  },
  {
    id: DRAWER_TAB_ID.DEPLOYMENT_LOGS,
    label: "Deployment logs",
    hint: "Output from each deploy step will stream here.",
  },
];

export const DEFAULT_LAYOUT: LayoutState = {
  leftWidth: SIZE_RANGE.leftWidth.fallback,
  rightWidth: SIZE_RANGE.rightWidth.fallback,
  drawerHeight: SIZE_RANGE.drawerHeight.fallback,
  drawerCollapsed: false,
  activeTab: DRAWER_TAB_ID.DEPLOYMENT_LOGS,
};

export const SAVE_ACTION_ID = "save";
export const OPEN_ACTION_ID = "open";
export const VALIDATE_ACTION_ID = "validate";

const disabledAction = (id: string, label: string): ToolbarAction => ({
  id,
  label,
  enabled: false,
  disabledReason: NOT_AVAILABLE_TEXT,
});

export const FILE_ACTIONS: readonly ToolbarAction[] = [
  {
    id: SAVE_ACTION_ID,
    label: SAVE_LABEL,
    enabled: true,
    disabledReason: "",
  },
  {
    id: OPEN_ACTION_ID,
    label: OPEN_LABEL,
    enabled: true,
    disabledReason: "",
  },
  {
    id: VALIDATE_ACTION_ID,
    label: "Validate",
    enabled: true,
    disabledReason: "",
  },
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

export const DRAWER_LABEL = "Bottom drawer";
export const RAIL_SIZE = 6;
export const DRAWER_HEADER_HEIGHT = 36;
export const DRAWER_PANEL_ID = "drawer-panel";
export const tabDomId = (id: string) => `drawer-tab-${id}`;

export const RESIZING_ATTRIBUTE = "resizing";

/** Direction each key moves the pointer position along an axis. */
export const RESIZE_KEYS = {
  x: { ArrowRight: 1, ArrowLeft: -1 },
  y: { ArrowDown: 1, ArrowUp: -1 },
} as const;

export const COLLAPSE_LABEL = "Collapse drawer";
export const EXPAND_LABEL = "Expand drawer";

export const RESIZE_LABEL = {
  LEFT: "Resize components column",
  RIGHT: "Resize inspector column",
  DRAWER: "Resize drawer",
} as const;

export const TOOLBAR_HEIGHT = 44;
export const CANVAS_MIN_HEIGHT = 160;

export const CANVAS_LABEL = REGION.CANVAS.label;
