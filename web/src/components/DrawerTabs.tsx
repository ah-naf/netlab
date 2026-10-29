import type { KeyboardEvent } from "react";
import { DRAWER_PANEL_ID, DRAWER_TABS, tabDomId } from "../constants/layout";
import { useLayoutStore } from "../store/layoutStore";

const TAB_KEYS = { ArrowRight: 1, ArrowLeft: -1 } as const;

const PORT =
  "flex h-full shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-rule px-2 text-[13px] transition-[box-shadow,color] duration-[120ms]";
const IDLE = "text-ink-muted hover:text-ink";
const SEATED =
  "bg-chassis text-ink shadow-[inset_0_2px_3px_rgb(0_0_0/0.18),inset_0_-2px_0_var(--signal)]";

/** Patch panel: each tab is a port whose LED stays dark until its feature exists. */
export default function DrawerTabs() {
  const { activeTab, setActiveTab } = useLayoutStore();

  const onKeyDown = (event: KeyboardEvent) => {
    const step = TAB_KEYS[event.key as keyof typeof TAB_KEYS];
    if (!step) return;
    event.preventDefault();
    const current = DRAWER_TABS.findIndex((tab) => tab.id === activeTab);
    const next =
      DRAWER_TABS[(current + step + DRAWER_TABS.length) % DRAWER_TABS.length];
    setActiveTab(next.id);
    document.getElementById(tabDomId(next.id))?.focus();
  };

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className="flex h-full min-w-0 flex-1 overflow-x-auto"
    >
      {DRAWER_TABS.map(({ id, label }) => {
        const selected = id === activeTab;
        return (
          <button
            key={id}
            id={tabDomId(id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={DRAWER_PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => setActiveTab(id)}
            className={`${PORT} ${selected ? SEATED : IDLE}`}
          >
            <span className="h-2 w-2 rounded-full bg-led-off ring-1 ring-inset ring-black/20" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
