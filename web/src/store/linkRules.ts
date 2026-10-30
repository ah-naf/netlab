import { LINK_REASON } from "../constants/links";
import { NODE_TYPE } from "../constants/topology";
import type { ConnectionCheck, LinkEnd } from "../types/links";
import type { Document } from "../types/topology";

const REJECT = (reason: string): ConnectionCheck => ({ ok: false, reason });

const isLinked = (document: Document, interfaceId?: string) =>
  !!interfaceId &&
  document.links.some(
    (l) => l.endpointA === interfaceId || l.endpointB === interfaceId,
  );

/** Decides whether two handles may be joined by a link. */
export function checkConnection(
  document: Document,
  from: LinkEnd,
  to: LinkEnd,
): ConnectionCheck {
  if (from.nodeId === to.nodeId) return REJECT(LINK_REASON.SELF_LINK);
  if (
    isLinked(document, from.interfaceId) ||
    isLinked(document, to.interfaceId)
  )
    return REJECT(LINK_REASON.ALREADY_LINKED);
  const types = [from, to].map(
    (end) => document.nodes.find((n) => n.id === end.nodeId)?.type,
  );
  const newPortOnNonBridge = [from, to].some(
    (end, i) => !end.interfaceId && types[i] !== NODE_TYPE.BRIDGE,
  );
  const known = types.every(
    (t) => t === NODE_TYPE.NAMESPACE || t === NODE_TYPE.BRIDGE,
  );
  return known && !newPortOnNonBridge
    ? { ok: true }
    : REJECT(LINK_REASON.UNSUPPORTED);
}
