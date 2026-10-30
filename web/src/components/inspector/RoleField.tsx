import {
  FIELD_LABEL,
  NO_ROLE_TEXT,
  ROLE_CHOICES,
} from "../../constants/inspector";
import { setRole } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import type { Role } from "../../types/topology";
import SelectField from "./SelectField";

export default function RoleField({ nodeId }: { nodeId: string }) {
  const role = useTopologyStore(
    (s) => s.document.nodes.find((n) => n.id === nodeId)?.role,
  );
  const edit = useTopologyStore((s) => s.edit);
  const editable = ROLE_CHOICES.some((choice) => choice.value === role);

  if (!editable)
    return (
      <p className="text-xs text-ink-muted">
        {FIELD_LABEL.ROLE}:{" "}
        <span className="text-ink">{role ?? NO_ROLE_TEXT}</span>
      </p>
    );
  return (
    <SelectField
      label={FIELD_LABEL.ROLE}
      value={role ?? ""}
      options={ROLE_CHOICES}
      onChange={(value) => edit((d) => setRole(d, nodeId, value as Role))}
    />
  );
}
