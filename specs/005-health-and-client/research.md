# Research: Health Endpoint and API Client

No open unknowns.

## Routing

- **Decision**: Standard library `http.ServeMux`. Register `/api/v1/health` (the handler itself answers 405 JSON for other methods) and `/` as a JSON 404 fallback.
- **Rationale**: Go 1.22+ patterns are enough, and the built-in 405 text answer would break the "every error is JSON" rule, so the method check lives in the handler.
- **Alternatives considered**: A router library (not needed for one route).

## Request id

- **Decision**: Header `X-Request-ID`. If the caller sends a value of at most 64 characters, reuse it. Otherwise make 16 random bytes from `crypto/rand`, hex encoded. Set the header on every answer and put the id in the log line.
- **Rationale**: Standard header name, no dependency, safe length bound (edge case: very long ids).
- **Alternatives considered**: UUID library (extra dependency for no gain).

## Logging

- **Decision**: `log/slog` text handler. One line per request: method, path, status, duration, request id. A tiny response wrapper records the status.
- **Rationale**: Standard library, structured fields, satisfies SC-003.

## Error shape

- **Decision**: `{ "error": { "code", "message", "resource", "details" } }` (decision 10). `resource` and `details` are omitted when empty. Codes are constants: `not_found`, `method_not_allowed`, `internal`.
- **Rationale**: Matches `docs/decisions.md`. Same shape is used by every later route.

## Version

- **Decision**: A package variable `version` in `cmd/api`, default `"dev"`, set at build time with `-ldflags "-X main.version=<value>"`.
- **Rationale**: Standard Go practice, one place, no file to keep in sync.

## Worker reachability

- **Decision**: The health handler receives a `workerReachable func() bool`. `main` passes a function that returns false (`workerNotBuilt`) until NL-032.
- **Rationale**: One seam for the future worker client, no placeholder logic inside the handler.

## Graceful shutdown

- **Decision**: Keep the existing `Server.Shutdown` in `cmd/api/main.go`. It already lets running requests finish and exits 0 on interrupt.
- **Rationale**: FR-006 is already satisfied; only the handler changes.

## Web client

- **Decision**: Native `fetch` with `AbortSignal.timeout` for the 3 s limit. Methods `get`, `post`, `put`, `delete` share one `request` function. The token is sent as `Authorization: Bearer <token>` when `VITE_API_TOKEN` is set. The base address is `VITE_API_BASE_URL`, default empty so requests use the Vite proxy.
- **Rationale**: No dependency, one place for headers and errors.
- **Alternatives considered**: axios (extra dependency).

## One error type

- **Decision**: `ApiError` with `kind` (`server` or `network`), `status`, `code`, `message`, `resource`, `details`. `fromResponse` reads the standard body and falls back to the status and a generic message when the body is not in the standard shape or not JSON. A thrown `fetch` or timeout becomes `kind: network`.
- **Rationale**: Covers all three failure types (FR-008, FR-009).

## Polling

- **Decision**: A hook `useConnectionState` runs a `setTimeout` loop (next check 5 s after the previous one finishes), so checks never overlap. State: `checking` first, then `online`, `online-worker-offline`, or `offline`. The loop stops on unmount.
- **Rationale**: Simple, no overlap by design (FR-011).

## Token in the browser

- **Decision**: `VITE_API_TOKEN` is read at build time and is visible to the browser. Acceptable for a single-user local app. NL-042 decides the real flow.
- **Rationale**: Matches decision 1 (one static token). Documented in `.env.example`.
