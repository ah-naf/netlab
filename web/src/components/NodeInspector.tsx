import { useShallow } from "zustand/react/shallow";
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
    s.document.nodes.find((n) => n.id === s.selectedNodeId),
  );
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
        ) : (
          <p className="p-3 text-xs text-ink-muted">{NO_SELECTION_HINT}</p>
        )}
      </div>
    </aside>
  );
}
