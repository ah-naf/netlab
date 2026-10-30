import type { NodeProps } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import type { FlowNodeData } from "../../types/flow";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import InterfaceRow from "./InterfaceRow";
import NodeCard from "./NodeCard";

export default function BridgeNode({
  id,
  data,
  selected,
}: NodeProps & { data: FlowNodeData }) {
  const node = useTopologyStore((s) =>
    s.document.nodes.find((n) => n.id === id),
  );
  const portIds = useTopologyStore(
    useShallow((s) => interfacesOf(s.document, id).map((i) => i.id)),
  );
  if (!node) return null;

  return (
    <NodeCard title={node.name} status={data.status} selected={selected}>
      {portIds.map((portId) => (
        <InterfaceRow key={portId} nodeName={node.name} interfaceId={portId} />
      ))}
    </NodeCard>
  );
}
