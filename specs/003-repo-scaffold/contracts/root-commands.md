# Contract: Root Commands

Run from the repository root. None uses `sudo`.

| Command | Action |
|---|---|
| `make install-web` | `npm install` in `web/` |
| `make dev-web` | Start the Vite dev server (default `http://localhost:5173`). Forwards `/api` and `/ws` to the API. |
| `make dev-api` | `go run ./cmd/api` in `api/`. Listens on `NETLAB_API_ADDR` (default `:8080`). Exits cleanly on Ctrl+C. |
| `make build` | `npm run build` in `web/`, then `go build ./...` in `api/`. |
| `make lint` | `npm run lint` and `npm run format:check` in `web/`, then `gofmt -l` (must print nothing) and `go vet ./...` in `api/`. |
| `make sandbox-shell`, `sandbox-test`, `sandbox-worker` | Unchanged from the sandbox feature. |

## Entry points

- `api/cmd/api`: starts an HTTP server on `NETLAB_API_ADDR`, exits 0 on SIGINT/SIGTERM after graceful shutdown.
- `api/cmd/worker`: calls `sandbox.RequireSandbox()`. Refused: prints the error, exit 1. Allowed: prints `worker not implemented yet (NL-032)`, exit 0.

## Dev proxy

`/api/*` and `/ws/*` on the Vite server forward to `http://localhost:8080` (WebSocket upgrade enabled for `/ws`).
