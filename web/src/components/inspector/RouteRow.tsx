import { useShallow } from "zustand/react/shallow";
import {
  FIELD_LABEL,
  NONE_CHOICE_LABEL,
  REMOVE_TEXT,
  removeLabel,
  routeTitle,
} from "../../constants/inspector";
import { validateRoute } from "../../store/fieldRules";
import { removeRoute, updateRoute } from "../../store/namespaceOps";
import { draftOf, toRoute } from "../../store/routeDraft";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import type { RouteDraft } from "../../types/inspector";
import type { Route } from "../../types/topology";
import RemoveAction from "./RemoveAction";
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
  const interfaces = useTopologyStore(
    useShallow((s) => interfacesOf(s.document, nodeId)),
  );
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
    <div className="border border-rule">
      <div className="flex items-center justify-between gap-2 border-b border-rule bg-chassis px-2 py-1">
        <span
          className="min-w-0 truncate text-sm font-semibold"
          title={route.destination}
        >
          {routeTitle(route.destination)}
        </span>
        <RemoveAction
          danger
          text={REMOVE_TEXT.ROUTE}
          label={removeLabel(REMOVE_TEXT.ROUTE, route.destination)}
          onClick={() => edit((d) => removeRoute(d, nodeId, index))}
        />
      </div>
      <div className="space-y-2 p-2">
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
      </div>
    </div>
  );
}
