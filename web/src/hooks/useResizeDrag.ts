import type { PointerEvent as ReactPointerEvent } from "react";
import { RESIZING_ATTRIBUTE } from "../constants/layout";

interface Options {
  axis: "x" | "y";
  value: number;
  /** 1 when moving right/down grows the panel, -1 when it shrinks it. */
  sign: 1 | -1;
  onChange: (value: number) => void;
}

/** Sizes come from the start value plus total movement, so a clamped drag never drifts from the pointer. */
export function useResizeDrag({ axis, value, sign, onChange }: Options) {
  const position = (e: { clientX: number; clientY: number }) =>
    axis === "x" ? e.clientX : e.clientY;

  return (event: ReactPointerEvent<HTMLElement>) => {
    const handle = event.currentTarget;
    const start = position(event);
    handle.setPointerCapture(event.pointerId);
    document.body.dataset[RESIZING_ATTRIBUTE] = "true";

    const move = (e: PointerEvent) =>
      onChange(value + sign * (position(e) - start));
    const stop = () => {
      delete document.body.dataset[RESIZING_ATTRIBUTE];
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  };
}
