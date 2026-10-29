import type { ToolbarAction } from "../types/layout";

interface Props {
  action: ToolbarAction;
  onClick?: () => void;
}

const BASE =
  "h-7 rounded-[4px] border border-rule px-3 text-[13px] font-medium transition-colors duration-100";
const ENABLED = "text-ink hover:border-signal hover:text-signal";
const DISABLED = "cursor-not-allowed text-ink-muted opacity-70";

/** The span carries the hover text: disabled buttons do not always fire pointer events. */
export default function DisabledButton({ action, onClick }: Props) {
  const { enabled, label, disabledReason } = action;
  return (
    <span title={enabled ? undefined : disabledReason}>
      <button
        type="button"
        disabled={!enabled}
        onClick={onClick}
        className={`${BASE} ${enabled ? ENABLED : DISABLED}`}
      >
        {label}
      </button>
    </span>
  );
}
