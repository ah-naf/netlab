import type { Document, Interface, Link, Node } from "./topology.ts";

export const CURRENT_VERSION = 1;

const REMOVED_ROLE = "nat";

const VERSION_MISSING_MESSAGE = "schemaVersion is missing";
const UNSUPPORTED_VERSION_MESSAGE = "unsupported schemaVersion";

const without = <T extends object>(item: T, key: string): T => {
  const copy = { ...item } as Record<string, unknown>;
  delete copy[key];
  return copy as T;
};

/** Fields and values this app no longer has are dropped, so saving writes a clean file. */
function cleanNode(node: Node): Node {
  const { role, natRules } = node;
  const kept = without(without(without(node, "bridge"), "role"), "natRules");
  return {
    ...kept,
    ...(role && (role as string) !== REMOVED_ROLE && { role }),
    ...(natRules && {
      natRules: natRules.map(({ id, interfaceId }) => ({ id, interfaceId })),
    }),
  };
}

const cleanInterface = (item: Interface) => without(item, "mtu");
const cleanLink = (link: Link) => without(link, "mtu");

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
    nodes: (doc.nodes ?? []).map(cleanNode),
    interfaces: (doc.interfaces ?? []).map(cleanInterface),
    links: (doc.links ?? []).map(cleanLink),
  };
}

export function parseDocument(text: string): Document {
  return migrate(JSON.parse(text));
}
