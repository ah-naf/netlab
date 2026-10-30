import type { NodeType, Role } from "./topology";

export type PaletteKind = Role | "namespace" | "veth" | "bridge";

export interface PaletteCreate {
  type: NodeType;
  role?: Role;
}

export interface PaletteEntry {
  id: PaletteKind;
  label: string;
  description: string;
  create: PaletteCreate | null;
  available: boolean;
}
