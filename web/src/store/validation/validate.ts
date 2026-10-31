import { ISSUE_ORDER, SEVERITY } from "../../constants/validation.ts";
import type { Document } from "../../types/topology.ts";
import type { Issue } from "../../types/validation.ts";
import { addressRules } from "./addressRules.ts";
import { idRules } from "./idRules.ts";
import { linkRules } from "./linkRules.ts";
import { nameRules } from "./nameRules.ts";
import { nodeRules } from "./nodeRules.ts";

type Rule = (document: Document) => Issue[];

const RULES: Rule[] = [idRules, nameRules, linkRules, nodeRules, addressRules];

const severityRank = (issue: Issue) =>
  issue.severity === SEVERITY.ERROR ? 0 : 1;

const byOrder = (a: Issue, b: Issue) =>
  severityRank(a) - severityRank(b) ||
  ISSUE_ORDER.indexOf(a.code) - ISSUE_ORDER.indexOf(b.code) ||
  a.resourceId.localeCompare(b.resourceId);

/** One failing rule never hides the others. */
const runRule = (rule: Rule, document: Document): Issue[] => {
  try {
    return rule(document);
  } catch {
    return [];
  }
};

export const validate = (document: Document): Issue[] =>
  RULES.flatMap((rule) => runRule(rule, document)).sort(byOrder);
