---

description: "Task list for the Health Endpoint and API Client"
---

# Tasks: Health Endpoint and API Client

**Input**: Design documents from `/specs/005-health-and-client/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/health-api.md, quickstart.md

**Tests**: None. The constitution says no tests are written. Each story is checked by hand with `quickstart.md`.

**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 to US3, matching the stories in `spec.md`

## Rules for every task

- Go: standard library only, no new dependencies. Web: native `fetch`, no new dependencies.
- No magic strings: route path, header names, error codes, error kinds, labels, interval, and timeout are named constants. Keep functions short.
- Every error answer uses `{ "error": { "code", "message", "resource", "details" } }`.
- No privileged code. No tests.

## Phase 1: Setup

- [X] T001 Add to `.env.example`: a commented line `# Web client settings (read at build time, visible to the browser)`, then `VITE_API_BASE_URL=` (empty means use the Vite proxy) and `VITE_API_TOKEN=` (empty means no token header)

---

## Phase 2: Foundational

**Purpose**: Named constants and shared types used by every story.

- [X] T002 Create `api/internal/api/constants.go` with: `HealthPath = "/api/v1/health"`, `RequestIDHeader = "X-Request-ID"`, `maxRequestIDLength = 64`, `requestIDBytes = 16`, `contentTypeHeader = "Content-Type"`, `contentTypeJSON = "application/json"`, `statusOK = "ok"`, error codes `codeNotFound = "not_found"`, `codeMethodNotAllowed = "method_not_allowed"`, `codeInternal = "internal"`, and the messages `messageNotFound = "route not found"` and `messageMethodNotAllowed = "method not allowed"`
- [X] T003 [P] Create `web/src/constants/api.ts` exporting: `API_BASE_URL` (`import.meta.env.VITE_API_BASE_URL ?? ""`), `API_TOKEN` (`import.meta.env.VITE_API_TOKEN ?? ""`), `HEALTH_PATH = "/api/v1/health"`, `AUTHORIZATION_HEADER = "Authorization"`, `CONTENT_TYPE_HEADER = "Content-Type"`, `JSON_CONTENT_TYPE = "application/json"`, `HEALTH_POLL_MS = 5000`, `REQUEST_TIMEOUT_MS = 3000`, `ERROR_KIND = { SERVER: "server", NETWORK: "network" } as const`, `UNKNOWN_ERROR_CODE = "unknown"`, `GENERIC_ERROR_MESSAGE = "request failed"`, `NETWORK_ERROR_MESSAGE = "cannot reach the server"`
- [X] T004 [P] Create `web/src/types/health.ts` with `export type Health = { status: string; version: string; workerReachable: boolean }` and `export type ConnectionState = "checking" | "online" | "online-worker-offline" | "offline"`

---

## Phase 3: User Story 1 - Ask the server if it is alive (Priority: P1) 🎯 MVP

**Goal**: `GET /api/v1/health` answers with status, version, and worker reachability; every answer has a request id; every error is JSON.

**Independent Test**: Quickstart sections 1 and 2.

### Implementation for User Story 1

- [X] T005 [US1] Create `api/internal/api/response.go` with `type errorBody struct { Code string `json:"code"`; Message string `json:"message"`; Resource string `json:"resource,omitempty"`; Details any `json:"details,omitempty"` }`, `writeJSON(w http.ResponseWriter, status int, body any)` (sets `Content-Type` to `application/json`, writes the status, encodes the body) and `writeError(w http.ResponseWriter, status int, code, message, resource string)` that writes `{ "error": errorBody }`
- [X] T006 [US1] Create `api/internal/api/middleware.go` with `withRequestID(next http.Handler) http.Handler` (reuse the `X-Request-ID` request header when it is non-empty and at most 64 characters, otherwise generate `requestIDBytes` random bytes from `crypto/rand` hex encoded; set the header on the response and store the id in the request context via an unexported context key type) and `withRequestLog(next http.Handler) http.Handler` (wrap the writer to record the status, then log one `slog.Info` line with `method`, `path`, `status`, `duration`, and `requestId` after the handler returns)
- [X] T007 [US1] Create `api/internal/api/health.go` with `type healthAnswer struct { Status string `json:"status"`; Version string `json:"version"`; WorkerReachable bool `json:"workerReachable"` }` and `healthHandler(version string, workerReachable func() bool) http.HandlerFunc` that returns 405 through `writeError` for any method other than GET and otherwise writes 200 with `healthAnswer{statusOK, version, workerReachable()}`
- [X] T008 [US1] Create `api/internal/api/handler.go` with `NewHandler(version string, workerReachable func() bool) http.Handler`: a new `http.ServeMux` with `HealthPath` bound to `healthHandler` and `/` bound to a handler that calls `writeError(w, http.StatusNotFound, codeNotFound, messageNotFound, r.URL.Path)`; return it wrapped as `withRequestID(withRequestLog(mux))` (request id first so the log can read it)
- [X] T009 [US1] Update `api/cmd/api/main.go`: add `var version = "dev"` (named constant `defaultVersion` for the value, overridable with `-ldflags "-X main.version=..."`), add `func workerNotBuilt() bool { return false }`, and use `api.NewHandler(version, workerNotBuilt)` as the server handler instead of `http.NewServeMux()` (import `netlab/api/internal/api`); keep the existing graceful shutdown
- [X] T010 [US1] Run `gofmt -l api` (no output) and `go vet ./...` in `api/`, then quickstart sections 1 and 2 (health answer with request id and log line, echoed id, JSON 404 and 405, exit status 0 on Ctrl+C) and fix until they match

