import {
  ADDRESSES_LABEL,
  ADD_ADDRESS_HINT,
  FIELD_LABEL,
  PLACEHOLDER,
  REMOVE_TEXT,
  removeLabel,
} from "../../constants/inspector";
import { validateAddress } from "../../store/fieldRules";
import { addAddress, removeAddress } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import RemoveAction from "./RemoveAction";
import ValidatedField from "./ValidatedField";

export default function AddressList({ interfaceId }: { interfaceId: string }) {
  const document = useTopologyStore((s) => s.document);
  const edit = useTopologyStore((s) => s.edit);
  const addresses =
    document.interfaces.find((i) => i.id === interfaceId)?.addresses ?? [];

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-ink-muted">{ADDRESSES_LABEL}</p>
      {addresses.map(({ cidr }) => (
        <div key={cidr} className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-sm text-ink">{cidr}</span>
          <RemoveAction
            text={REMOVE_TEXT.ADDRESS}
            label={removeLabel(REMOVE_TEXT.ADDRESS, cidr)}
            onClick={() => edit((d) => removeAddress(d, interfaceId, cidr))}
          />
        </div>
      ))}
      <ValidatedField
        key={addresses.length}
        fieldKey={`address-${interfaceId}`}
        label={FIELD_LABEL.ADDRESS}
        value=""
        placeholder={PLACEHOLDER.ADDRESS}
        hint={ADD_ADDRESS_HINT}
        rule={(text) =>
          text ? validateAddress(document, interfaceId, text) : null
        }
        onCommit={(cidr) => edit((d) => addAddress(d, interfaceId, cidr))}
      />
    </div>
  );
}
