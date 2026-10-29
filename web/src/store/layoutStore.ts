import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_LAYOUT,
  DRAWER_TABS,
  LAYOUT_STORAGE_KEY,
  SIZE_RANGE,
} from "../constants/layout";
import type { DrawerTabId, LayoutState } from "../types/layout";
import { clamp } from "./clamp";
import { safeStorage } from "./safeStorage";

interface LayoutActions {
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
  setDrawerHeight: (height: number) => void;
  toggleDrawer: () => void;
  setActiveTab: (tab: DrawerTabId) => void;
}

const isTabId = (value: unknown): value is DrawerTabId =>
  DRAWER_TABS.some((tab) => tab.id === value);

/** Turns whatever was stored into a valid layout; bad values fall back to defaults. */
function sanitize(stored: unknown): LayoutState {
  const saved = { ...(stored as Partial<Record<keyof LayoutState, unknown>>) };
  return {
    leftWidth: clamp(saved.leftWidth, SIZE_RANGE.leftWidth),
    rightWidth: clamp(saved.rightWidth, SIZE_RANGE.rightWidth),
    drawerHeight: clamp(saved.drawerHeight, SIZE_RANGE.drawerHeight),
    drawerCollapsed:
      typeof saved.drawerCollapsed === "boolean"
        ? saved.drawerCollapsed
        : DEFAULT_LAYOUT.drawerCollapsed,
    activeTab: isTabId(saved.activeTab)
      ? saved.activeTab
      : DEFAULT_LAYOUT.activeTab,
  };
}

export const useLayoutStore = create<LayoutState & LayoutActions>()(
  persist(
    (set) => ({
      ...DEFAULT_LAYOUT,
      setLeftWidth: (width) =>
        set({ leftWidth: clamp(width, SIZE_RANGE.leftWidth) }),
      setRightWidth: (width) =>
        set({ rightWidth: clamp(width, SIZE_RANGE.rightWidth) }),
      setDrawerHeight: (height) =>
        set({ drawerHeight: clamp(height, SIZE_RANGE.drawerHeight) }),
      toggleDrawer: () =>
        set((state) => ({ drawerCollapsed: !state.drawerCollapsed })),
      setActiveTab: (tab) => {
        if (isTabId(tab)) set({ activeTab: tab });
      },
    }),
    {
      name: LAYOUT_STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      merge: (stored, current) => ({ ...current, ...sanitize(stored) }),
    },
  ),
);
