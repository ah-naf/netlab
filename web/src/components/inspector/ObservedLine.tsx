import { OBSERVED_LABEL, OBSERVED_TEXT } from "../../constants/inspector";

/** Reserved for deployed state; read-only until then. */
export default function ObservedLine() {
  return (
    <p className="text-xs text-ink-muted">
      {OBSERVED_LABEL}: <span>{OBSERVED_TEXT}</span>
    </p>
  );
}
