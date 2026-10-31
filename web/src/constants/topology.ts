export const NODE_TYPE = { NAMESPACE: "namespace", BRIDGE: "bridge" } as const;

export const NODE_STATUS = {
  DESIRED: "desired",
  DEPLOYED: "deployed",
  FAILED: "failed",
  DRIFTED: "drifted",
} as const;

export const INTERFACE_ID_PREFIX = "if-";
export const DEFAULT_INTERFACE_STATE = "up";
export const DEFAULT_POSITION = { x: 0, y: 0 };

export const INTERFACE_NAME_PREFIX = {
  [NODE_TYPE.NAMESPACE]: "eth",
  [NODE_TYPE.BRIDGE]: "port",
} as const;

export const INTERFACE_NAME_START = {
  [NODE_TYPE.NAMESPACE]: 0,
  [NODE_TYPE.BRIDGE]: 1,
} as const;

export const ADD_LABEL = {
  [NODE_TYPE.NAMESPACE]: "Add interface",
  [NODE_TYPE.BRIDGE]: "Add port",
} as const;

export const REMOVE_LABEL = "Remove";
export const NO_SELECTION_HINT = "Select a node to edit its interfaces.";
export const NO_ADDRESS_TEXT = "no address";

export const STATUS_STYLE = {
  [NODE_STATUS.DESIRED]: {
    label: "Desired",
    glyph: "○",
    borderClass: "border-dashed border-rule",
  },
  [NODE_STATUS.DEPLOYED]: {
    label: "Deployed",
    glyph: "✓",
    borderClass: "border-solid border-led-ok",
  },
  [NODE_STATUS.FAILED]: {
    label: "Failed",
    glyph: "✕",
    borderClass: "border-solid border-led-fault",
  },
  [NODE_STATUS.DRIFTED]: {
    label: "Drifted",
    glyph: "⚠",
    borderClass: "border-dotted border-led-warn",
  },
} as const;
