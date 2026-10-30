import { Handle, Position } from "@xyflow/react";
import { NO_ADDRESS_TEXT, REMOVE_LABEL } from "../../constants/topology";
import { useTopologyStore } from "../../store/topologyStore";
import type { Interface } from "../../types/topology";
import ActionButton from "./ActionButton";

export function InterfaceLabel({ item }: { item: Interface }) {
  const addresses = item.addresses?.map((a) => a.cidr).join(", ");
  return (
    <>
      <span className="font-medium text-ink">{item.name}</span>
      <span
        className="min-w-0 flex-1 truncate text-ink-muted"
        title={addresses}
      >
        {addresses || NO_ADDRESS_TEXT}
      </span>
    </>
  );
}

export function RemoveInterfaceButton({
  nodeName,
  item,
}: {
  nodeName: string;
  item: Interface;
}) {
  const removeInterface = useTopologyStore((s) => s.removeInterface);
  return (
    <ActionButton
      onClick={() => removeInterface(item.id)}
      aria-label={`${REMOVE_LABEL} ${nodeName} ${item.name}`}
    >
      {REMOVE_LABEL}
    </ActionButton>
  );
}

interface Props {
  nodeName: string;
  interfaceId: string;
}

export default function InterfaceRow({ nodeName, interfaceId }: Props) {
  const item = useTopologyStore((s) =>
    s.document.interfaces.find((i) => i.id === interfaceId),
  );
  if (!item) return null;

  return (
    <div className="nodrag relative flex items-center gap-2 border-t border-rule px-3 py-1 text-xs">
      <InterfaceLabel item={item} />
      <RemoveInterfaceButton nodeName={nodeName} item={item} />
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
