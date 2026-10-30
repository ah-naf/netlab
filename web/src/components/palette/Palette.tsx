import { useState } from "react";
import { REGION } from "../../constants/layout";
import {
  NO_MATCH_TEXT,
  PALETTE_ENTRIES,
  SEARCH_LABEL,
} from "../../constants/palette";
import { filterEntries } from "./filterEntries";
import PaletteEntry from "./PaletteEntry";

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export default function Palette({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const entries = filterEntries(PALETTE_ENTRIES, query);

  return (
    <aside
      aria-label={REGION.COMPONENTS.label}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {REGION.COMPONENTS.label}
      </div>
      <div className="relative shrink-0 border-b border-rule p-2">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Escape" && setQuery("")}
          aria-label={SEARCH_LABEL}
          placeholder={SEARCH_LABEL}
          className="h-7 w-full rounded-[4px] border border-rule bg-panel pl-7 pr-2 text-[13px] text-ink placeholder:text-ink-muted"
        />
      </div>
      {entries.length ? (
        <ul className="min-h-0 flex-1 overflow-auto">
          {entries.map((entry) => (
            <PaletteEntry key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="p-3 text-xs text-ink-muted">{NO_MATCH_TEXT}</p>
      )}
    </aside>
  );
}
