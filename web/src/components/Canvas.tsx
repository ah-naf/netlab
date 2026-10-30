import { useMemo } from "react";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CANVAS_LABEL } from "../constants/layout";
import { NODE_TYPE } from "../constants/topology";
import { toFlowEdges, toFlowNodes } from "../store/toFlow";
import { useTopologyStore } from "../store/topologyStore";
import BridgeNode from "./nodes/BridgeNode";
import NamespaceNode from "./nodes/NamespaceNode";

const NODE_TYPES: NodeTypes = {
  [NODE_TYPE.NAMESPACE]: NamespaceNode,
  [NODE_TYPE.BRIDGE]: BridgeNode,
};

export default function Canvas({ className = "" }: { className?: string }) {
  const document = useTopologyStore((s) => s.document);
  const selectNode = useTopologyStore((s) => s.selectNode);
  const nodes = useMemo(() => toFlowNodes(document), [document]);
  const edges = useMemo(() => toFlowEdges(document), [document]);

  return (
    <main
      aria-label={CANVAS_LABEL}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {CANVAS_LABEL}
      </div>
      <div className="min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          connectionMode={ConnectionMode.Loose}
          nodesConnectable={false}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => selectNode(node.id)}
          onPaneClick={() => selectNode(null)}
        >
          <Background />
        </ReactFlow>
      </div>
    </main>
  );
}
