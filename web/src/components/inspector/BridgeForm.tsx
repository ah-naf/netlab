import { useShallow } from "zustand/react/shallow";
import {
  BRIDGE_LINK_FIELD_LABEL,
  BRIDGE_LINK_GROUP_TITLE,
  VLAN_NOTE,
} from "../../constants/inspectorBridgeLink";
import { renameNode, validateNodeName } from "../../store/documentOps";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import AddInterfaceButton from "../nodes/AddInterfaceButton";
import PortRow from "./PortRow";
import Section from "./Section";
import StpFields from "./StpFields";
import ValidatedField from "./ValidatedField";

export default function BridgeForm({ nodeId }: { nodeId: string }) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const portIds = useTopologyStore(
    useShallow((s) => interfacesOf(s.document, nodeId).map((i) => i.id)),
  );
  const node = document.nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  return (
    <div>
      <Section title={BRIDGE_LINK_GROUP_TITLE.BRIDGE}>
        <div className="px-3 pb-3">
          <ValidatedField
            fieldKey={`bridge-name-${nodeId}`}
            label={BRIDGE_LINK_FIELD_LABEL.BRIDGE_NAME}
            value={node.name}
            rule={(text) => validateNodeName(document, nodeId, text)}
            onCommit={(name) => edit((d) => renameNode(d, nodeId, name))}
          />
        </div>
      </Section>
      <Section title={BRIDGE_LINK_GROUP_TITLE.PORTS}>
        <div className="space-y-3 px-3 pb-2">
          {portIds.map((id) => (
            <PortRow key={id} interfaceId={id} />
          ))}
        </div>
        <AddInterfaceButton node={node} />
      </Section>
      <Section title={BRIDGE_LINK_GROUP_TITLE.STP}>
        <StpFields nodeId={nodeId} />
      </Section>
      <Section title={BRIDGE_LINK_GROUP_TITLE.VLAN}>
        <p className="px-3 pb-3 text-xs text-ink-muted">{VLAN_NOTE}</p>
      </Section>
    </div>
  );
}
