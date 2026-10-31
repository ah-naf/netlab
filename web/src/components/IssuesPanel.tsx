import {
  ISSUES_CLOSE_LABEL,
  ISSUES_EMPTY_TEXT,
  SEVERITY,
  issuesCountText,
} from "../constants/validation";
import { useIssues } from "../hooks/useIssues";
import { issueTarget } from "../store/validation/issueTarget";
import { useTopologyStore } from "../store/topologyStore";
import { useValidationStore } from "../store/validationStore";
import type { Issue } from "../types/validation";
import IssueRow from "./IssueRow";

function selectTarget(issue: Issue) {
  const { document, setSelection, setLinkSelection } =
    useTopologyStore.getState();
  const { nodeIds, linkId } = issueTarget(document, issue);
  if (linkId) setLinkSelection(linkId);
  else if (nodeIds.length) setSelection([nodeIds[0]]);
}

export default function IssuesPanel() {
  const issues = useIssues();
  const open = useValidationStore((s) => s.open);
  const errors = issues.filter((i) => i.severity === SEVERITY.ERROR).length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-rule px-3 py-1 text-[13px]">
        <span className="font-semibold">
          {open ? issuesCountText(errors, issues.length - errors) : ""}
        </span>
        <button
          type="button"
          onClick={() => useValidationStore.getState().setOpen(false)}
          className="h-6 rounded-[4px] border border-rule px-2 text-xs text-ink-muted hover:border-signal hover:text-signal"
        >
          {ISSUES_CLOSE_LABEL}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {issues.length ? (
          <ul>
            {issues.map((issue, index) => (
              <IssueRow
                key={`${issue.code}-${issue.resourceId}-${index}`}
                issue={issue}
                onSelect={selectTarget}
              />
            ))}
          </ul>
        ) : (
          <p className="px-3 py-3 text-sm text-ink-muted">
            {open ? ISSUES_EMPTY_TEXT : ""}
          </p>
        )}
      </div>
    </div>
  );
}
