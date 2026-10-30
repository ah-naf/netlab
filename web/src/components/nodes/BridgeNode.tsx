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
  useRefreshHandles(id, portIds);
  if (!node) return null;

  return (
    <NodeCard
      nodeId={id}
      title={node.name}
      icon={<NodeIcon kind={iconKindOf(node)} />}
      status={data.status}
      selected={selected}
    >
      {portIds.map((portId) => (
        <InterfaceRow key={portId} nodeName={node.name} interfaceId={portId} />
      ))}
      <AddInterfaceButton node={node} />
    </NodeCard>
  );
}
