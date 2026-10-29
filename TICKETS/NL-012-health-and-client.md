# NL-012: Health endpoint and API client

- Milestone: 1
- Depends on: NL-010
- Size: S

## Scope
- Go: `GET /api/v1/health` returning `{ status, version, workerReachable }` (worker reachability is `false` until NL-032). Router, JSON helpers, structured error type, request id middleware, graceful shutdown.
- TS: typed `apiClient` with `get/post/put/delete`, base URL config, token header, and an `ApiError` class mapped from the standard error format. Network failures become a distinct error kind.
- Connection indicator in the toolbar uses health polling.

## Acceptance
- `curl localhost:PORT/api/v1/health` returns 200 JSON.
- Go handler test and a Vitest test of `ApiError` mapping (4xx body, 5xx body, network failure).
- Toolbar shows "API offline" when the server is stopped and "API online" when started.
