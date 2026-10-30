import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ACTION_LABEL, NO_ROUTES_TEXT } from "../../constants/inspector";
import { isDefaultRoute } from "../../store/namespaceOps";
import { useTopologyStore } from "../../store/topologyStore";
import ActionButton from "../nodes/ActionButton";
import NewRouteRow from "./NewRouteRow";
import RouteRow from "./RouteRow";

export default function RoutesTable({ nodeId }: { nodeId: string }) {
  const [adding, setAdding] = useState(false);
  const routes = useTopologyStore(
    useShallow(
      (s) =>
        s.document.nodes
          .find((n) => n.id === nodeId)
          ?.routes?.filter((r) => !isDefaultRoute(r)) ?? [],
    ),
  );

  return (
    <div>
      {!routes.length && !adding && (
        <p className="px-3 py-1 text-xs text-ink-muted">{NO_ROUTES_TEXT}</p>
      )}
      {routes.map((route, index) => (
        <RouteRow key={index} nodeId={nodeId} index={index} route={route} />
      ))}
      {adding ? (
        <NewRouteRow nodeId={nodeId} onDone={() => setAdding(false)} />
      ) : (
        <ActionButton
          onClick={() => setAdding(true)}
          className="w-full border-t border-rule px-3 py-1 text-left"
        >
          + {ACTION_LABEL.ADD_ROUTE}
        </ActionButton>
      )}
    </div>
  );
}
