import { create } from "zustand";
import type { Notice } from "../types/labFile";
import type { Document } from "../types/topology";
import { useTopologyStore } from "./topologyStore";

interface FileState {
  baseline: Document;
  notice: Notice | null;
  pendingDraft: Document | null;
  draftReady: boolean;
  setBaseline: (document: Document) => void;
  setNotice: (notice: Notice | null) => void;
  setPendingDraft: (document: Document | null) => void;
  setDraftReady: (ready: boolean) => void;
}

export const useFileStore = create<FileState>()((set) => ({
  baseline: useTopologyStore.getState().document,
  notice: null,
  pendingDraft: null,
  draftReady: false,
  setBaseline: (baseline) => set({ baseline }),
  setNotice: (notice) => set({ notice }),
  setPendingDraft: (pendingDraft) => set({ pendingDraft }),
  setDraftReady: (draftReady) => set({ draftReady }),
}));

/** Changed since the last save, open, example load, or empty start. */
export const isDirty = (): boolean =>
  useTopologyStore.getState().document !== useFileStore.getState().baseline;
