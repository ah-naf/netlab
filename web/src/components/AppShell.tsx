import {
  APP_MIN_WIDTH,
  CANVAS_MIN_HEIGHT,
  RAIL_SIZE,
  RESIZE_LABEL,
  SIZE_RANGE,
} from "../constants/layout";
import { useShellSizes } from "../hooks/useShellSizes";
import { useLayoutStore } from "../store/layoutStore";
import BottomDrawer from "./BottomDrawer";
import Canvas from "./Canvas";
import NodeInspector from "./NodeInspector";
import Palette from "./palette/Palette";
import ResizeHandle from "./ResizeHandle";
import Toolbar from "./Toolbar";

/** Tracks alternate panel and rail; rails hold the drag handles. */
export default function AppShell() {
  const { drawerCollapsed, setLeftWidth, setRightWidth, setDrawerHeight } =
    useLayoutStore();
  const sizes = useShellSizes();
  const rail = `${RAIL_SIZE}px`;

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
          gridTemplateColumns: `${sizes.leftWidth}px ${rail} 1fr ${rail} ${sizes.rightWidth}px`,
          gridTemplateRows: `minmax(${CANVAS_MIN_HEIGHT}px, 1fr) ${rail} ${sizes.rowHeight}px`,
        }}
      >
        <Palette className="col-start-1 row-start-1" />
        <ResizeHandle
          axis="x"
          label={RESIZE_LABEL.LEFT}
          value={sizes.leftWidth}
          min={SIZE_RANGE.leftWidth.min}
          max={sizes.leftMax}
          sign={1}
          onChange={setLeftWidth}
          className="col-start-2 row-start-1"
        />
        <Canvas className="col-start-3 row-start-1" />
        <ResizeHandle
          axis="x"
          label={RESIZE_LABEL.RIGHT}
          value={sizes.rightWidth}
          min={SIZE_RANGE.rightWidth.min}
          max={sizes.rightMax}
          sign={-1}
          onChange={setRightWidth}
          className="col-start-4 row-start-1"
        />
        <NodeInspector className="col-start-5 row-start-1" />
        {!drawerCollapsed && (
          <ResizeHandle
            axis="y"
            label={RESIZE_LABEL.DRAWER}
            value={sizes.drawerHeight}
            min={SIZE_RANGE.drawerHeight.min}
            max={sizes.drawerMax}
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
