import type { ReactNode } from "react";
import { STATUS_STYLE } from "../../constants/topology";
import type { NodeStatus } from "../../types/flow";

interface Props {
  title: string;
  icon?: ReactNode;
  status: NodeStatus;
  selected?: boolean;
  children: ReactNode;
}

/** Rows span the full card width so each row's handle sits on the card edge. */
export default function NodeCard({
  title,
  icon,
  status,
  selected = false,
  children,
}: Props) {
  return (
    <div
      className={`min-w-44 border-2 bg-panel text-ink ${STATUS_STYLE[status].borderClass} ${selected ? "ring-2 ring-signal" : ""}`}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold">
        {icon && <span className="text-signal">{icon}</span>}
        <span className="min-w-0 flex-1 truncate" title={title}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
