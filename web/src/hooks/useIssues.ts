import { useMemo } from "react";
import { validate } from "../store/validation/validate";
import { useTopologyStore } from "../store/topologyStore";
import { useValidationStore } from "../store/validationStore";
import type { Issue } from "../types/validation";

const NO_ISSUES: Issue[] = [];

/** Live while the issue list is open; nothing is computed when it is closed. */
export function useIssues(): Issue[] {
  const open = useValidationStore((s) => s.open);
  const document = useTopologyStore((s) => s.document);
  return useMemo(
    () => (open ? validate(document) : NO_ISSUES),
    [open, document],
  );
}
