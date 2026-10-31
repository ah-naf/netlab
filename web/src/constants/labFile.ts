import { LINUX_NAME } from "./validation.ts";

export const FILE_EXTENSION = ".netlab.json";
export const FILE_MIME = "application/json";
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const DRAFT_STORAGE_KEY = "netlab.draft";
export const DRAFT_DELAY_MS = 1000;
export const DEFAULT_FILE_NAME = "untitled-lab";
export const LAB_ID_LENGTH = LINUX_NAME.LAB_ID_CHARS;
// Control characters are on purpose: they are not allowed in file names.
// eslint-disable-next-line no-control-regex
export const UNSAFE_FILE_CHARS = /[\\/:*?"<>|\u0000-\u001f]/g;
export const FILE_NAME_FILLER = "_";
export const NEEDS_M5_FILES = ["router-two-subnets.json"];

export const LOAD_ERROR = {
  NOT_JSON: "This file is not valid JSON.",
  NOT_A_LAB: "This file is not a NetLab lab file.",
  TOO_LARGE: "This file is too large to open (limit 5 MB).",
  MANY_FILES: "Only one file can be opened at a time.",
  UNREADABLE: "This file could not be read.",
  unsupportedVersion: (version: unknown) =>
    `This file uses schema version ${version}, which this app does not support.`,
} as const;

export const REPLACE_CONFIRM =
  "This will replace the current lab. Unsaved changes will be lost. Continue?";
export const issuesLoadedText = (count: number) =>
  `${count} ${count === 1 ? "issue" : "issues"} found; see the Issues tab.`;
export const NEEDS_M5_NOTICE =
  "This example needs M5 to deploy; you can view and edit it.";
export const NEEDS_M5_BADGE = "needs M5";
export const DISMISS_LABEL = "Dismiss";
export const SAVE_LABEL = "Save";
export const OPEN_LABEL = "Open";
export const EXAMPLES_LABEL = "Examples";
export const DRAFT_TITLE = "Restore your unsaved lab?";
export const RESTORE_LABEL = "Restore";
export const DISCARD_LABEL = "Discard";
export const UNTITLED_LAB_TEXT = "Untitled lab";
export const draftSummary = (name: string, nodeCount: number) =>
  `${name || UNTITLED_LAB_TEXT} · ${nodeCount} ${nodeCount === 1 ? "node" : "nodes"}`;
