import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NEW_PORT_HANDLE_ID, NEW_PORT_LABEL } from "../../constants/links";
import { useShallow } from "zustand/react/shallow";
import { nodeKindOf } from "../../store/nodeKind";
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
      icon={<NodeIcon kind={nodeKindOf(node)} />}
      status={data.status}
      selected={selected}
    >
      {portIds.map((portId) => (
        <InterfaceRow key={portId} nodeName={node.name} interfaceId={portId} />
      ))}
      <div className="nodrag relative border-t border-rule px-3 py-1 text-xs text-ink-muted">
        {NEW_PORT_LABEL}
        <Handle
          id={NEW_PORT_HANDLE_ID}
          type="source"
          position={Position.Right}
          aria-label={`${node.name} ${NEW_PORT_LABEL}`}
          className="!h-2.5 !w-2.5 !border-rule !bg-signal"
        />
      </div>
      <AddInterfaceButton node={node} />
    </NodeCard>
  );
}
