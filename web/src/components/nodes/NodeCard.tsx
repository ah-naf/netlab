import type { ReactNode } from "react";
import { STATUS_STYLE } from "../../constants/topology";
import {
  SELECTED_RING,
  SELECTED_WITH_ISSUE_OUTLINE,
  SEVERITY_GLYPH,
  SEVERITY_LABEL,
  SEVERITY_RING,
  SEVERITY_TEXT,
} from "../../constants/validation";
import type { Severity } from "../../types/validation";
import type { NodeStatus } from "../../types/flow";
import NodeTitle from "./NodeTitle";

interface Props {
  nodeId: string;
  title: string;
  icon?: ReactNode;
  status: NodeStatus;
  selected?: boolean;
  issue?: Severity;
  children: ReactNode;
}

/** Rows span the full card width so each row's handle sits on the card edge. */
export default function NodeCard({
  nodeId,
  title,
  icon,
  status,
  selected = false,
  issue,
  children,
}: Props) {
  const emphasis = issue
    ? `${SEVERITY_RING[issue]} ${selected ? SELECTED_WITH_ISSUE_OUTLINE : ""}`
    : selected
      ? SELECTED_RING
      : "";
  return (
    <div
      className={`min-w-44 border-2 bg-panel text-ink ${STATUS_STYLE[status].borderClass} ${emphasis}`}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold">
        {icon && <span className="text-signal">{icon}</span>}
        <NodeTitle nodeId={nodeId} name={title} />
        {issue && (
          <span
            className={`shrink-0 text-xs ${SEVERITY_TEXT[issue]}`}
            title={SEVERITY_LABEL[issue]}
          >
            {SEVERITY_GLYPH[issue]}
          </span>
        )}
        <span
          className="shrink-0 text-xs font-normal text-ink-muted"
          title={STATUS_STYLE[status].label}
        >
          {STATUS_STYLE[status].glyph} {STATUS_STYLE[status].label}
        </span>
      </div>
      {children}
    </div>
  );
}
