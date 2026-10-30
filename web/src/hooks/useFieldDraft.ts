import { useEffect, useState } from "react";
import { useFieldErrorStore } from "../store/fieldErrorStore";
import type { FieldRule } from "../types/inspector";

interface Options {
  fieldKey: string;
  value: string;
  rule: FieldRule;
  onCommit: (value: string) => void;
}

/** Holds the typed text; only a valid, confirmed draft reaches the lab. */
export function useFieldDraft({ fieldKey, value, rule, onCommit }: Options) {
  const [draft, setDraft] = useState(value);
  const [shownValue, setShownValue] = useState(value);
  if (shownValue !== value) {
    setShownValue(value);
    setDraft(value);
  }
  const error = rule(draft);
  const setError = useFieldErrorStore((s) => s.setError);

  useEffect(() => {
    setError(fieldKey, error !== null);
  }, [fieldKey, error, setError]);
  useEffect(() => () => setError(fieldKey, false), [fieldKey, setError]);

  const confirm = () => {
    if (error === null && draft !== value) onCommit(draft);
  };
  const cancel = () => setDraft(value);
  return { draft, error, setDraft, confirm, cancel };
}
