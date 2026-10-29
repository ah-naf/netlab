export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";
export const API_TOKEN: string = import.meta.env.VITE_API_TOKEN ?? "";

export const HEALTH_PATH = "/api/v1/health";

export const AUTHORIZATION_HEADER = "Authorization";
export const CONTENT_TYPE_HEADER = "Content-Type";
export const JSON_CONTENT_TYPE = "application/json";

export const HEALTH_POLL_MS = 5000;
export const REQUEST_TIMEOUT_MS = 3000;

export const ERROR_KIND = { SERVER: "server", NETWORK: "network" } as const;

export const UNKNOWN_ERROR_CODE = "unknown";
export const GENERIC_ERROR_MESSAGE = "request failed";
export const NETWORK_ERROR_MESSAGE = "cannot reach the server";
