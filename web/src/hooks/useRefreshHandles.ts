import { useEffect } from "react";
import { useUpdateNodeInternals } from "@xyflow/react";

/** React Flow must re-measure handles when a node's rows change. */
export function useRefreshHandles(nodeId: string, interfaceIds: string[]) {
  const updateNodeInternals = useUpdateNodeInternals();
  const key = interfaceIds.join();
  useEffect(
    () => updateNodeInternals(nodeId),
    [nodeId, key, updateNodeInternals],
  );
}
