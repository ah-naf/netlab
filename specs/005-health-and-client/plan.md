# Implementation Plan: Health Endpoint and API Client

**Branch**: `005-health-and-client` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-health-and-client/spec.md`

## Summary

Add the first real API route, `GET /api/v1/health`, with the shared plumbing every later route needs: JSON helpers, one standard error shape, a request id on every answer and log line, and a JSON 404. On the web side add one shared API client with one error type, a polling hook, and a small indicator in the app header with four states (checking, online, online with worker offline, offline). No tests (constitution).

## Technical Context

**Language/Version**: Go 1.26 (standard library only: `net/http`, `log/slog`, `crypto/rand`); TypeScript 6 with React 19 (native `fetch`)

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: None, per the constitution. Verified by running the server, `curl`, and the browser by hand (see [quickstart.md](quickstart.md)).

**Target Platform**: Linux dev machine; modern browser

**Project Type**: Web application

**Performance Goals**: Health answers in under 100 ms (SC-001). Indicator updates within 10 seconds (SC-004).

**Constraints**: Check interval 5 s and timeout 3 s are named constants. Only one health check runs at a time. No magic strings: paths, header names, error codes, and error kinds are constants. Health needs no token.

**Scale/Scope**: 1 route, 1 middleware pair, 5 small Go files, 6 small TypeScript files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. |
| II. Simple, concise code | Pass. Standard library only. The client is one small file. |
| III. Small, reusable functions | Pass. Helpers (`writeJSON`, `writeError`, `requestID`) are reused by every later route. |
| IV. No magic strings | Pass. Route path, header names, error codes, error kinds, interval, and timeout are named constants on both sides. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Go in `api/internal/api/`, web code in `web/src/{api,hooks,components,constants,types}`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. Worker reachability is a constant false for now. |
| No tests | Pass. |

Post-design re-check: no change. No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/005-health-and-client/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── health-api.md
└── tasks.md             # created later by /speckit-tasks
```

### Source Code (repository root)

```text
api/
├── cmd/api/main.go                  # uses the new handler, adds version
└── internal/api/
    ├── doc.go                       # exists
    ├── constants.go                 # route path, header, error codes, status text
    ├── handler.go                   # NewHandler: mux, health, not found, middleware
    ├── health.go                    # health handler
    ├── response.go                  # writeJSON, writeError
    └── middleware.go                # request id, request log
web/src/
├── constants/api.ts                 # base URL, token, paths, header names, intervals, kinds
├── types/health.ts                  # Health, ConnectionState
├── api/
│   ├── ApiError.ts                  # the one error type
│   ├── client.ts                    # get, post, put, delete
│   └── health.ts                    # getHealth
├── hooks/useConnectionState.ts      # polling hook
├── components/ConnectionIndicator.tsx
└── App.tsx                          # header with the indicator
.env.example                         # adds VITE_API_BASE_URL, VITE_API_TOKEN
```

**Structure Decision**: Put all HTTP plumbing in `api/internal/api` so later routes only add handlers. Keep the web client in `web/src/api` with constants in one file.

## Complexity Tracking

No constitution violations to justify.
