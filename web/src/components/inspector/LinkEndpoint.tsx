import { BRIDGE_LINK_FIELD_LABEL } from "../../constants/inspectorBridgeLink";
import { validateInterfaceName } from "../../store/fieldRules";
import { renameInterface } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import ValidatedField from "./ValidatedField";

export default function LinkEndpoint({ interfaceId }: { interfaceId: string }) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const item = document.interfaces.find((i) => i.id === interfaceId);
  const nodeName = document.nodes.find((n) => n.id === item?.nodeId)?.name;
  if (!item) return null;

  return (
    <div className="space-y-2 px-3 pb-3">
      <div className="text-xs text-ink-muted">
        {BRIDGE_LINK_FIELD_LABEL.ENDPOINT_NODE}
        <p className="text-sm text-ink">{nodeName}</p>
      </div>
      <ValidatedField
        fieldKey={`endpoint-name-${interfaceId}`}
        label={BRIDGE_LINK_FIELD_LABEL.ENDPOINT_INTERFACE}
        value={item.name}
        rule={(text) => validateInterfaceName(document, interfaceId, text)}
        onCommit={(name) => edit((d) => renameInterface(d, interfaceId, name))}
      />
    </div>
  );
}
