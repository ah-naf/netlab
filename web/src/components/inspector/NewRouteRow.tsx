import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  ACTION_LABEL,
  FIELD_LABEL,
  NEW_ROUTE_TITLE,
  NONE_CHOICE_LABEL,
} from "../../constants/inspector";
import {
  validateDestination,
  validateGateway,
  validateMetric,
  validateRoute,
} from "../../store/fieldRules";
import { addRoute } from "../../store/namespaceOps";
import { EMPTY_ROUTE_DRAFT, toRoute } from "../../store/routeDraft";
import { interfacesOf, useTopologyStore } from "../../store/topologyStore";
import type { FieldRule, RouteDraft } from "../../types/inspector";
import ActionButton from "../nodes/ActionButton";
import SelectField from "./SelectField";
import ValidatedField from "./ValidatedField";

const TEXT_FIELDS: {
  field: keyof RouteDraft;
  label: string;
  rule: FieldRule;
}[] = [
  {
    field: "destination",
    label: FIELD_LABEL.DESTINATION,
    rule: validateDestination,
  },
  { field: "gateway", label: FIELD_LABEL.ROUTE_GATEWAY, rule: validateGateway },
  { field: "metric", label: FIELD_LABEL.METRIC, rule: validateMetric },
];

/** A route being typed; it joins the lab only when confirmed and valid. */
export default function NewRouteRow({
  nodeId,
  onDone,
}: {
  nodeId: string;
  onDone: () => void;
}) {
  const edit = useTopologyStore((s) => s.edit);
  const interfaces = useTopologyStore(
    useShallow((s) => interfacesOf(s.document, nodeId)),
  );
  const [draft, setDraft] = useState(EMPTY_ROUTE_DRAFT);
  const set = (field: keyof RouteDraft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));
  const confirm = () => {
    edit((d) => addRoute(d, nodeId, toRoute(draft)));
    onDone();
  };

  return (
    <div className="border border-signal">
      <div className="flex items-center justify-between gap-2 border-b border-rule bg-chassis px-2 py-1">
        <span className="text-sm font-semibold">{NEW_ROUTE_TITLE}</span>
        <span className="flex items-center gap-3">
          <ActionButton onClick={onDone}>{ACTION_LABEL.CANCEL}</ActionButton>
          <ActionButton
            disabled={validateRoute(draft) !== null}
            onClick={confirm}
            className="border border-signal px-2 py-0.5 text-signal disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ACTION_LABEL.CONFIRM}
          </ActionButton>
        </span>
      </div>
      <div className="space-y-2 p-2">
        {TEXT_FIELDS.map(({ field, label, rule }) => (
          <ValidatedField
            key={field}
            fieldKey={`new-route-${nodeId}-${field}`}
            label={label}
            value={draft[field]}
            rule={(text) => (text ? rule(text) : null)}
            onCommit={(text) => set(field, text)}
          />
        ))}
        <SelectField
          label={FIELD_LABEL.OUTPUT_INTERFACE}
          value={draft.interfaceId}
          options={[
            { value: "", label: NONE_CHOICE_LABEL },
            ...interfaces.map((i) => ({ value: i.id, label: i.name })),
          ]}
          onChange={(value) => set("interfaceId", value)}
        />
      </div>
    </div>
  );
}
