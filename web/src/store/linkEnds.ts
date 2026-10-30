import type { Connection } from "@xyflow/react";
import { NEW_PORT_HANDLE_ID } from "../constants/links";
import type { LinkEnd } from "../types/links";

const endOf = (nodeId: string, handleId: string | null): LinkEnd => ({
  nodeId,
  interfaceId:
    handleId && handleId !== NEW_PORT_HANDLE_ID ? handleId : undefined,
});

/** Maps a canvas connection to the two link ends it joins. */
export const endsOf = (c: Connection): [LinkEnd, LinkEnd] => [
  endOf(c.source, c.sourceHandle),
  endOf(c.target, c.targetHandle),
];
