import {
  API_BASE_URL,
  API_TOKEN,
  AUTHORIZATION_HEADER,
  CONTENT_TYPE_HEADER,
  HTTP_METHOD,
  JSON_CONTENT_TYPE,
  REQUEST_TIMEOUT_MS,
} from "../constants/api";
import { ApiError } from "./ApiError";

type Method = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

function buildHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (hasBody) headers[CONTENT_TYPE_HEADER] = JSON_CONTENT_TYPE;
  if (API_TOKEN) headers[AUTHORIZATION_HEADER] = `Bearer ${API_TOKEN}`;
  return headers;
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_BASE_URL + path, {
      method,
      headers: buildHeaders(body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw ApiError.network();
  }
  if (!response.ok) throw await ApiError.fromResponse(response);
  return response.json().catch(() => {
    throw ApiError.unexpected(response.status);
  });
}

export const apiClient = {
  get: <T>(path: string) => request<T>(HTTP_METHOD.GET, path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(HTTP_METHOD.POST, path, body),
  put: <T>(path: string, body?: unknown) =>
    request<T>(HTTP_METHOD.PUT, path, body),
  delete: <T>(path: string) => request<T>(HTTP_METHOD.DELETE, path),
};
