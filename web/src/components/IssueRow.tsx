import {
  SEVERITY_GLYPH,
  SEVERITY_LABEL,
  SEVERITY_TEXT,
} from "../constants/validation";
import type { Issue } from "../types/validation";

interface Props {
  issue: Issue;
  onSelect: (issue: Issue) => void;
}

export default function IssueRow({ issue, onSelect }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(issue)}
        className="flex w-full items-baseline gap-3 border-b border-rule px-3 py-1.5 text-left text-[13px] transition-colors duration-100 hover:bg-chassis"
      >
        <span
          className={`w-20 shrink-0 font-semibold ${SEVERITY_TEXT[issue.severity]}`}
        >
          {SEVERITY_GLYPH[issue.severity]} {SEVERITY_LABEL[issue.severity]}
        </span>
        <span className="w-56 shrink-0 font-mono text-xs text-ink-muted">
          {issue.code}
        </span>
        <span className="w-40 shrink-0 truncate font-semibold text-ink">
          {issue.resourceName}
        </span>
        <span className="min-w-0 flex-1 truncate text-ink">
          {issue.message}
        </span>
      </button>
    </li>
  );
}
