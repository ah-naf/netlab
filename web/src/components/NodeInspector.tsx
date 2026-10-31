import { BRIDGE_LINK_GROUP_TITLE } from "../constants/inspectorBridgeLink";
import { MULTI_SELECT_HINT, multiSelectText } from "../constants/palette";
import { REGION } from "../constants/layout";
import { NODE_TYPE, NO_SELECTION_HINT } from "../constants/topology";
import { useTopologyStore } from "../store/topologyStore";
import BridgeForm from "./inspector/BridgeForm";
import ErrorBanner from "./inspector/ErrorBanner";
import LabNameField from "./inspector/LabNameField";
import LabSummary from "./inspector/LabSummary";
import Section from "./inspector/Section";
import LinkForm from "./inspector/LinkForm";
import NamespaceForm from "./inspector/NamespaceForm";

export default function NodeInspector({
  className = "",
}: {
  className?: string;
}) {
  const node = useTopologyStore((s) =>
    s.selectedNodeIds.length === 1
      ? s.document.nodes.find((n) => n.id === s.selectedNodeIds[0])
      : undefined,
  );
  const linkId = useTopologyStore((s) =>
    s.document.links.some((l) => l.id === s.selectedLinkId)
      ? s.selectedLinkId
      : null,
  );
  const count = useTopologyStore((s) => s.selectedNodeIds.length);

  return (
    <aside
      aria-label={REGION.INSPECTOR.label}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {REGION.INSPECTOR.label}
      </div>
      <ErrorBanner />
      <div className="min-h-0 flex-1 overflow-auto text-sm">
        {node?.type === NODE_TYPE.NAMESPACE ? (
          <NamespaceForm key={node.id} nodeId={node.id} />
        ) : node ? (
          <BridgeForm key={node.id} nodeId={node.id} />
        ) : linkId ? (
          <LinkForm key={linkId} linkId={linkId} />
        ) : count > 1 ? (
          <div className="p-3">
            <p className="font-semibold">{multiSelectText(count)}</p>
            <p className="text-xs text-ink-muted">{MULTI_SELECT_HINT}</p>
          </div>
        ) : (
          <div>
            <Section title={BRIDGE_LINK_GROUP_TITLE.LAB}>
              <div className="px-3 pb-3">
                <LabNameField />
              </div>
            </Section>
            <Section title={BRIDGE_LINK_GROUP_TITLE.SUMMARY}>
              <LabSummary />
            </Section>
            <p className="border-t border-rule p-3 text-xs text-ink-muted">
              {NO_SELECTION_HINT}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
