import { APP_MIN_WIDTH, RAIL_SIZE, REGION } from "../constants/layout";
import { useLayoutStore } from "../store/layoutStore";
import BottomDrawer from "./BottomDrawer";
import SidePanel from "./SidePanel";
import Toolbar from "./Toolbar";

/** Tracks alternate panel and rail; rails hold the drag handles. */
export default function AppShell() {
  const { leftWidth, rightWidth, drawerHeight } = useLayoutStore();
  const rail = `${RAIL_SIZE}px`;

  return (
    <div
      className="flex h-screen flex-col bg-chassis"
      style={{ minWidth: APP_MIN_WIDTH }}
    >
      <Toolbar />
      <div
        className="grid min-h-0 flex-1 p-1.5"
        style={{
          gridTemplateColumns: `${leftWidth}px ${rail} 1fr ${rail} ${rightWidth}px`,
          gridTemplateRows: `1fr ${rail} ${drawerHeight}px`,
        }}
      >
        <SidePanel
          as="aside"
          {...REGION.COMPONENTS}
          className="col-start-1 row-start-1"
        />
        <SidePanel
          as="main"
          {...REGION.CANVAS}
          dotGrid
          className="col-start-3 row-start-1"
        />
        <SidePanel
          as="aside"
          {...REGION.INSPECTOR}
          className="col-start-5 row-start-1"
        />
        <BottomDrawer className="col-span-5 row-start-3" />
      </div>
    </div>
  );
}
