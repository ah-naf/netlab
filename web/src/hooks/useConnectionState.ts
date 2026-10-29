import { useEffect, useState } from "react";
import { getHealth } from "../api/health";
import { CONNECTION_STATE, HEALTH_POLL_MS } from "../constants/api";
import type { ConnectionState } from "../types/health";

async function checkConnection(): Promise<ConnectionState> {
  try {
    const health = await getHealth();
    return health.workerReachable
      ? CONNECTION_STATE.ONLINE
      : CONNECTION_STATE.ONLINE_WORKER_OFFLINE;
  } catch {
    return CONNECTION_STATE.OFFLINE;
  }
}

/** Checks the API every HEALTH_POLL_MS. The next check starts after the previous one ends, so checks never overlap. */
export function useConnectionState(): ConnectionState {
  const [state, setState] = useState<ConnectionState>(
    CONNECTION_STATE.CHECKING,
  );

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      const next = await checkConnection();
      if (stopped) return;
      setState(next);
      timer = setTimeout(poll, HEALTH_POLL_MS);
    };
    poll();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, []);

  return state;
}
