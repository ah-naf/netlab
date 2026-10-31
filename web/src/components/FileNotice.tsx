import { DISMISS_LABEL } from "../constants/labFile";
import { useFileStore } from "../store/fileStore";

const BORDER = { error: "border-led-fault", info: "border-rule" } as const;

/** Stays until dismissed or replaced by the next load. */
export default function FileNotice() {
  const notice = useFileStore((s) => s.notice);
  const setNotice = useFileStore((s) => s.setNotice);
  if (!notice) return null;

  return (
    <div
      role={notice.kind === "error" ? "alert" : "status"}
      className={`absolute top-2 left-1/2 z-10 flex max-w-[90%] -translate-x-1/2 items-center gap-3 border bg-panel px-3 py-1 text-xs text-ink ${BORDER[notice.kind]}`}
    >
      <span>{notice.text}</span>
      <button
        type="button"
        onClick={() => setNotice(null)}
        className="shrink-0 text-ink-muted hover:text-signal"
      >
        {DISMISS_LABEL}
      </button>
    </div>
  );
}
