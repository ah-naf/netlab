import { BRIDGE_LINK_FIELD_LABEL } from "../../constants/inspectorBridgeLink";
import { useTopologyStore } from "../../store/topologyStore";
import InterfaceNameField from "./InterfaceNameField";

export default function LinkEndpoint({ interfaceId }: { interfaceId: string }) {
  const document = useTopologyStore((s) => s.document);
  const item = document.interfaces.find((i) => i.id === interfaceId);
  const nodeName = document.nodes.find((n) => n.id === item?.nodeId)?.name;
  if (!item) return null;

  return (
    <div className="space-y-2 px-3 pb-3">
      <div className="text-xs text-ink-muted">
        {BRIDGE_LINK_FIELD_LABEL.ENDPOINT_NODE}
        <p className="text-sm text-ink">{nodeName}</p>
      </div>
      <InterfaceNameField
        interfaceId={interfaceId}
        fieldKey={`endpoint-name-${interfaceId}`}
        label={BRIDGE_LINK_FIELD_LABEL.ENDPOINT_INTERFACE}
      />
    </div>
  );
}
