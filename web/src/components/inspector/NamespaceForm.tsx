import { useShallow } from "zustand/react/shallow";
import { FIELD_LABEL, GROUP_TITLE } from "../../constants/inspector";
import { renameNode, validateNodeName } from "../../store/documentOps";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import AddInterfaceButton from "../nodes/AddInterfaceButton";
import GatewayField from "./GatewayField";
import InterfaceEditor from "./InterfaceEditor";
import RoleField from "./RoleField";
import RoutesTable from "./RoutesTable";
import Section from "./Section";
import ValidatedField from "./ValidatedField";

export default function NamespaceForm({ nodeId }: { nodeId: string }) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const interfaceIds = useTopologyStore(
    useShallow((s) => interfacesOf(s.document, nodeId).map((i) => i.id)),
  );
  const node = document.nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  return (
    <div>
      <Section title={GROUP_TITLE.NAMESPACE}>
        <div className="space-y-2 px-3 pb-3">
          <ValidatedField
            fieldKey={`node-name-${nodeId}`}
            label={FIELD_LABEL.NODE_NAME}
            value={node.name}
            rule={(text) => validateNodeName(document, nodeId, text)}
            onCommit={(name) => edit((d) => renameNode(d, nodeId, name))}
          />
          <RoleField nodeId={nodeId} />
        </div>
      </Section>
      <Section title={GROUP_TITLE.INTERFACES}>
        <div className="space-y-3 px-3 pb-2">
          {interfaceIds.map((id) => (
            <InterfaceEditor key={id} interfaceId={id} />
          ))}
        </div>
        <AddInterfaceButton node={node} />
      </Section>
      <Section title={GROUP_TITLE.GATEWAY}>
        <div className="px-3 pb-3">
          <GatewayField nodeId={nodeId} />
        </div>
      </Section>
      <Section title={GROUP_TITLE.ROUTES}>
        <RoutesTable nodeId={nodeId} />
      </Section>
    </div>
  );
}
