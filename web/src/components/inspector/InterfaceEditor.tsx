import {
  FIELD_LABEL,
  REMOVE_TEXT,
  STATE_CHOICES,
  removeLabel,
} from "../../constants/inspector";
import { setInterfaceState } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import type { State } from "../../types/topology";
import AddressList from "./AddressList";
import InterfaceNameField from "./InterfaceNameField";
import RemoveAction from "./RemoveAction";
import SelectField from "./SelectField";

export default function InterfaceEditor({
  interfaceId,
}: {
  interfaceId: string;
}) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const removeInterface = useTopologyStore((s) => s.removeInterface);
  const item = document.interfaces.find((i) => i.id === interfaceId);
  if (!item) return null;

  return (
    <div className="border border-rule">
      <div className="flex items-center justify-between gap-2 border-b border-rule bg-chassis px-2 py-1">
        <span
          className="min-w-0 truncate text-sm font-semibold"
          title={item.name}
        >
          {item.name}
        </span>
        <RemoveAction
          danger
          text={REMOVE_TEXT.INTERFACE}
          label={removeLabel(REMOVE_TEXT.INTERFACE, item.name)}
          onClick={() => removeInterface(interfaceId)}
        />
      </div>
      <div className="space-y-2 p-2">
        <InterfaceNameField
          interfaceId={interfaceId}
          fieldKey={`name-${interfaceId}`}
          label={FIELD_LABEL.INTERFACE_NAME}
        />
        <SelectField
          label={FIELD_LABEL.STATE}
          value={item.state}
          options={STATE_CHOICES}
          onChange={(state) =>
            edit((d) => setInterfaceState(d, interfaceId, state as State))
          }
        />
        <AddressList interfaceId={interfaceId} />
      </div>
    </div>
  );
}
