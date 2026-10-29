import { DRAWER_LABEL } from "../constants/layout";
import NotAvailable from "./NotAvailable";

interface Props {
  className?: string;
}

export default function BottomDrawer({ className = "" }: Props) {
  return (
    <section
      aria-label={DRAWER_LABEL}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-9 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {DRAWER_LABEL}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <NotAvailable name={DRAWER_LABEL} />
      </div>
    </section>
  );
}
