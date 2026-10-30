import { FIELD_LABEL } from "../../constants/inspector";
import { validateLabName } from "../../store/fieldRules";
import { renameLab } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import ValidatedField from "./ValidatedField";

export default function LabNameField() {
  const name = useTopologyStore((s) => s.document.lab.name);
  const edit = useTopologyStore((s) => s.edit);

  return (
    <ValidatedField
      fieldKey="lab-name"
      label={FIELD_LABEL.LAB_NAME}
      value={name}
      rule={validateLabName}
      onCommit={(value) => edit((d) => renameLab(d, value))}
    />
  );
}
