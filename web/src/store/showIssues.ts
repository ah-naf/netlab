import { DRAWER_TAB_ID } from "../constants/layout";
import { useLayoutStore } from "./layoutStore";
import { useValidationStore } from "./validationStore";

export function showIssues() {
  const layout = useLayoutStore.getState();
  useValidationStore.getState().setOpen(true);
  if (layout.drawerCollapsed) layout.toggleDrawer();
  layout.setActiveTab(DRAWER_TAB_ID.ISSUES);
}
