# NL-010: Repo scaffold

- Milestone: 1
- Depends on: none (can start in parallel with NL-000)
- Size: S

## Goal
Create the repository structure so frontend and backend build and run empty.

## Scope
- `web/`: Vite, React, TypeScript, Tailwind, Vitest, ESLint, Prettier. Packages: `@xyflow/react`, `zustand`.
- `api/`: Go module with `cmd/api`, `cmd/worker`, and packages `internal/{api,topology,engine,worker,observer,capture,events,store,sandbox,audit}` (empty packages contain a `doc.go`).
- Root `Makefile`: `make dev-web`, `make dev-api`, `make test-web`, `make test-api`, `make build`, `make lint`.
- `.env.example`, `.gitignore` (includes `.sandbox/`, `data/`, `node_modules/`), `docs/`, `examples/`.
- Vite dev proxy to the API on `/api` and `/ws`.

## Acceptance
- `make test-web` and `make test-api` pass (with a trivial test in each).
- `make dev-web` serves a blank React page; `make dev-api` starts and exits cleanly on SIGINT.
- No privileged code exists yet, and `make` targets never use sudo.
