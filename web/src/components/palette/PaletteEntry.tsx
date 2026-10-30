import { memo } from "react";
import { NOT_AVAILABLE_TEXT } from "../../constants/layout";
import { PALETTE_DRAG_TYPE } from "../../constants/palette";
import type { PaletteEntry as Entry } from "../../types/palette";
import NodeIcon from "../icons/NodeIcon";

const ICON_SIZE = 28;
const ROW = "flex items-start gap-3 border-b border-rule px-3 py-2";
const ENABLED_ROW = `group cursor-grab active:cursor-grabbing ${ROW}`;
const DISABLED_ROW = `cursor-not-allowed opacity-70 ${ROW}`;
const TILE =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-rule transition-colors duration-100";

function PaletteEntry({ entry }: { entry: Entry }) {
  const { available } = entry;
  const startDrag = (event: React.DragEvent) => {
    event.dataTransfer.setData(PALETTE_DRAG_TYPE, entry.id);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <li
      draggable={available}
      onDragStart={startDrag}
      tabIndex={0}
      aria-label={`${entry.label}: ${entry.description}`}
      aria-disabled={!available}
      title={available ? undefined : NOT_AVAILABLE_TEXT}
      className={available ? ENABLED_ROW : DISABLED_ROW}
    >
      <span
        className={`${TILE} ${available ? "text-ink group-hover:border-signal group-hover:text-signal" : "text-ink-muted"}`}
      >
        <NodeIcon kind={entry.id} size={ICON_SIZE} />
      </span>
      <span className="min-w-0">
        <span
          className={`flex items-center gap-1.5 text-sm font-semibold ${available ? "text-ink group-hover:text-signal" : "text-ink-muted"}`}
        >
          {!available && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-led-off" />
          )}
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
