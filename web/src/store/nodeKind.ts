import { NODE_TYPE } from "../constants/topology";
import type { PaletteKind } from "../types/palette";
import type { Node } from "../types/topology";

/** Bridges and roles map to their own kind; a namespace with no role is "namespace". */
export const nodeKindOf = (node: Node): PaletteKind =>
  node.type === NODE_TYPE.BRIDGE ? "bridge" : (node.role ?? "namespace");
