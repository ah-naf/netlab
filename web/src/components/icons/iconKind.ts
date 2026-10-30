import type { PaletteKind } from "../../types/palette";
import type { Node } from "../../types/topology";

/** Namespace with no role has its own icon; roles and bridges map to their kind. */
export const iconKindOf = (node: Node): PaletteKind =>
  node.type === "bridge" ? "bridge" : (node.role ?? "namespace");
