import { useShallow } from "zustand/react/shallow";
import { FIELD_LABEL, SECTION_TITLE } from "../../constants/inspector";
import { renameNode, validateNodeName } from "../../store/documentOps";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import AddInterfaceButton from "../nodes/AddInterfaceButton";
import GatewayField from "./GatewayField";
import RoleField from "./RoleField";
import RoutesTable from "./RoutesTable";
import ErrorBanner from "./ErrorBanner";
import InterfaceEditor from "./InterfaceEditor";
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
      <ErrorBanner />
      <div className="px-3 py-2">
        <ValidatedField
          fieldKey={`node-name-${nodeId}`}
          label={FIELD_LABEL.NODE_NAME}
          value={node.name}
          rule={(text) => validateNodeName(document, nodeId, text)}
          onCommit={(name) => edit((d) => renameNode(d, nodeId, name))}
        />
        <div className="mt-1.5">
          <RoleField nodeId={nodeId} />
        </div>
      </div>
      <h3 className="border-t border-rule px-3 pt-2 text-xs font-medium text-ink-muted">
        {SECTION_TITLE.INTERFACES}
      </h3>
      {interfaceIds.map((id) => (
        <InterfaceEditor key={id} interfaceId={id} />
      ))}
      <AddInterfaceButton node={node} />
      <div className="border-t border-rule px-3 py-2">
        <GatewayField nodeId={nodeId} />
      </div>
      <h3 className="border-t border-rule px-3 pt-2 text-xs font-medium text-ink-muted">
        {SECTION_TITLE.ROUTES}
      </h3>
      <RoutesTable nodeId={nodeId} />
    </div>
  );
}
