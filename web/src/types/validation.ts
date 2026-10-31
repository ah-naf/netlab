import type { ISSUE_CODE } from "../constants/validation.ts";

export type Severity = "error" | "warning";
export type IssueCode = keyof typeof ISSUE_CODE;

export interface Issue {
  severity: Severity;
  code: IssueCode;
  resourceId: string;
  resourceName: string;
  message: string;
  relatedIds: string[];
}

export interface IssueTarget {
  nodeIds: string[];
  linkId: string | null;
}
