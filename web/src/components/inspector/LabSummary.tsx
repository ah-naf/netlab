import { useShallow } from "zustand/react/shallow";
import { SUMMARY_LABEL } from "../../constants/inspectorBridgeLink";
import { summarize } from "../../store/bridgeLinkOps";
import { useTopologyStore } from "../../store/topologyStore";

export default function LabSummary() {
  const counts = useTopologyStore(useShallow((s) => summarize(s.document)));

  return (
    <dl className="space-y-1 px-3 pb-3 text-sm">
      {(Object.keys(SUMMARY_LABEL) as (keyof typeof SUMMARY_LABEL)[]).map(
        (key) => (
          <div key={key} className="flex justify-between gap-2">
            <dt className="text-ink-muted">{SUMMARY_LABEL[key]}</dt>
            <dd className="font-semibold text-ink">{counts[key]}</dd>
          </div>
        ),
      )}
    </dl>
  );
}
