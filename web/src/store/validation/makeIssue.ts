import { ISSUE_MESSAGE, ISSUE_SEVERITY } from "../../constants/validation.ts";
import type { Issue, IssueCode } from "../../types/validation.ts";

export const makeIssue = (
  code: IssueCode,
  resourceId: string,
  resourceName: string,
  relatedIds: string[] = [],
): Issue => ({
  severity: ISSUE_SEVERITY[code],
  code,
  resourceId,
  resourceName,
  message: ISSUE_MESSAGE[code],
  relatedIds,
});
