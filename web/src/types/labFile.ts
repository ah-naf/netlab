import type { Document } from "./topology.ts";

export type LoadResult =
  { ok: true; document: Document } | { ok: false; error: string };

export type NoticeKind = "error" | "info";

export interface Notice {
  kind: NoticeKind;
  text: string;
}

export interface LabExample {
  id: string;
  label: string;
  description: string;
  needsM5: boolean;
  text: string;
}
