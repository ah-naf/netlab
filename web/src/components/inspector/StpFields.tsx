import {
  BRIDGE_LINK_FIELD_LABEL,
  STP_PRIORITY_DEFAULT,
} from "../../constants/inspectorBridgeLink";
import { setStp, setStpPriority } from "../../store/bridgeLinkOps";
import { validateStpPriority } from "../../store/fieldRules";
import { useTopologyStore } from "../../store/topologyStore";
import ValidatedField from "./ValidatedField";

export default function StpFields({ nodeId }: { nodeId: string }) {
  const bridge = useTopologyStore(
    (s) => s.document.nodes.find((n) => n.id === nodeId)?.bridge,
  );
  const edit = useTopologyStore((s) => s.edit);
  const stp = bridge?.stp ?? false;

  return (
    <div className="space-y-2 px-3 pb-3">
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={stp}
          onChange={(event) =>
            edit((d) => setStp(d, nodeId, event.target.checked))
          }
        />
        {BRIDGE_LINK_FIELD_LABEL.STP}
      </label>
      <ValidatedField
        fieldKey={`stp-priority-${nodeId}`}
        label={BRIDGE_LINK_FIELD_LABEL.STP_PRIORITY}
        value={String(bridge?.stpPriority ?? STP_PRIORITY_DEFAULT)}
        rule={validateStpPriority}
        onCommit={(text) =>
          edit((d) => setStpPriority(d, nodeId, Number(text)))
        }
        disabled={!stp}
      />
    </div>
  );
}
