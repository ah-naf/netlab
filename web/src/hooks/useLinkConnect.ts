import { useCallback, useState } from "react";
import type { Connection, Edge, FinalConnectionState } from "@xyflow/react";
import { endOf, endsOf } from "../store/linkEnds";
import { checkConnection } from "../store/linkRules";
import { useTopologyStore } from "../store/topologyStore";

/** Canvas connection handlers: validity feedback, rejection notice, link creation. */
export function useLinkConnect() {
  const [notice, setNotice] = useState("");
  const clearNotice = useCallback(() => setNotice(""), []);
  const isValidConnection = (c: Connection | Edge) =>
    checkConnection(useTopologyStore.getState().document, ...endsOf(c)).ok;
  const showRejection = (_: unknown, state: FinalConnectionState) => {
    const { fromNode, fromHandle, toNode, toHandle } = state;
    if (state.isValid || !fromNode || !fromHandle || !toNode || !toHandle)
      return;
    const check = checkConnection(
      useTopologyStore.getState().document,
      endOf(fromNode.id, fromHandle.id),
      endOf(toNode.id, toHandle.id),
    );
    if (!check.ok) setNotice(check.reason);
  };
  const connect = (c: Connection) => {
    setNotice("");
    useTopologyStore.getState().connect(...endsOf(c));
  };
  return { notice, clearNotice, isValidConnection, showRejection, connect };
}