**Checkpoint**: The health endpoint works with JSON errors and request ids.

---

## Phase 4: User Story 2 - One reliable way for the web app to call the server (Priority: P1)

**Goal**: One client and one error type for all failures.

**Independent Test**: Quickstart sections 3 and 5.

### Implementation for User Story 2

- [X] T011 [US2] Create `web/src/api/ApiError.ts` with `class ApiError extends Error` holding `kind` (`"server"` or `"network"`), `status` (number, 0 for network), `code` (string), `resource?`, `details?`; add `static network(): ApiError` (kind network, status 0, code `UNKNOWN_ERROR_CODE`, message `NETWORK_ERROR_MESSAGE`) and `static async fromResponse(response: Response): Promise<ApiError>` that reads `response.json()` in a try/catch and uses `body.error.code`, `message`, `resource`, `details` when `body.error` is an object, otherwise status with `UNKNOWN_ERROR_CODE` and `GENERIC_ERROR_MESSAGE` (covers "error answer that is not in the standard format" and non-JSON bodies)
- [X] T012 [US2] Create `web/src/api/client.ts` with one private `request<T>(method, path, body?)` that builds the URL as `API_BASE_URL + path`, sets `Content-Type` to JSON when there is a body and `Authorization: Bearer <API_TOKEN>` only when `API_TOKEN` is not empty, calls `fetch` with `AbortSignal.timeout(REQUEST_TIMEOUT_MS)`, turns a thrown fetch or timeout into `ApiError.network()`, throws `await ApiError.fromResponse(response)` when `!response.ok`, and otherwise returns `response.json()`; export `apiClient = { get, post, put, delete }` where `delete` is a property name only
- [X] T013 [P] [US2] Create `web/src/api/health.ts` with `export const getHealth = () => apiClient.get<Health>(HEALTH_PATH)`
- [X] T014 [US2] Run `make lint` in the repository root (fix any ESLint or Prettier issue), then quickstart sections 3 and 5 in the browser (typed health data, `server`/404/`not_found` error, `network` error when the API is stopped, bearer header with a test token) and fix until they match

**Checkpoint**: The client returns data or throws one error type.

---

## Phase 5: User Story 3 - See whether the server is online (Priority: P2)

**Goal**: A header indicator with four states that updates by itself.

**Independent Test**: Quickstart section 4.

### Implementation for User Story 3

- [ ] T015 [US3] Create `web/src/hooks/useConnectionState.ts` exporting `useConnectionState(): ConnectionState`: state starts `"checking"`; an effect runs a loop that awaits `getHealth()`, maps the result (`workerReachable` true → `"online"`, false → `"online-worker-offline"`, any thrown error → `"offline"`), then waits `HEALTH_POLL_MS` with `setTimeout` before the next check (so checks never overlap); the effect cleanup clears the timer and stops the loop
- [ ] T016 [P] [US3] Create `web/src/components/ConnectionIndicator.tsx` with a labels map `CONNECTION_LABELS: Record<ConnectionState, string>` = `{ checking: "Checking API", online: "API online", "online-worker-offline": "API online, worker offline", offline: "API offline" }` and a component that calls `useConnectionState()` and renders a coloured dot (Tailwind classes: gray, green, amber, red for the four states) and the label
- [ ] T017 [US3] Update `web/src/App.tsx` to render a header bar containing the text `NetLab` and `<ConnectionIndicator />` (Tailwind classes for a simple top bar), with an empty main area below
- [ ] T018 [US3] Run quickstart section 4 (first "Checking API", then "API online, worker offline"; stop the API and see "API offline" within 10 seconds; start it and see the online state again within 10 seconds with no reload) and fix until it matches

**Checkpoint**: The indicator works in the browser.

---

## Final Phase: Polish

- [ ] T019 Run `make lint` and `make build` from the repository root and fix any failure; delete `web/.env.local` and `web/dist` if they exist
- [ ] T020 Run all six quickstart sections in order and report which passed; confirm no API or Vite process is left running (`pgrep -af 'api|vite'`)

---

## Dependencies & Execution Order

- T001 any time. T002 blocks the Go tasks; T003 and T004 block the web tasks. T003 and T004 are independent of T002, so all three can run together.
- US1 (T005 to T010) needs T002. T005 first; T006 and T007 can run together after it; T008 needs T005 to T007; T009 needs T008.
- US2 (T011 to T014) needs T003 and T004. It does not need US1 to be written, but T014 needs the API running (US1 done).
- US3 (T015 to T018) needs US2 (`getHealth`) and T003, T004.
- Polish after all stories.

## Parallel Example

After Phase 1: T002, T003, T004 together. In US1: T006 and T007 together. US1 and US2 code can be written in parallel because they live in different folders (`api/` and `web/`).

## Implementation Strategy

- **MVP**: Phase 1, Phase 2, and User Story 1 (T001 to T010): a working health endpoint with JSON errors and request ids.
- Then US2 (client), then US3 (indicator), then Polish.
