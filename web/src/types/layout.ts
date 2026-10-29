import type { DRAWER_TAB_ID } from "../constants/layout";

export type DrawerTabId = (typeof DRAWER_TAB_ID)[keyof typeof DRAWER_TAB_ID];

export interface DrawerTab {
  id: DrawerTabId;
  label: string;
  hint: string;
}

export interface LayoutState {
  leftWidth: number;
  rightWidth: number;
  drawerHeight: number;
  drawerCollapsed: boolean;
  activeTab: DrawerTabId;
}

export interface SizeRange {
  min: number;
  max: number;
  fallback: number;
}

export interface ToolbarAction {
  id: string;
  label: string;
  enabled: boolean;
  disabledReason: string;
}
