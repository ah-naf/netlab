import {
  COLLAPSE_LABEL,
  DRAWER_HEADER_HEIGHT,
  DRAWER_LABEL,
  DRAWER_PANEL_ID,
  DRAWER_TAB_ID,
  DRAWER_TABS,
  EXPAND_LABEL,
  tabDomId,
} from "../constants/layout";
import { useLayoutStore } from "../store/layoutStore";
import DrawerTabs from "./DrawerTabs";
import IssuesPanel from "./IssuesPanel";
import NotAvailable from "./NotAvailable";

interface Props {
  className?: string;
}

export default function BottomDrawer({ className = "" }: Props) {
  const { activeTab, drawerCollapsed, toggleDrawer } = useLayoutStore();
  const tab = DRAWER_TABS.find(({ id }) => id === activeTab) ?? DRAWER_TABS[0];

  return (
    <section
      aria-label={DRAWER_LABEL}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div
        className={`flex shrink-0 items-center ${drawerCollapsed ? "" : "border-b border-rule"}`}
        style={{ height: DRAWER_HEADER_HEIGHT - 2 }}
      >
        <DrawerTabs />
        <button
          type="button"
          aria-expanded={!drawerCollapsed}
          aria-label={drawerCollapsed ? EXPAND_LABEL : COLLAPSE_LABEL}
          title={drawerCollapsed ? EXPAND_LABEL : COLLAPSE_LABEL}
          onClick={toggleDrawer}
          className="flex h-full w-9 shrink-0 items-center justify-center border-l border-rule text-ink-muted transition-colors duration-100 hover:text-signal"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={drawerCollapsed ? "rotate-180" : ""}
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </button>
      </div>
      {!drawerCollapsed && (
        <div
          id={DRAWER_PANEL_ID}
          role="tabpanel"
          aria-labelledby={tabDomId(tab.id)}
          className="min-h-0 flex-1 overflow-hidden"
        >
          {tab.id === DRAWER_TAB_ID.ISSUES ? (
            <IssuesPanel />
          ) : (
            <NotAvailable name={tab.label} hint={tab.hint} />
          )}
        </div>
      )}
    </section>
  );
}
