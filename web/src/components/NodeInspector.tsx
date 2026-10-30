import { useShallow } from "zustand/react/shallow";
import { LINK_SELECTED_HINT, linkLabel } from "../constants/links";
import { MULTI_SELECT_HINT, multiSelectText } from "../constants/palette";
import { REGION } from "../constants/layout";
import { NO_SELECTION_HINT } from "../constants/topology";
import { interfacesOf, useTopologyStore } from "../store/topologyStore";
import AddInterfaceButton from "./nodes/AddInterfaceButton";
import { InterfaceLabel, RemoveInterfaceButton } from "./nodes/InterfaceRow";

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
  const linkText = useTopologyStore((s) => {
    const link = s.document.links.find((l) => l.id === s.selectedLinkId);
    const name = (id: string) =>
      s.document.interfaces.find((i) => i.id === id)?.name ?? "";
    return link
      ? linkLabel(name(link.endpointA), name(link.endpointB), link.mtu)
      : "";
  });
  const count = useTopologyStore((s) => s.selectedNodeIds.length);
  const items = useTopologyStore(
    useShallow((s) => (node ? interfacesOf(s.document, node.id) : [])),
  );

  return (
    <aside
      aria-label={REGION.INSPECTOR.label}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {REGION.INSPECTOR.label}
      </div>
      <div className="min-h-0 flex-1 overflow-auto text-sm">
        {node ? (
          <>
            <div className="px-3 py-2">
              <div className="truncate font-semibold" title={node.name}>
                {node.name}
              </div>
              <div className="text-xs text-ink-muted">{node.type}</div>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 border-t border-rule px-3 py-1 text-xs"
              >
                <InterfaceLabel item={item} />
                <RemoveInterfaceButton nodeName={node.name} item={item} />
              </div>
            ))}
            <AddInterfaceButton node={node} />
          </>
        ) : linkText ? (
          <div className="p-3">
            <p className="font-semibold">{linkText}</p>
            <p className="text-xs text-ink-muted">{LINK_SELECTED_HINT}</p>
          </div>
        ) : count > 1 ? (
          <div className="p-3">
            <p className="font-semibold">{multiSelectText(count)}</p>
            <p className="text-xs text-ink-muted">{MULTI_SELECT_HINT}</p>
          </div>
        ) : (
          <p className="p-3 text-xs text-ink-muted">{NO_SELECTION_HINT}</p>
        )}
      </div>
    </aside>
  );
}
