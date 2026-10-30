/** A missing interfaceId means the bridge new-port handle. */
export interface LinkEnd {
  nodeId: string;
  interfaceId?: string;
}

export type ConnectionCheck = { ok: true } | { ok: false; reason: string };
