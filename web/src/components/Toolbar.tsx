import { Fragment, type ReactNode } from "react";
import {
  APP_NAME,
  FILE_ACTIONS,
  TOOLBAR_HEIGHT,
  LAB_ACTIONS,
  OPEN_ACTION_ID,
  SAVE_ACTION_ID,
  VALIDATE_ACTION_ID,
} from "../constants/layout";
import { openFromPicker, saveLab } from "../store/labActions";
import { showIssues } from "../store/showIssues";
import type { ToolbarAction } from "../types/layout";
import ConnectionIndicator from "./ConnectionIndicator";
import ExampleMenu from "./ExampleMenu";
import ProjectNameField from "./ProjectNameField";
import ThemeToggle from "./ThemeToggle";
import DisabledButton from "./DisabledButton";

function Divider() {
  return <span className="h-5 w-px bg-rule" />;
}

const ACTION_HANDLERS: Record<string, () => void> = {
  [SAVE_ACTION_ID]: saveLab,
  [OPEN_ACTION_ID]: openFromPicker,
  [VALIDATE_ACTION_ID]: showIssues,
};

interface GroupProps {
  actions: readonly ToolbarAction[];
  /** Extra controls shown right after the action with the given id. */
  after?: Record<string, ReactNode>;
}

function ActionGroup({ actions, after = {} }: GroupProps) {
  return (
    <div className="flex items-center gap-1.5">
      {actions.map((action) => (
        <Fragment key={action.id}>
          <DisabledButton
            action={action}
            onClick={ACTION_HANDLERS[action.id]}
          />
          {after[action.id]}
        </Fragment>
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
      <ProjectNameField />
      <div className="ml-6 flex items-center gap-4">
        <ActionGroup
          actions={FILE_ACTIONS}
          after={{ [OPEN_ACTION_ID]: <ExampleMenu /> }}
        />
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
