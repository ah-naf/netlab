import {
  APP_MIN_WIDTH,
  CANVAS_MIN_HEIGHT,
  CENTER_MIN_WIDTH,
  DRAWER_HEADER_HEIGHT,
  RAIL_SIZE,
  SIZE_RANGE,
  TOOLBAR_HEIGHT,
} from "../constants/layout";
import { fitColumns } from "../store/fitColumns";
import { useLayoutStore } from "../store/layoutStore";
import { useWindowSize } from "./useWindowSize";

/** Stored sizes limited to what the window can show; the center and canvas keep their minimums. */
export function useShellSizes() {
  const { width, height } = useWindowSize();
  const { leftWidth, rightWidth, drawerHeight, drawerCollapsed } =
    useLayoutStore();

  // Frame: padding on both sides plus two rails.
  const columnSpace =
    Math.max(width, APP_MIN_WIDTH) - CENTER_MIN_WIDTH - 4 * RAIL_SIZE;
  const columns = fitColumns(leftWidth, rightWidth, columnSpace);
  const leftMax = Math.min(
    SIZE_RANGE.leftWidth.max,
    columnSpace - columns.right,
  );
  const rightMax = Math.min(
    SIZE_RANGE.rightWidth.max,
    columnSpace - columns.left,
  );

  // Frame: padding top and bottom plus one rail.
  const spare = height - TOOLBAR_HEIGHT - 3 * RAIL_SIZE - CANVAS_MIN_HEIGHT;
  const { min, max } = SIZE_RANGE.drawerHeight;
  const drawerMax = Math.max(min, Math.min(max, spare));
  const drawer = Math.min(drawerHeight, drawerMax);

  return {
    leftWidth: columns.left,
    rightWidth: columns.right,
    leftMax,
    rightMax,
    drawerHeight: drawer,
    drawerMax,
    rowHeight: drawerCollapsed ? DRAWER_HEADER_HEIGHT : drawer,
  };
}
