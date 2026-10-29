export type Health = {
  status: string;
  version: string;
  workerReachable: boolean;
};

export type ConnectionState =
  "checking" | "online" | "online-worker-offline" | "offline";
