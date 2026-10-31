import {
  DRAFT_STORAGE_KEY,
  FILE_MIME,
  LOAD_ERROR,
  MAX_FILE_BYTES,
  NEEDS_M5_NOTICE,
  REPLACE_CONFIRM,
  issuesLoadedText,
} from "../constants/labFile";
import type { LabExample } from "../types/labFile";
import type { Document } from "../types/topology";
import { isDirty, useFileStore } from "./fileStore";
import {
  downloadName,
  isEmptyLab,
  newLabId,
  parseLabFile,
  serializeLab,
} from "./labFile";
import { safeStorage } from "./safeStorage";
import { showIssues } from "./showIssues";
import { useTopologyStore } from "./topologyStore";
import { validate } from "./validation/validate";

interface ReplaceOptions {
  /** Ask first when there are unsaved changes (default true). */
  confirm?: boolean;
  /** Treat the loaded lab as saved (default true); a restored draft is not. */
  markClean?: boolean;
  notice?: string;
}

const showError = (text: string) =>
  useFileStore.getState().setNotice({ kind: "error", text });

/** Replaces the lab; returns false when the user cancels the confirmation. */
export function replaceLab(
  document: Document,
  { confirm = true, markClean = true, notice }: ReplaceOptions = {},
): boolean {
  if (confirm && isDirty() && !window.confirm(REPLACE_CONFIRM)) return false;
  useTopologyStore.getState().loadDocument(document);
  safeStorage.removeItem(DRAFT_STORAGE_KEY);
  const files = useFileStore.getState();
  if (markClean) files.setBaseline(document);
  const issues = validate(document);
  if (issues.length) showIssues();
  const text = [notice, issues.length && issuesLoadedText(issues.length)]
    .filter(Boolean)
    .join(" ");
  files.setNotice(text ? { kind: "info", text } : null);
  return true;
}

/** A bad file sets an error notice and changes nothing else. */
export function loadFromText(text: string, options?: ReplaceOptions): boolean {
  const result = parseLabFile(text);
  if (!result.ok) {
    showError(result.error);
    return false;
  }
  return replaceLab(result.document, options);
}

export function saveLab() {
  const { document } = useTopologyStore.getState();
  const blob = new Blob([serializeLab(document)], { type: FILE_MIME });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = downloadName(document.lab.name);
  link.click();
  URL.revokeObjectURL(url);
  useFileStore.getState().setBaseline(document);
  safeStorage.removeItem(DRAFT_STORAGE_KEY);
}

export async function openFile(file: File) {
  if (file.size > MAX_FILE_BYTES) return showError(LOAD_ERROR.TOO_LARGE);
  let text: string;
  try {
    text = await file.text();
  } catch {
    return showError(LOAD_ERROR.UNREADABLE);
  }
  loadFromText(text);
}

export function openFiles(files: FileList | File[]) {
  if (files.length > 1) return showError(LOAD_ERROR.MANY_FILES);
  if (files.length === 1) void openFile(files[0]);
}

export function openFromPicker() {
  const input = window.document.createElement("input");
  input.type = "file";
  input.onchange = () => openFiles(input.files ?? []);
  input.click();
}

export function openExample(example: LabExample) {
  const result = parseLabFile(example.text);
  if (!result.ok) return showError(result.error);
  const { document } = result;
  replaceLab(
    { ...document, lab: { ...document.lab, id: newLabId() } },
    { notice: example.needsM5 ? NEEDS_M5_NOTICE : undefined },
  );
}

/** At start: offer a stored draft only if it parses and holds something. */
export function initDraft() {
  const files = useFileStore.getState();
  // safeStorage reads synchronously; the type only allows async stores.
  const text = safeStorage.getItem(DRAFT_STORAGE_KEY) as string | null;
  if (text === null) return files.setDraftReady(true);
  const result = parseLabFile(text);
  if (result.ok && !isEmptyLab(result.document))
    return files.setPendingDraft(result.document);
  safeStorage.removeItem(DRAFT_STORAGE_KEY);
  files.setDraftReady(true);
}

export function restoreDraft() {
  const files = useFileStore.getState();
  if (files.pendingDraft)
    replaceLab(files.pendingDraft, { confirm: false, markClean: false });
  files.setPendingDraft(null);
  files.setDraftReady(true);
}

export function discardDraft() {
  safeStorage.removeItem(DRAFT_STORAGE_KEY);
  const files = useFileStore.getState();
  files.setPendingDraft(null);
  files.setDraftReady(true);
}
