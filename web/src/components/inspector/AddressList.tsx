import { ACTION_LABEL, FIELD_LABEL } from "../../constants/inspector";
import { validateAddress } from "../../store/fieldRules";
import { addAddress, removeAddress } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import ActionButton from "../nodes/ActionButton";
import ValidatedField from "./ValidatedField";

export default function AddressList({ interfaceId }: { interfaceId: string }) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const addresses =
    document.interfaces.find((i) => i.id === interfaceId)?.addresses ?? [];

  return (
    <div>
      {addresses.map(({ cidr }) => (
        <div key={cidr} className="flex items-center gap-2 py-0.5 text-xs">
          <span className="min-w-0 flex-1 truncate text-ink">{cidr}</span>
          <ActionButton
            aria-label={`${ACTION_LABEL.REMOVE} ${cidr}`}
            onClick={() => edit((d) => removeAddress(d, interfaceId, cidr))}
          >
            {ACTION_LABEL.REMOVE}
          </ActionButton>
        </div>
      ))}
      <ValidatedField
        key={addresses.length}
        fieldKey={`address-${interfaceId}`}
        label={FIELD_LABEL.ADDRESS}
        value=""
        placeholder="10.0.0.5/24"
        rule={(text) =>
          text ? validateAddress(document, interfaceId, text) : null
        }
        onCommit={(cidr) => edit((d) => addAddress(d, interfaceId, cidr))}
      />
    </div>
  );
}
