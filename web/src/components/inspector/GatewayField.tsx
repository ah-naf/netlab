import { FIELD_LABEL, PLACEHOLDER } from "../../constants/inspector";
import { validateGateway } from "../../store/fieldRules";
import { isDefaultRoute, setDefaultGateway } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import ValidatedField from "./ValidatedField";

export default function GatewayField({ nodeId }: { nodeId: string }) {
  const gateway = useTopologyStore(
    (s) =>
      s.document.nodes
        .find((n) => n.id === nodeId)
        ?.routes?.find(isDefaultRoute)?.gateway ?? "",
  );
  const edit = useTopologyStore((s) => s.edit);

  return (
    <ValidatedField
      fieldKey={`gateway-${nodeId}`}
      label={FIELD_LABEL.GATEWAY}
      value={gateway}
      placeholder={PLACEHOLDER.GATEWAY}
      rule={validateGateway}
      onCommit={(value) => edit((d) => setDefaultGateway(d, nodeId, value))}
    />
  );
}
