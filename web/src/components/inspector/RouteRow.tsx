import {
  ACTION_LABEL,
  FIELD_LABEL,
  NONE_CHOICE_LABEL,
} from "../../constants/inspector";
import { validateRoute } from "../../store/fieldRules";
import { removeRoute, updateRoute } from "../../store/namespaceOps";
import { draftOf, toRoute } from "../../store/routeDraft";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import type { RouteDraft } from "../../types/inspector";
import type { Route } from "../../types/topology";
import ActionButton from "../nodes/ActionButton";
import SelectField from "./SelectField";
import ValidatedField from "./ValidatedField";

interface Props {
  nodeId: string;
  index: number;
  route: Route;
}

const TEXT_FIELDS = [
  { field: "destination", label: FIELD_LABEL.DESTINATION },
  { field: "gateway", label: FIELD_LABEL.ROUTE_GATEWAY },
  { field: "metric", label: FIELD_LABEL.METRIC },
] as const;

/** One stored route; each field is checked together with the rest of the route. */
export default function RouteRow({ nodeId, index, route }: Props) {
  const edit = useTopologyStore((s) => s.edit);
  const interfaces = useTopologyStore((s) => interfacesOf(s.document, nodeId));
  const draft = draftOf(route);
  const change = (field: keyof RouteDraft, value: string) =>
    edit((d) =>
      updateRoute(d, nodeId, index, toRoute({ ...draft, [field]: value })),
    );
  const interfaceOptions = [
    ...(draft.gateway ? [{ value: "", label: NONE_CHOICE_LABEL }] : []),
    ...interfaces.map((i) => ({ value: i.id, label: i.name })),
  ];

  return (
    <div className="space-y-1.5 border-t border-rule px-3 py-2">
      {TEXT_FIELDS.map(({ field, label }) => (
        <ValidatedField
          key={field}
          fieldKey={`route-${nodeId}-${index}-${field}`}
          label={label}
          value={draft[field]}
          rule={(text) => validateRoute({ ...draft, [field]: text })}
          onCommit={(text) => change(field, text)}
        />
      ))}
      <SelectField
        label={FIELD_LABEL.OUTPUT_INTERFACE}
        value={draft.interfaceId}
        options={interfaceOptions}
        onChange={(value) => change("interfaceId", value)}
      />
      <ActionButton
        onClick={() => edit((d) => removeRoute(d, nodeId, index))}
        aria-label={`${ACTION_LABEL.REMOVE} ${route.destination}`}
      >
        {ACTION_LABEL.REMOVE}
      </ActionButton>
    </div>
  );
}
