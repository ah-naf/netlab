import { ISSUE_CODE } from "../../constants/validation.ts";
import type { Document } from "../../types/topology.ts";
import type { Issue } from "../../types/validation.ts";
import { isCidr } from "../ipAddress.ts";
import { makeIssue } from "./makeIssue.ts";

export const addressRules = (document: Document): Issue[] =>
  document.interfaces.flatMap((iface) =>
    (iface.addresses ?? [])
      .filter((a) => !isCidr(a.cidr))
      .map(() => makeIssue(ISSUE_CODE.INVALID_CIDR, iface.id, iface.name)),
  );
