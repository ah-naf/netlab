import type { NODE_STATUS } from "../constants/topology";
import type { Severity } from "./validation";

export type NodeStatus = (typeof NODE_STATUS)[keyof typeof NODE_STATUS];

/** Canvas nodes carry only the status; lab data is read from the store by id. */
export interface FlowNodeData extends Record<string, unknown> {
  status: NodeStatus;
  issue?: Severity;
}
