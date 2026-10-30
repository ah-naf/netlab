import type { PaletteEntry, PaletteKind } from "../types/palette";
import { NODE_TYPE } from "./topology";

export const PALETTE_ENTRIES: readonly PaletteEntry[] = [
  {
    id: "namespace",
    label: "Namespace",
    description: "Isolated network stack with its own interfaces and routes",
    create: { type: NODE_TYPE.NAMESPACE },
    available: true,
  },
  {
    id: "host",
    label: "Host",
    description: "A computer on the lab network",
    create: { type: NODE_TYPE.NAMESPACE, role: "host" },
    available: true,
  },
  {
    id: "veth",
    label: "veth pair",
    description: "A virtual cable between two interfaces",
    create: null,
    available: false,
  },
  {
    id: "bridge",
    label: "Linux bridge",
    description: "Connects interfaces like a switch",
    create: { type: NODE_TYPE.BRIDGE },
    available: true,
  },
  {
    id: "router",
    label: "Router",
    description: "Forwards traffic between networks",
    create: { type: NODE_TYPE.NAMESPACE, role: "router" },
    available: true,
  },
  {
    id: "nat",
    label: "NAT gateway",
    description: "Translates addresses between inside and outside",
    create: { type: NODE_TYPE.NAMESPACE, role: "nat" },
    available: true,
  },
];

export const PALETTE_DRAG_TYPE = "application/x-netlab-part";

/** Default node name is prefix plus the smallest free number from start. */
export const NAME_RULE: Partial<
  Record<PaletteKind, { prefix: string; start: number }>
> = {
  namespace: { prefix: "ns", start: 1 },
  host: { prefix: "ns", start: 1 },
  router: { prefix: "r", start: 1 },
  nat: { prefix: "nat", start: 1 },
  bridge: { prefix: "br", start: 0 },
};

export const NODE_ID_PREFIX = "node-";
export const LINK_ID_PREFIX = "link-";
export const HISTORY_LIMIT = 100;
export const DUPLICATE_OFFSET = { x: 40, y: 40 };

export const SEARCH_LABEL = "Search parts";
export const NO_MATCH_TEXT = "No matching parts";
export const NODE_NAME_LABEL = "Node name";

export const NAME_ERROR = {
  EMPTY: "Name cannot be empty",
  TAKEN: "Another node already uses this name",
} as const;

export const KEY = { DELETE: "Delete", UNDO: "z", REDO: "y", DUPLICATE: "d" };

export const MULTI_SELECT_HINT =
  "Press Delete to remove or Ctrl+D to duplicate.";
export const multiSelectText = (count: number) => `${count} nodes selected`;
