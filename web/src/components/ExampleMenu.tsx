import { useEffect, useRef, useState } from "react";
import { EXAMPLES } from "../constants/examples";
import { EXAMPLES_LABEL, NEEDS_M5_BADGE } from "../constants/labFile";
import { openExample } from "../store/labActions";
import type { LabExample } from "../types/labFile";

const KEY_ESCAPE = "Escape";

export default function ExampleMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== KEY_ESCAPE) return;
      if (
        event instanceof MouseEvent &&
        root.current?.contains(event.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const pick = (example: LabExample) => {
    setOpen(false);
    openExample(example);
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="h-7 rounded-[4px] border border-rule px-3 text-[13px] font-medium text-ink transition-colors duration-100 hover:border-signal hover:text-signal"
      >
        {EXAMPLES_LABEL} ▾
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute top-full left-0 z-20 mt-1 w-72 border border-rule bg-panel shadow-lg"
        >
          {EXAMPLES.map((example) => (
            <li key={example.id} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => pick(example)}
                className="block w-full px-3 py-2 text-left hover:bg-chassis"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                  {example.label}
                  {example.needsM5 && (
                    <span className="border border-led-warn px-1 text-[11px] font-normal text-led-warn">
                      {NEEDS_M5_BADGE}
                    </span>
                  )}
                </span>
                <span className="block text-xs text-ink-muted">
                  {example.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
