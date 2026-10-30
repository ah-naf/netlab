import {
  INTERFACE_NAME_PREFIX,
  INTERFACE_NAME_START,
} from "../constants/topology";
import type { Document, Node } from "../types/topology";

/** Prefix plus the smallest free number on the node: eth0, eth1, ... */
export function nextInterfaceName(document: Document, node: Node): string {
  const prefix = INTERFACE_NAME_PREFIX[node.type];
  const used = new Set(
    document.interfaces.filter((i) => i.nodeId === node.id).map((i) => i.name),
  );
  let number = INTERFACE_NAME_START[node.type];
  while (used.has(`${prefix}${number}`)) number++;
  return `${prefix}${number}`;
}
