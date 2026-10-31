import { useId } from "react";
import { DEFAULT_PROJECT_NAME } from "../constants/layout";
import { KEY } from "../constants/palette";
import { useFieldDraft } from "../hooks/useFieldDraft";
import { validateLabName } from "../store/fieldRules";
import { renameLab } from "../store/namespaceOps";
import { useTopologyStore } from "../store/topologyStore";

const FIELD_KEY = "project-name";

/** The project name is the lab name; the input reads like text until hovered or focused. */
export default function ProjectNameField() {
  const name = useTopologyStore((s) => s.document.lab.name);
  const edit = useTopologyStore((s) => s.edit);
  const { draft, error, setDraft, confirm, cancel } = useFieldDraft({
    fieldKey: FIELD_KEY,
    value: name,
    rule: validateLabName,
    onCommit: (value) => edit((d) => renameLab(d, value)),
  });
  const errorId = useId();
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === KEY.ENTER) {
      confirm();
      event.currentTarget.blur();
    }
    if (event.key === KEY.ESCAPE) {
      cancel();
      event.currentTarget.blur();
    }
  };

  return (
    <div className="relative">
      <input
        value={draft}
        placeholder={DEFAULT_PROJECT_NAME}
        aria-label={DEFAULT_PROJECT_NAME}
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={confirm}
        className="w-44 border border-transparent bg-transparent px-1 text-[15px] text-ink-muted placeholder:text-ink-muted hover:border-rule focus:border-signal focus:text-ink aria-invalid:border-led-fault"
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          className="absolute top-full left-0 z-20 mt-1 whitespace-nowrap border border-led-fault bg-panel px-2 py-0.5 text-xs text-led-fault"
        >
          {error}
        </span>
      )}
    </div>
  );
}
