import type { KeyboardEvent } from "react";
import { RESIZE_KEYS, RESIZE_STEP } from "../constants/layout";
import { useResizeDrag } from "../hooks/useResizeDrag";
import { clamp } from "../store/clamp";

interface Props {
  axis: "x" | "y";
  label: string;
  value: number;
  min: number;
  max: number;
  sign: 1 | -1;
  onChange: (value: number) => void;
  className?: string;
}

const AXIS_STYLE = {
  x: { cursor: "cursor-col-resize", grip: "flex-col", orientation: "vertical" },
  y: {
    cursor: "cursor-row-resize",
    grip: "flex-row",
    orientation: "horizontal",
  },
} as const;

export default function ResizeHandle({
  axis,
  label,
  value,
  min,
  max,
  sign,
  onChange,
  className = "",
}: Props) {
  const style = AXIS_STYLE[axis];
  const apply = (next: number) =>
    onChange(clamp(next, { min, max, fallback: value }));
  const onPointerDown = useResizeDrag({ axis, value, sign, onChange: apply });

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = RESIZE_KEYS[axis];
    const direction = keys[event.key];
    if (!direction) return;
    event.preventDefault();
    apply(value + sign * direction * RESIZE_STEP);
  };

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={style.orientation}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={`group flex touch-none items-center justify-center transition-colors duration-100 hover:bg-signal/15 focus-visible:bg-signal/15 ${style.cursor} ${className}`}
    >
      <span className={`flex gap-0.5 ${style.grip}`}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-0.5 w-0.5 rounded-full bg-rule transition-colors duration-100 group-hover:bg-signal group-focus-visible:bg-signal"
          />
        ))}
      </span>
    </div>
  );
}
