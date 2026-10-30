import { ADD_LABEL } from "../../constants/topology";
import { useTopologyStore } from "../../store/topologyStore";
import type { Node } from "../../types/topology";
import ActionButton from "./ActionButton";

export default function AddInterfaceButton({ node }: { node: Node }) {
  const addInterface = useTopologyStore((s) => s.addInterface);
  return (
    <ActionButton
      onClick={() => addInterface(node.id)}
      className="w-full border-t border-rule px-3 py-1 text-left"
    >
      + {ADD_LABEL[node.type]}
    </ActionButton>
  );
}
