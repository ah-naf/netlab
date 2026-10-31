# Research: Milestone 1 README

All facts below were read from the repository or run on this machine on 2026-10-31.

## 1. Prerequisites
**Decision**: List `git`, `make`, `node` and `npm`, and `go` as required for Milestone 1, each with a minimum version and a check command. List `unshare`, `ip`, and `nft` as needed only for the sandbox check (later milestones deploy labs). `tcpdump` and `tc` are optional.
**Versions**: Go 1.26 (`api/go.mod` says `go 1.26`; this machine has 1.26.8). Node 22.18 or newer: Vite 8 needs Node 20.19 or 22.12 or newer, and the check scripts run `.ts` files directly, which Node 22.18 and newer do without a flag (this machine has 22.23.3). npm 10 (10.9.9 here). GNU make (4.4.1 here).
**Rationale**: `scripts/check-env.sh` requires `unshare ip nft go node` and reports `tcpdump tc`; the README's M1 list is the smaller set a reader needs to run the canvas and API. Quick start must not demand tools M1 does not use.
**Alternatives**: Copy the `check-env.sh` list as required (would block readers who only want the canvas).

## 2. Ports and addresses
**Decision**: Frontend `http://localhost:5173` (Vite default; `strictPort: true` in `web/vite.config.ts`, so a busy port stops the server with an error instead of picking another). API `:8080` by default, changeable with `NETLAB_API_ADDR` (`api/cmd/api/main.go`); the Vite dev server proxies `/api` and `/ws` to `http://localhost:8080` (hard-coded in `vite.config.ts`).
**Busy-port advice**: stop the other program, or for the frontend run `npm run dev -- --port <free port>` from `web`. Do not change the API port in M1 (the proxy target is fixed); say so.
**Rationale**: Reading these from the files avoids stale numbers.

## 3. Quick start commands (from the repo root)
1. `make install-web` (runs `npm install` in `web`).
2. Terminal 1: `make dev-api` (runs `go run ./cmd/api` in `api`).
3. Terminal 2: `make dev-web` (runs `npm run dev` in `web`).
4. Open `http://localhost:5173`.
**Expected**: empty canvas; toolbar indicator says **API online** (green) once the API answers `GET /api/v1/health`; while waiting it says "Checking API"; with no API it says "API offline" (red). When the API runs but the worker does not, it says "API online, worker offline" (amber): in M1 the worker does not exist yet, so the API reports it unreachable by design; the README must say amber is normal in M1 only if that is what the run shows (see §8).
**Rationale**: All commands exist as make targets; no flags to remember.

## 4. Frontend alone
**Decision**: The README says the frontend works without the API: the canvas, editing, validation, save and open, and examples do not need it; only the indicator shows "API offline".
**Rationale**: Checked in code: the connection indicator only polls health; nothing else calls the API in M1.

## 5. Checks that exist today (run on this machine)
| Check | Run from | Command | Pass looks like |
|---|---|---|---|
| Build | root | `make build` | "built in …ms" then the Go build prints nothing and exits 0 |
| Lint and format | root | `make lint` | ESLint prints nothing, Prettier says "All matched files use Prettier code style!", gofmt and vet print nothing, exit 0 |
| Validator vectors | root | `node web/scripts/checkVectors.ts` | every line `ok`, a `speed:` line, exit 0 |
| Example labs | root | `node web/scripts/checkExamples.ts` | `ok` for each example, `speed:` and `bad input` lines `ok`, exit 0 |
| Environment | root | `scripts/check-env.sh` | each tool `ok`, then `bridge`, `veth pair`, `named namespace` `ok`, exit 0 |
| Sandbox integration | root | `make sandbox-test` | Go packages print `[no test files]`, exit 0 |
**Rationale**: These are the real commands today. `make sandbox-test` currently has no integration tests, so the README says it passes with "no test files" until later milestones add some, so the reader is not alarmed.
**Alternatives**: List nothing (violates the ticket); list `make test-web` and `make e2e-web` (do not exist, FR-010).

## 6. Not available yet
**Decision**: One short line: automated frontend unit tests, the end-to-end browser test, and `make test-web` / `make e2e-web` are not part of Milestone 1. No command is shown for them.
**Rationale**: The ticket says "test commands for each suite", but the constitution says no tests are written and NL-021 is unresolved; the spec decided to mark them not available.

## 7. Architecture diagram
**Decision**: A Mermaid `flowchart LR` with five parts. Browser frontend ↔ API (REST under `/api/v1`, WebSocket later). API → worker over a Unix socket in `.sandbox/` (worker runs inside the sandbox). Worker → kernel (namespaces, bridges, veth, nftables). Observer reads kernel state and reports to the API. Capture runs `tcpdump` in a lab namespace and streams packets to the frontend through the API. Parts built in M1 (frontend, API health check) styled solid; later parts dashed and labelled "later". A plain list under the diagram names the five parts and one job each.
**Rationale**: Matches decisions 6, 7, and 8 in `docs/decisions.md` and the clarification (Mermaid plus plain list).
**Alternatives**: ASCII or an image (rejected in clarification).

## 8. Things to confirm during the clean-checkout run
- The amber "API online, worker offline" state: `workerNotBuilt()` in `api/cmd/api/main.go` returns false, so the API reports the worker as unreachable and the indicator is amber, not green. The README must show the state the run really shows. If amber, say: "API online, worker offline (amber) is expected in Milestone 1: the worker arrives with NL-032."
- Node version with the check scripts on a machine with Node 22.6 to 22.17 (needs `--experimental-strip-types`); the README states 22.18 or newer so this never comes up.

## 9. Sandbox page staleness
**Finding**: `docs/sandbox.md` says `tcpdump` is not installed on this machine, but `scripts/check-env.sh` now reports it `ok`. The README does not repeat that line (it links to the page). Out of scope to edit the page here; note it in the clean-checkout report.

## 10. Verification without tests
**Decision**: A hand run on a clean checkout (`git clone` into a fresh folder, or `git worktree`) following only the README, recorded in [quickstart.md](quickstart.md).
**Rationale**: The ticket's acceptance is exactly this; the constitution says hand checks.
