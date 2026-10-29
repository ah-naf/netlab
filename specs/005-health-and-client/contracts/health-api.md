# Contract: Health Endpoint and Client

## `GET /api/v1/health`

- No token needed.
- 200, `Content-Type: application/json`: `{ "status": "ok", "version": "dev", "workerReachable": false }`.
- Any other method: 405 with the standard error body (`method_not_allowed`).

## Fallback

Any other path: 404 with the standard error body (`not_found`, `resource` set to the requested path).

## Common to every answer

- Header `X-Request-ID` (see data-model.md).
- Errors use `{ "error": { "code", "message", "resource", "details" } }`.
- One log line per request with method, path, status, duration, and the request id.

## Go API (`internal/api`)

```go
func NewHandler(version string, workerReachable func() bool) http.Handler
```

Internal helpers reused by later routes: `writeJSON(w, status, body)` and `writeError(w, status, code, message, resource)`.

## Web client (`web/src/api`)

```ts
apiClient.get<T>(path): Promise<T>
apiClient.post<T>(path, body?): Promise<T>
apiClient.put<T>(path, body?): Promise<T>
apiClient.delete<T>(path): Promise<T>
getHealth(): Promise<Health>
class ApiError extends Error { kind: "server" | "network"; status; code; message; resource?; details? }
```

All client failures throw `ApiError`. The token goes in `Authorization: Bearer <token>` when `VITE_API_TOKEN` is set.

## Settings

| Name | Read by | Default |
|---|---|---|
| `VITE_API_BASE_URL` | web client | empty (use the Vite proxy) |
| `VITE_API_TOKEN` | web client | empty (no header) |
| `NETLAB_API_ADDR` | API | `:8080` (unchanged) |

## Indicator

`ConnectionIndicator` shows the label for the current state (see data-model.md) in the app header.
