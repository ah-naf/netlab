import { useMemo } from "react";
import { DRAWER_TAB_ID } from "../constants/layout";
import { useLayoutStore } from "../store/layoutStore";
import { validate } from "../store/validation/validate";
import { useTopologyStore } from "../store/topologyStore";
import { useValidationStore } from "../store/validationStore";
import type { Issue } from "../types/validation";

const NO_ISSUES: Issue[] = [];

/** The list counts as shown only while its tab is the active, expanded drawer tab. */
function useIssuesShown(): boolean {
  const open = useValidationStore((s) => s.open);
  const onIssuesTab = useLayoutStore(
    (s) => s.activeTab === DRAWER_TAB_ID.ISSUES,
  );
  const expanded = useLayoutStore((s) => !s.drawerCollapsed);
  return open && onIssuesTab && expanded;
}

/** Live while the list is shown; nothing is computed otherwise, so highlights never outlive it. */
export function useIssues(): Issue[] {
  const shown = useIssuesShown();
  const document = useTopologyStore((s) => s.document);
  return useMemo(
    () => (shown ? validate(document) : NO_ISSUES),
    [shown, document],
  );
}
