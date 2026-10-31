import {
  DEFAULT_FILE_NAME,
  FILE_EXTENSION,
  FILE_NAME_FILLER,
  LAB_ID_LENGTH,
  LOAD_ERROR,
  UNSAFE_FILE_CHARS,
} from "../constants/labFile.ts";
import type { LoadResult } from "../types/labFile.ts";
import type { Document } from "../types/topology.ts";
import { CURRENT_VERSION, migrate } from "../types/topologyDocument.ts";

const JSON_INDENT = 2;
const HEX_ID_DASH = "-";
const LEADING_DOTS = /^\.+/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasStrings = (item: unknown, keys: string[]) =>
  isRecord(item) && keys.every((key) => typeof item[key] === "string");

const allHaveStrings = (list: unknown, keys: string[]) =>
  list === undefined ||
  (Array.isArray(list) && list.every((item) => hasStrings(item, keys)));

/** Wrong-shaped content must be refused before it can reach the canvas. */
function isLabShape(raw: unknown): raw is Record<string, unknown> {
  return (
    isRecord(raw) &&
    typeof raw.schemaVersion === "number" &&
    hasStrings(raw.lab, ["id", "name"]) &&
    allHaveStrings(raw.nodes, ["id", "name", "type"]) &&
    allHaveStrings(raw.interfaces, ["id", "nodeId", "name"]) &&
    allHaveStrings(raw.links, ["id", "endpointA", "endpointB"])
  );
}

export const newLabId = (): string =>
  crypto.randomUUID().replaceAll(HEX_ID_DASH, "").slice(0, LAB_ID_LENGTH);

export const emptyLab = (): Document => ({
  schemaVersion: CURRENT_VERSION,
  lab: { id: newLabId(), name: "" },
  nodes: [],
  interfaces: [],
  links: [],
});

export const isEmptyLab = (document: Document): boolean =>
  !document.nodes.length &&
  !document.interfaces.length &&
  !document.links.length &&
  !document.lab.name.trim();

export const serializeLab = (document: Document): string =>
  `${JSON.stringify(document, null, JSON_INDENT)}\n`;

export function downloadName(labName: string): string {
  const base = labName
    .replace(UNSAFE_FILE_CHARS, FILE_NAME_FILLER)
    .trim()
    .replace(LEADING_DOTS, "");
  return `${base || DEFAULT_FILE_NAME}${FILE_EXTENSION}`;
}

/** Never throws: a bad file is an error result, so the current lab stays as it is. */
export function parseLabFile(text: string): LoadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: LOAD_ERROR.NOT_JSON };
  }
  if (!isLabShape(raw)) return { ok: false, error: LOAD_ERROR.NOT_A_LAB };
  try {
    return { ok: true, document: migrate(raw) };
  } catch {
    return {
      ok: false,
      error: LOAD_ERROR.unsupportedVersion(raw.schemaVersion),
    };
  }
}
