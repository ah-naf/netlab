import { PALETTE_ENTRIES } from "../../constants/palette";
import { REGION } from "../../constants/layout";
import PaletteEntry from "./PaletteEntry";

export default function Palette({ className = "" }: { className?: string }) {
  return (
    <aside
      aria-label={REGION.COMPONENTS.label}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {REGION.COMPONENTS.label}
      </div>
      <ul className="min-h-0 flex-1 overflow-auto">
        {PALETTE_ENTRIES.map((entry) => (
          <PaletteEntry key={entry.id} entry={entry} />
        ))}
      </ul>
    </aside>
  );
}
