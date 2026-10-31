import { validateInterfaceName } from "../../store/fieldRules";
import { renameInterface } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import ValidatedField from "./ValidatedField";

interface Props {
  interfaceId: string;
  fieldKey: string;
  label: string;
}

/** Name field for any interface: an interface, a bridge port, or a link end. */
export default function InterfaceNameField({
  interfaceId,
  fieldKey,
  label,
}: Props) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const item = document.interfaces.find((i) => i.id === interfaceId);
  if (!item) return null;

  return (
    <ValidatedField
      fieldKey={fieldKey}
      label={label}
      value={item.name}
      rule={(text) => validateInterfaceName(document, interfaceId, text)}
      onCommit={(name) => edit((d) => renameInterface(d, interfaceId, name))}
    />
  );
}
