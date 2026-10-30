import { create } from "zustand";
import { CURRENT_VERSION } from "../types/topologyDocument";
import type { Document, Interface } from "../types/topology";

interface TopologyState {
  document: Document;
  selectedNodeId: string | null;
  loadDocument: (document: Document) => void;
  selectNode: (nodeId: string | null) => void;
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

export const useTopologyStore = create<TopologyState>()((set) => ({
  document: EMPTY_DOCUMENT,
  selectedNodeId: null,
  loadDocument: (document) => set({ document, selectedNodeId: null }),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
}));
