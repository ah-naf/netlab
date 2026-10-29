# Research: Repository Scaffold

No open unknowns. Versions below were read from the npm registry on 2026-10-29.

## Frontend toolchain

- **Decision**: Vite 8, React 19, TypeScript, Tailwind CSS 4 through the `@tailwindcss/vite` plugin, `@xyflow/react` 12, `zustand`, ESLint flat config with `typescript-eslint` and `eslint-plugin-react-hooks`, Prettier. No Vitest (constitution).
- **Rationale**: Matches `docs/decisions.md` and the draft. Tailwind 4 needs no config file: one `@import "tailwindcss"` line in `src/index.css`.
- **Alternatives considered**: Create React App (deprecated), Next.js (server rendering not needed), Tailwind 3 with PostCSS config (more files).

## Package manager

- **Decision**: npm (already installed, Node 22 / npm 10).
- **Rationale**: Zero extra setup. A `package-lock.json` pins versions.
- **Alternatives considered**: pnpm or yarn (extra install for no gain here).

## Ports and proxy

- **Decision**: Backend listens on `:8080` (setting `NETLAB_API_ADDR`). Vite dev server uses its default `5173`. The Vite proxy sends `/api` (HTTP) and `/ws` (WebSocket, `ws: true`) to `http://localhost:8080`. The target comes from one constant in `vite.config.ts`.
- **Rationale**: Conventional defaults, one place to change.
- **Alternatives considered**: Reading the proxy target from env (more moving parts for v1).

## Backend entry points

- **Decision**: `cmd/api/main.go` starts a `net/http` server on `NETLAB_API_ADDR` (default `:8080`) with an empty mux, and shuts down gracefully on SIGINT/SIGTERM using `signal.NotifyContext` and `Server.Shutdown`. `cmd/worker/main.go` calls `sandbox.RequireSandbox()`, exits 1 with the error if refused, otherwise prints `worker not implemented yet (NL-032)` and exits 0.
- **Rationale**: Smallest code that satisfies "starts, stays running, exits cleanly". Standard library only. The worker stub keeps `make sandbox-worker` safe once `api/cmd/worker` exists.
- **Alternatives considered**: A router library (not needed yet, health route arrives with NL-012).

## Lint and format

- **Decision**: Frontend `npm run lint` (ESLint) and `npm run format` (Prettier write) / `format:check`. Backend `gofmt -l` (fails if any file listed) and `go vet ./...`. Root `make lint` runs both sides.
- **Rationale**: Standard tools, no extra dependencies on the Go side.

## Settings read by the code

| Setting | Read by | Default |
|---|---|---|
| `NETLAB_API_ADDR` | API | `:8080` |
| `NETLAB_WORKER_SOCKET` | Worker (later) and `Makefile` | `.sandbox/worker.sock` |
| `NETLAB_ALLOW_HOST` | Sandbox check | unset (disposable VM only) |

`.env.example` lists exactly these. Nothing reads a `.env` file yet; the file documents the variables.

## Empty folders

- **Decision**: Each empty Go package gets `doc.go` with `// Package <name> ...` one-line purpose. `web/src` folders that stay empty get a `.gitkeep`. `examples/` gets `.gitkeep`.
- **Rationale**: Satisfies FR-005 and keeps empty folders in git.
