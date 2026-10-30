import { create } from "zustand";
import { HISTORY_LIMIT, PALETTE_ENTRIES } from "../constants/palette";
import {
  DEFAULT_INTERFACE_MTU,
  DEFAULT_INTERFACE_STATE,
  INTERFACE_ID_PREFIX,
  INTERFACE_NAME_PREFIX,
  INTERFACE_NAME_START,
} from "../constants/topology";
import { CURRENT_VERSION } from "../types/topologyDocument";
import type { PaletteKind } from "../types/palette";
import type { Document, Interface, Position } from "../types/topology";
import {
  createNode,
  deleteNodes,
  duplicateNodes,
  removeInterfaces,
  renameNode,
  validateNodeName,
} from "./documentOps";
import { nextFreeName } from "./naming";

interface TopologyState {
  document: Document;
  selectedNodeIds: string[];
  past: Document[];
  future: Document[];
  dragBase: Document | null;
  loadDocument: (document: Document) => void;
  setSelection: (nodeIds: string[]) => void;
  createNode: (entryId: PaletteKind, position: Position) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  renameNode: (nodeId: string, name: string) => string | null;
  addInterface: (nodeId: string) => void;
  removeInterface: (interfaceId: string) => void;
  beginDrag: () => void;
  moveNode: (nodeId: string, position: Position) => void;
  endDrag: () => void;
}

const EMPTY_DOCUMENT: Document = {
  schemaVersion: CURRENT_VERSION,
  lab: { id: "", name: "" },
  nodes: [],
  interfaces: [],
  links: [],
};

export const interfacesOf = (document: Document, nodeId: string): Interface[] =>
  document.interfaces.filter((item) => item.nodeId === nodeId);

/** One user action is one history step. */
const withHistory = (
  state: TopologyState,
  document: Document,
  previous: Document = state.document,
) => ({
  document,
  past: [...state.past, previous].slice(-HISTORY_LIMIT),
  future: [],
});

export const useTopologyStore = create<TopologyState>()((set, get) => ({
  document: EMPTY_DOCUMENT,
  selectedNodeIds: [],
  past: [],
  future: [],
  dragBase: null,
  loadDocument: (document) =>
    set({ document, selectedNodeIds: [], past: [], future: [] }),
  setSelection: (selectedNodeIds) => set({ selectedNodeIds }),
  createNode: (entryId, position) =>
    set((state) => {
      const entry = PALETTE_ENTRIES.find((e) => e.id === entryId);
      if (!entry?.available) return {};
      const created = createNode(state.document, entry, position);
      return {
        ...withHistory(state, created.document),
        selectedNodeIds: [created.nodeId],
      };
    }),
  deleteSelected: () =>
    set((state) => {
      if (!state.selectedNodeIds.length) return {};
      const next = deleteNodes(state.document, new Set(state.selectedNodeIds));
      return { ...withHistory(state, next), selectedNodeIds: [] };
    }),
  duplicateSelected: () =>
    set((state) => {
      if (!state.selectedNodeIds.length) return {};
      const copied = duplicateNodes(
        state.document,
        new Set(state.selectedNodeIds),
      );
      return {
        ...withHistory(state, copied.document),
        selectedNodeIds: copied.nodeIds,
      };
    }),
  renameNode: (nodeId, name) => {
    const { document } = get();
    const error = validateNodeName(document, nodeId, name);
    if (!error)
      set((state) => withHistory(state, renameNode(document, nodeId, name)));
    return error;
  },
  addInterface: (nodeId) =>
    set((state) => {
      const { document } = state;
      const node = document.nodes.find((n) => n.id === nodeId);
      if (!node) return {};
      const item: Interface = {
        id: `${INTERFACE_ID_PREFIX}${crypto.randomUUID()}`,
        nodeId,
        name: nextFreeName(
          INTERFACE_NAME_PREFIX[node.type],
          INTERFACE_NAME_START[node.type],
          interfacesOf(document, nodeId).map((i) => i.name),
        ),
        mtu: DEFAULT_INTERFACE_MTU,
        state: DEFAULT_INTERFACE_STATE,
      };
      return withHistory(state, {
        ...document,
        interfaces: [...document.interfaces, item],
      });
    }),
  removeInterface: (interfaceId) =>
    set((state) =>
      withHistory(
        state,
        removeInterfaces(state.document, new Set([interfaceId])),
      ),
    ),
  beginDrag: () => set((state) => ({ dragBase: state.document })),
  moveNode: (nodeId, position) =>
    set(({ document }) => ({
      document: {
        ...document,
        layout: { ...document.layout, [nodeId]: position },
      },
    })),
  endDrag: () =>
    set((state) => {
      const { dragBase, document } = state;
      if (!dragBase) return {};
      const moved = dragBase !== document;
      return {
        dragBase: null,
        ...(moved ? withHistory(state, document, dragBase) : {}),
      };
    }),
}));
