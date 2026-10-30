import { create } from "zustand";
import {
  DEFAULT_INTERFACE_MTU,
  DEFAULT_INTERFACE_STATE,
  INTERFACE_ID_PREFIX,
} from "../constants/topology";
import { CURRENT_VERSION } from "../types/topologyDocument";
import type { Document, Interface, Node, Position } from "../types/topology";
import { nextInterfaceName } from "./interfaceNaming";

interface TopologyState {
  document: Document;
  selectedNodeId: string | null;
  loadDocument: (document: Document) => void;
  selectNode: (nodeId: string | null) => void;
  addInterface: (nodeId: string) => void;
  removeInterface: (interfaceId: string) => void;
  setNodePosition: (nodeId: string, position: Position) => void;
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

const withoutRef = (node: Node, interfaceId: string): Node => ({
  ...node,
  routes: node.routes?.filter((r) => r.interfaceId !== interfaceId),
  natRules: node.natRules?.filter((r) => r.interfaceId !== interfaceId),
});

export const useTopologyStore = create<TopologyState>()((set) => ({
  document: EMPTY_DOCUMENT,
  selectedNodeId: null,
  loadDocument: (document) => set({ document, selectedNodeId: null }),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
  addInterface: (nodeId) =>
    set(({ document }) => {
      const node = document.nodes.find((n) => n.id === nodeId);
      if (!node) return {};
      const item: Interface = {
        id: `${INTERFACE_ID_PREFIX}${crypto.randomUUID()}`,
        nodeId,
        name: nextInterfaceName(document, node),
        mtu: DEFAULT_INTERFACE_MTU,
        state: DEFAULT_INTERFACE_STATE,
      };
      return {
        document: { ...document, interfaces: [...document.interfaces, item] },
      };
    }),
  setNodePosition: (nodeId, position) =>
    set(({ document }) => ({
      document: {
        ...document,
        layout: { ...document.layout, [nodeId]: position },
      },
    })),
  removeInterface: (interfaceId) =>
    set(({ document }) => ({
      document: {
        ...document,
        nodes: document.nodes.map((n) => withoutRef(n, interfaceId)),
        interfaces: document.interfaces.filter((i) => i.id !== interfaceId),
        links: document.links.filter(
          (l) => l.endpointA !== interfaceId && l.endpointB !== interfaceId,
        ),
      },
    })),
}));
