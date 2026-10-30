import type { NodeProps } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { iconKindOf } from "../icons/iconKind";
import NodeIcon from "../icons/NodeIcon";
import type { FlowNodeData } from "../../types/flow";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import { useRefreshHandles } from "../../hooks/useRefreshHandles";
import AddInterfaceButton from "./AddInterfaceButton";
import InterfaceRow from "./InterfaceRow";
import NodeCard from "./NodeCard";

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
  useRefreshHandles(id, interfaceIds);
  if (!node) return null;

  return (
    <NodeCard
      nodeId={id}
      title={node.name}
      icon={<NodeIcon kind={iconKindOf(node)} />}
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
      <AddInterfaceButton node={node} />
    </NodeCard>
  );
}
