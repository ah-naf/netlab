import {
  OBSERVED_HELP,
  OBSERVED_LABEL,
  OBSERVED_TEXT,
} from "../../constants/inspector";

/** Dashed like a desired-state node: this value is not part of the lab. */
export default function ObservedLine() {
  return (
    <p
      title={OBSERVED_HELP}
      className="border-t border-dashed border-rule pt-1.5 text-xs text-ink-muted"
    >
      {OBSERVED_LABEL}: {OBSERVED_TEXT}
    </p>
  );
}
