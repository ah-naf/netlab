import {
  APP_MIN_WIDTH,
  CENTER_MIN_WIDTH,
  DRAWER_HEADER_HEIGHT,
  RAIL_SIZE,
  REGION,
  SIZE_RANGE,
} from "../constants/layout";
import { useLayoutStore } from "../store/layoutStore";
import BottomDrawer from "./BottomDrawer";
import ResizeHandle from "./ResizeHandle";
import SidePanel from "./SidePanel";
import Toolbar from "./Toolbar";

/** Tracks alternate panel and rail; rails hold the drag handles. */
export default function AppShell() {
  const {
    leftWidth,
    rightWidth,
    drawerHeight,
    drawerCollapsed,
    setLeftWidth,
    setRightWidth,
    setDrawerHeight,
  } = useLayoutStore();
  const rail = `${RAIL_SIZE}px`;
  const rowHeight = drawerCollapsed ? DRAWER_HEADER_HEIGHT : drawerHeight;
  // Window width minus the frame (padding and two rails) and the center's minimum.
  const columnSpace =
    Math.max(window.innerWidth, APP_MIN_WIDTH) -
    CENTER_MIN_WIDTH -
    4 * RAIL_SIZE;
  const leftMax = Math.min(SIZE_RANGE.leftWidth.max, columnSpace - rightWidth);
  const rightMax = Math.min(SIZE_RANGE.rightWidth.max, columnSpace - leftWidth);

  return (
    <div
      className="flex h-screen flex-col bg-chassis"
      style={{ minWidth: APP_MIN_WIDTH }}
    >
      <Toolbar />
      <div
        className="shell-grid grid min-h-0 flex-1"
        style={{
          padding: RAIL_SIZE,
          gridTemplateColumns: `${leftWidth}px ${rail} 1fr ${rail} ${rightWidth}px`,
          gridTemplateRows: `1fr ${rail} ${rowHeight}px`,
        }}
      >
        <SidePanel
          as="aside"
          {...REGION.COMPONENTS}
          className="col-start-1 row-start-1"
        />
        <ResizeHandle
          axis="x"
          label="Resize components column"
          value={leftWidth}
          min={SIZE_RANGE.leftWidth.min}
          max={leftMax}
          sign={1}
          onChange={setLeftWidth}
          className="col-start-2 row-start-1"
        />
        <SidePanel
          as="main"
          {...REGION.CANVAS}
          dotGrid
          className="col-start-3 row-start-1"
        />
        <ResizeHandle
          axis="x"
          label="Resize inspector column"
          value={rightWidth}
          min={SIZE_RANGE.rightWidth.min}
          max={rightMax}
          sign={-1}
          onChange={setRightWidth}
          className="col-start-4 row-start-1"
        />
        <SidePanel
          as="aside"
          {...REGION.INSPECTOR}
          className="col-start-5 row-start-1"
        />
        {!drawerCollapsed && (
          <ResizeHandle
            axis="y"
            label="Resize drawer"
            value={drawerHeight}
            min={SIZE_RANGE.drawerHeight.min}
            max={SIZE_RANGE.drawerHeight.max}
            sign={-1}
            onChange={setDrawerHeight}
            className="col-span-5 row-start-2"
          />
        )}
        <BottomDrawer className="col-span-5 row-start-3" />
      </div>
    </div>
  );
}
