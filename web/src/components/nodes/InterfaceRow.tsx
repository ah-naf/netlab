import { Handle, Position } from "@xyflow/react";
import { NO_ADDRESS_TEXT } from "../../constants/topology";
import { useTopologyStore } from "../../store/topologyStore";

interface Props {
  nodeName: string;
  interfaceId: string;
}

export default function InterfaceRow({ nodeName, interfaceId }: Props) {
  const item = useTopologyStore((s) =>
    s.document.interfaces.find((i) => i.id === interfaceId),
  );
  if (!item) return null;
  const addresses = item.addresses?.map((a) => a.cidr).join(", ");

  return (
    <div className="nodrag relative flex items-center gap-2 border-t border-rule px-3 py-1 text-xs">
      <span className="font-medium text-ink">{item.name}</span>
      <span
        className="min-w-0 flex-1 truncate text-ink-muted"
        title={addresses}
      >
        {addresses || NO_ADDRESS_TEXT}
      </span>
      <Handle
        id={interfaceId}
        type="source"
        position={Position.Right}
        aria-label={`${nodeName} ${item.name}`}
        className="!h-2.5 !w-2.5 !border-rule !bg-signal"
      />
    </div>
  );
}
