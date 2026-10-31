import { useEffect, useRef } from "react";
import {
  DISCARD_LABEL,
  DRAFT_TITLE,
  RESTORE_LABEL,
  draftSummary,
} from "../constants/labFile";
import { useFileStore } from "../store/fileStore";
import { discardDraft, restoreDraft } from "../store/labActions";

const TITLE_ID = "draft-prompt-title";
const BUTTON =
  "h-8 rounded-[4px] border px-4 text-sm font-medium transition-colors duration-100";

/** Blocks the app until the user answers; Tab wraps between the two buttons. */
export default function DraftPrompt() {
  const draft = useFileStore((s) => s.pendingDraft);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const discardRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (draft) restoreRef.current?.focus();
  }, [draft]);
  if (!draft) return null;

  const wrapTab = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const [first, last] = [restoreRef.current, discardRef.current];
    const edge = event.shiftKey ? first : last;
    if (document.activeElement !== edge) return;
    event.preventDefault();
    (event.shiftKey ? last : first)?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        onKeyDown={wrapTab}
        className="w-96 border border-rule bg-panel p-5 text-ink shadow-xl"
      >
        <h2 id={TITLE_ID} className="text-base font-semibold">
          {DRAFT_TITLE}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          {draftSummary(draft.lab.name, draft.nodes.length)}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={discardRef}
            type="button"
            onClick={discardDraft}
            className={`${BUTTON} border-rule text-ink hover:border-signal hover:text-signal`}
          >
            {DISCARD_LABEL}
          </button>
          <button
            ref={restoreRef}
            type="button"
            onClick={restoreDraft}
            className={`${BUTTON} border-signal bg-signal text-chassis`}
          >
            {RESTORE_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
