import type { NodeProps } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import type { FlowNodeData } from "../../types/flow";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import InterfaceRow from "./InterfaceRow";
import NodeCard from "./NodeCard";
import RoleIcon from "./RoleIcon";

export default function NamespaceNode({
  id,
  data,
  selected,
}: NodeProps & { data: FlowNodeData }) {
  const node = useTopologyStore((s) =>
    s.document.nodes.find((n) => n.id === id),
  );
  const interfaceIds = useTopologyStore(
    useShallow((s) => interfacesOf(s.document, id).map((i) => i.id)),
  );
  if (!node) return null;

  return (
    <NodeCard
      title={node.name}
      icon={<RoleIcon role={node.role} />}
      status={data.status}
      selected={selected}
    >
      {interfaceIds.map((interfaceId) => (
        <InterfaceRow
          key={interfaceId}
          nodeName={node.name}
          interfaceId={interfaceId}
        />
      ))}
    </NodeCard>
  );
}
