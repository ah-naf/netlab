import { FIELD_LABEL, STATE_CHOICES } from "../../constants/inspector";
import { validateInterfaceName, validateMtu } from "../../store/fieldRules";
import {
  renameInterface,
  setInterfaceMtu,
  setInterfaceState,
} from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import type { State } from "../../types/topology";
import { RemoveInterfaceButton } from "../nodes/InterfaceRow";
import AddressList from "./AddressList";
import SelectField from "./SelectField";
import ValidatedField from "./ValidatedField";

export default function InterfaceEditor({
  interfaceId,
}: {
  interfaceId: string;
}) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const item = document.interfaces.find((i) => i.id === interfaceId);
  const nodeName = document.nodes.find((n) => n.id === item?.nodeId)?.name;
  if (!item || !nodeName) return null;

  return (
    <div className="space-y-1.5 border-t border-rule px-3 py-2">
      <ValidatedField
        fieldKey={`name-${interfaceId}`}
        label={FIELD_LABEL.INTERFACE_NAME}
        value={item.name}
        rule={(text) => validateInterfaceName(document, interfaceId, text)}
        onCommit={(name) => edit((d) => renameInterface(d, interfaceId, name))}
      />
      <div className="flex gap-2">
        <ValidatedField
          fieldKey={`mtu-${interfaceId}`}
          label={FIELD_LABEL.MTU}
          value={String(item.mtu)}
          rule={validateMtu}
          onCommit={(mtu) =>
            edit((d) => setInterfaceMtu(d, interfaceId, Number(mtu)))
          }
        />
        <SelectField
          label={FIELD_LABEL.STATE}
          value={item.state}
          options={STATE_CHOICES}
          onChange={(state) =>
            edit((d) => setInterfaceState(d, interfaceId, state as State))
          }
        />
      </div>
      <AddressList interfaceId={interfaceId} />
      <RemoveInterfaceButton nodeName={nodeName} item={item} />
    </div>
  );
}
