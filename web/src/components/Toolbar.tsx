import {
  APP_NAME,
  DEFAULT_PROJECT_NAME,
  FILE_ACTIONS,
  TOOLBAR_HEIGHT,
  LAB_ACTIONS,
} from "../constants/layout";
import type { ToolbarAction } from "../types/layout";
import ConnectionIndicator from "./ConnectionIndicator";
import ThemeToggle from "./ThemeToggle";
import DisabledButton from "./DisabledButton";

function Divider() {
  return <span className="h-5 w-px bg-rule" />;
}

function ActionGroup({ actions }: { actions: readonly ToolbarAction[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {actions.map((action) => (
        <DisabledButton key={action.id} action={action} />
      ))}
    </div>
  );
}

export default function Toolbar() {
  return (
    <header
      style={{ height: TOOLBAR_HEIGHT }}
      className="flex shrink-0 items-center gap-4 border-b border-rule bg-panel px-4"
    >
      <span className="text-lg font-semibold tracking-[-0.01em]">
        {APP_NAME}
      </span>
      <Divider />
      <span className="text-[15px] text-ink-muted">{DEFAULT_PROJECT_NAME}</span>
      <div className="ml-6 flex items-center gap-4">
        <ActionGroup actions={FILE_ACTIONS} />
        <Divider />
        <ActionGroup actions={LAB_ACTIONS} />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <ThemeToggle />
        <ConnectionIndicator />
      </div>
    </header>
  );
}
