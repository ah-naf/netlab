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
  [CONNECTION_STATE.CHECKING]: "bg-led-off",
  [CONNECTION_STATE.ONLINE]: "bg-led-ok",
  [CONNECTION_STATE.ONLINE_WORKER_OFFLINE]: "bg-led-warn",
  [CONNECTION_STATE.OFFLINE]: "bg-led-fault",
};

export default function ConnectionIndicator() {
  const state = useConnectionState();
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/20 ${DOT_COLORS[state]}`}
      />
      <span>{CONNECTION_LABELS[state]}</span>
    </div>
  );
}
