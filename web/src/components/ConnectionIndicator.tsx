import { CONNECTION_STATE } from "../constants/api";
import { useConnectionState } from "../hooks/useConnectionState";
import type { ConnectionState } from "../types/health";

export const CONNECTION_LABELS: Record<ConnectionState, string> = {
  [CONNECTION_STATE.CHECKING]: "Checking API",
  [CONNECTION_STATE.ONLINE]: "API online",
  [CONNECTION_STATE.ONLINE_WORKER_OFFLINE]: "API online, worker offline",
  [CONNECTION_STATE.OFFLINE]: "API offline",
};

const DOT_COLORS: Record<ConnectionState, string> = {
  [CONNECTION_STATE.CHECKING]: "bg-gray-400",
  [CONNECTION_STATE.ONLINE]: "bg-green-500",
  [CONNECTION_STATE.ONLINE_WORKER_OFFLINE]: "bg-amber-500",
  [CONNECTION_STATE.OFFLINE]: "bg-red-500",
};

export default function ConnectionIndicator() {
  const state = useConnectionState();
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[state]}`} />
      <span>{CONNECTION_LABELS[state]}</span>
    </div>
  );
}
