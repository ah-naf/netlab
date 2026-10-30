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
      const store = useTopologyStore.getState();
      if (event.key === KEY.DELETE) store.deleteSelected();
      const withModifier = event.ctrlKey || event.metaKey;
      if (!withModifier) return;
      const key = event.key.toLowerCase();
      if (key === KEY.DUPLICATE) store.duplicateSelected();
      else if (key === KEY.UNDO && event.shiftKey) store.redo();
      else if (key === KEY.UNDO) store.undo();
      else if (key === KEY.REDO) store.redo();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
