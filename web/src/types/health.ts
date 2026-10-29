import type { CONNECTION_STATE } from "../constants/api";

export type Health = {
  status: string;
  version: string;
  workerReachable: boolean;
};

export type ConnectionState =
  (typeof CONNECTION_STATE)[keyof typeof CONNECTION_STATE];
