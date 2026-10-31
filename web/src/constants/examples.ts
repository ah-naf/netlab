import bridgeLab from "../../../examples/bridge-lab.json?raw";
import directLink from "../../../examples/direct-link.json?raw";
import routerLab from "../../../examples/router-two-subnets.json?raw";
import type { LabExample } from "../types/labFile";
import { NEEDS_M5_FILES } from "./labFile";

const example = (
  file: string,
  label: string,
  description: string,
  text: string,
): LabExample => ({
  id: file,
  label,
  description,
  needsM5: NEEDS_M5_FILES.includes(file),
  text,
});

export const EXAMPLES: readonly LabExample[] = [
  example(
    "bridge-lab.json",
    "Bridge lab",
    "Two namespaces on one bridge",
    bridgeLab,
  ),
  example(
    "direct-link.json",
    "Direct link",
    "Two namespaces joined by one link",
    directLink,
  ),
  example(
    "router-two-subnets.json",
    "Router between two subnets",
    "A router joins two subnets",
    routerLab,
  ),
];
