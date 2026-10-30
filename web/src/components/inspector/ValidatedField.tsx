import { useId } from "react";
import { useFieldDraft } from "../../hooks/useFieldDraft";
import type { FieldRule } from "../../types/inspector";

interface Props {
  fieldKey: string;
  label: string;
  value: string;
  rule: FieldRule;
  onCommit: (value: string) => void;
  placeholder?: string;
}

const KEY = { ENTER: "Enter", ESCAPE: "Escape" };

export default function ValidatedField({
  fieldKey,
  label,
  value,
  rule,
  onCommit,
  placeholder,
}: Props) {
  const { draft, error, setDraft, confirm, cancel } = useFieldDraft({
    fieldKey,
    value,
    rule,
    onCommit,
  });
  const errorId = useId();
  const onKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === KEY.ENTER) confirm();
    if (event.key === KEY.ESCAPE) cancel();
  };

  return (
    <label className="block text-xs text-ink-muted">
      {label}
      <input
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={confirm}
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
        className="mt-0.5 block w-full border border-rule bg-panel px-1 text-sm text-ink aria-invalid:border-led-fault"
      />
      {error && (
        <span id={errorId} role="alert" className="mt-0.5 block text-led-fault">
          {error}
        </span>
      )}
    </label>
  );
}
