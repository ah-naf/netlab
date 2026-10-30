interface Props {
  text: string;
  label?: string;
  onClick: () => void;
  danger?: boolean;
}

const BASE = "cursor-pointer text-xs";
const PLAIN = "text-ink-muted hover:text-signal";
const DANGER =
  "border border-led-fault px-2 py-0.5 text-led-fault hover:bg-led-fault/10";

/** The word names what goes away; the border marks the heavier removals. */
export default function RemoveAction({ text, label, onClick, danger }: Props) {
  return (
    <button
      type="button"
      aria-label={label ?? text}
      onClick={onClick}
      className={`${BASE} ${danger ? DANGER : PLAIN}`}
    >
      {text}
    </button>
  );
}
