import type { Document } from "./topology.ts";

export const CURRENT_VERSION = 1;

const VERSION_MISSING_MESSAGE = "schemaVersion is missing";
const UNSUPPORTED_VERSION_MESSAGE = "unsupported schemaVersion";

export function migrate(raw: unknown): Document {
  const version = (raw as { schemaVersion?: number }).schemaVersion;
  if (!version) {
    throw new Error(VERSION_MISSING_MESSAGE);
  }
  if (version !== CURRENT_VERSION) {
    throw new Error(`${UNSUPPORTED_VERSION_MESSAGE} ${version}`);
  }
  const doc = raw as Document;
  return {
    ...doc,
    nodes: doc.nodes ?? [],
    interfaces: doc.interfaces ?? [],
    links: doc.links ?? [],
  };
}

export function parseDocument(text: string): Document {
  return migrate(JSON.parse(text));
}
