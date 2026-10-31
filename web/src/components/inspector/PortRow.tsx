import { REMOVE_TEXT, removeLabel } from "../../constants/inspector";
import {
  BRIDGE_LINK_FIELD_LABEL,
  LEADS_TO_LABEL,
  NOT_LINKED_TEXT,
  peerText,
} from "../../constants/inspectorBridgeLink";
import { peerOf } from "../../store/bridgeLinkOps";
import { useTopologyStore } from "../../store/topologyStore";
import InterfaceNameField from "./InterfaceNameField";
import RemoveAction from "./RemoveAction";

export default function PortRow({ interfaceId }: { interfaceId: string }) {
  const document = useTopologyStore((s) => s.document);
  const removeInterface = useTopologyStore((s) => s.removeInterface);
  const port = document.interfaces.find((i) => i.id === interfaceId);
  if (!port) return null;
  const peer = peerOf(document, interfaceId);

  return (
    <div className="border border-rule">
      <div className="flex items-center justify-between gap-2 border-b border-rule bg-chassis px-2 py-1">
        <span
          className="min-w-0 truncate text-sm font-semibold"
          title={port.name}
        >
          {port.name}
        </span>
        <RemoveAction
          danger
          text={REMOVE_TEXT.PORT}
          label={removeLabel(REMOVE_TEXT.PORT, port.name)}
          onClick={() => removeInterface(interfaceId)}
        />
      </div>
      <div className="space-y-2 p-2">
        <InterfaceNameField
          interfaceId={interfaceId}
          fieldKey={`port-name-${interfaceId}`}
          label={BRIDGE_LINK_FIELD_LABEL.PORT_NAME}
        />
        <p className="text-xs text-ink-muted">
          {LEADS_TO_LABEL}{" "}
          <span className="text-sm text-ink">
            {peer
              ? peerText(peer.nodeName, peer.interfaceName)
              : NOT_LINKED_TEXT}
          </span>
        </p>
      </div>
    </div>
  );
}
