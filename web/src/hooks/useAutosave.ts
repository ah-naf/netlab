import { useEffect } from "react";
import { DRAFT_DELAY_MS, DRAFT_STORAGE_KEY } from "../constants/labFile";
import { useFileStore } from "../store/fileStore";
import { serializeLab } from "../store/labFile";
import { safeStorage } from "../store/safeStorage";
import { useTopologyStore } from "../store/topologyStore";

/** Keeps a draft while the lab has unsaved changes; waits until a stored draft is answered. */
export function useAutosave() {
  const document = useTopologyStore((s) => s.document);
  const baseline = useFileStore((s) => s.baseline);
  const draftReady = useFileStore((s) => s.draftReady);

  useEffect(() => {
    if (!draftReady || document === baseline) return;
    const timer = setTimeout(
      () => safeStorage.setItem(DRAFT_STORAGE_KEY, serializeLab(document)),
      DRAFT_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [document, baseline, draftReady]);
}
