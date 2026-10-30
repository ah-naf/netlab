import { useCallback, useMemo, useState } from "react";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type FinalConnectionState,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PALETTE_DRAG_TYPE } from "../constants/palette";
import type { PaletteKind } from "../types/palette";
import { CANVAS_LABEL } from "../constants/layout";
import { NODE_TYPE } from "../constants/topology";
import { endOf, endsOf } from "../store/linkEnds";
import { checkConnection } from "../store/linkRules";
import { toFlowEdges, toFlowNodes } from "../store/toFlow";
import { useTopologyStore } from "../store/topologyStore";
import LinkNotice from "./LinkNotice";
import BridgeNode from "./nodes/BridgeNode";
import NamespaceNode from "./nodes/NamespaceNode";

/** Middle and right mouse buttons pan; left drag draws a selection box. */
const PAN_BUTTONS = [1, 2];

const NODE_TYPES: NodeTypes = {
  [NODE_TYPE.NAMESPACE]: NamespaceNode,
  [NODE_TYPE.BRIDGE]: BridgeNode,
};

export default function Canvas({ className = "" }: { className?: string }) {
  return (
    <ReactFlowProvider>
      <CanvasView className={className} />
    </ReactFlowProvider>
  );
}

function CanvasView({ className }: { className: string }) {
  const document = useTopologyStore((s) => s.document);
  const selectedNodeIds = useTopologyStore((s) => s.selectedNodeIds);
  const { beginDrag, moveNode, endDrag } = useTopologyStore.getState();
  const { screenToFlowPosition } = useReactFlow();
  const [notice, setNotice] = useState("");
  const clearNotice = useCallback(() => setNotice(""), []);
  const isValidConnection = (c: Connection | Edge) =>
    checkConnection(useTopologyStore.getState().document, ...endsOf(c)).ok;
  const showRejection = (_: unknown, state: FinalConnectionState) => {
    const { fromNode, fromHandle, toNode, toHandle } = state;
    if (state.isValid || !fromNode || !fromHandle || !toNode || !toHandle)
      return;
    const check = checkConnection(
      useTopologyStore.getState().document,
      endOf(fromNode.id, fromHandle.id),
      endOf(toNode.id, toHandle.id),
    );
    if (!check.ok) setNotice(check.reason);
  };
  const connect = (c: Connection) => {
    setNotice("");
    useTopologyStore.getState().connect(...endsOf(c));
  };
  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };
  const dropPart = (event: React.DragEvent) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData(PALETTE_DRAG_TYPE);
    if (!kind) return;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    useTopologyStore.getState().createNode(kind as PaletteKind, position);
  };
  const handleChanges = (changes: NodeChange[]) => {
    const picked = changes.filter((c) => c.type === "select");
    if (picked.length) {
      const ids = new Set(useTopologyStore.getState().selectedNodeIds);
      picked.forEach((c) => (c.selected ? ids.add(c.id) : ids.delete(c.id)));
      useTopologyStore.getState().setSelection([...ids]);
    }
    changes.forEach((c) => {
      if (c.type === "position" && c.position) moveNode(c.id, c.position);
    });
  };
  const nodes = useMemo(
    () =>
      toFlowNodes(document).map((n) => ({
        ...n,
        selected: selectedNodeIds.includes(n.id),
      })),
    [document, selectedNodeIds],
  );
  const edges = useMemo(() => toFlowEdges(document), [document]);

  return (
    <main
      aria-label={CANVAS_LABEL}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {CANVAS_LABEL}
      </div>
      <div
        className="relative min-h-0 flex-1"
        onDragOver={allowDrop}
        onDrop={dropPart}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={handleChanges}
          connectionMode={ConnectionMode.Loose}
          onConnect={connect}
          isValidConnection={isValidConnection}
          onConnectEnd={showRejection}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeDragStart={beginDrag}
          onNodeDragStop={endDrag}
          selectionOnDrag
          panOnDrag={PAN_BUTTONS}
          multiSelectionKeyCode="Shift"
          deleteKeyCode={null}
        >
          <Background />
        </ReactFlow>
        <LinkNotice message={notice} onDismiss={clearNotice} />
      </div>
    </main>
  );
}
