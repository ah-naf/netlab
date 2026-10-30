import { useEffect } from "react";
import { KEY } from "../constants/palette";
import { useTopologyStore } from "../store/topologyStore";

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Shortcuts must not act on the lab while the user types in a field. */
export function isEditableTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  return (
    !!element &&
    (EDITABLE_TAGS.has(element.tagName) || element.isContentEditable)
  );
}

export function useCanvasShortcuts() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.key === KEY.DELETE)
        useTopologyStore.getState().deleteSelected();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
