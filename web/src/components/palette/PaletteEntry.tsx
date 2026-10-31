import { memo } from "react";
import { PALETTE_DRAG_TYPE } from "../../constants/palette";
import type { PaletteEntry as Entry } from "../../types/palette";
import NodeIcon from "../icons/NodeIcon";

const ICON_SIZE = 28;
const ROW =
  "group flex cursor-grab items-start gap-3 border-b border-rule px-3 py-2 active:cursor-grabbing";
const TILE =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-rule text-ink transition-colors duration-100 group-hover:border-signal group-hover:text-signal";

function PaletteEntry({ entry }: { entry: Entry }) {
  const startDrag = (event: React.DragEvent) => {
    event.dataTransfer.setData(PALETTE_DRAG_TYPE, entry.id);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <li
      draggable
      onDragStart={startDrag}
      tabIndex={0}
      aria-label={`${entry.label}: ${entry.description}`}
      className={ROW}
    >
      <span className={TILE}>
        <NodeIcon kind={entry.id} size={ICON_SIZE} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-signal">
          <span className="truncate">{entry.label}</span>
        </span>
        <span className="line-clamp-2 text-xs text-ink-muted">
          {entry.description}
        </span>
      </span>
    </li>
  );
}

export default memo(PaletteEntry);
