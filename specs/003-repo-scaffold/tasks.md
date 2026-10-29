---

description: "Task list for the Repository Scaffold"
---

# Tasks: Repository Scaffold

**Input**: Design documents from `/specs/003-repo-scaffold/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/root-commands.md, quickstart.md

**Tests**: None. The constitution says no tests are written. No test files, no test runner, no test Make targets. Each story is checked by hand with `quickstart.md`.

**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 to US3, matching the stories in `spec.md`

## Rules for every task

- Never use `sudo`. No privileged code.
- Go: no magic strings. Env variable names, default address, and messages are named constants. Keep functions short.
- Extend, do not replace, the existing `Makefile`, `.gitignore`, `api/go.mod`, and `api/internal/sandbox/`.

## Phase 1: Setup

- [X] T001 Create the folders `web/src/components`, `web/src/hooks`, `web/src/store`, `web/src/api`, `web/src/types`, `web/src/constants`, each with an empty `.gitkeep` file
- [X] T002 [P] Create the folder `examples/` with an empty `examples/.gitkeep` (the `docs/` folder already exists)
- [X] T003 [P] Create the folders `api/cmd/api` and `api/cmd/worker`

---

## Phase 2: Foundational

No blocking prerequisites beyond Phase 1.

---

## Phase 3: User Story 1 - Start the frontend with one command (Priority: P1) 🎯 MVP

**Goal**: A blank React page loads from the dev server, with styling, lint, format, the diagram editor, and shared state set up.

**Independent Test**: Quickstart section 1. The page loads blank with no console errors, `/api` requests reach the backend.

### Implementation for User Story 1

- [X] T004 [US1] Create `web/package.json` with `"name": "netlab-web"`, `"private": true`, `"type": "module"`, and scripts `dev` (`vite`), `build` (`tsc -b && vite build`), `lint` (`eslint .`), `format` (`prettier --write .`), `format:check` (`prettier --check .`)
- [X] T005 [US1] In `web/`, run `npm install react react-dom @xyflow/react zustand` and `npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite eslint @eslint/js typescript-eslint eslint-plugin-react-hooks globals prettier` (creates `web/package-lock.json`; no test packages)
- [X] T006 [P] [US1] Create `web/tsconfig.json` (strict mode, `"jsx": "react-jsx"`, `"moduleResolution": "bundler"`, `"noEmit": true`, `"include": ["src", "vite.config.ts"]`)
- [X] T007 [P] [US1] Create `web/index.html` with a `<div id="root">` and `<script type="module" src="/src/main.tsx">`, title `NetLab`
- [X] T008 [P] [US1] Create `web/src/index.css` containing only `@import "tailwindcss";`
- [X] T009 [P] [US1] Create `web/src/App.tsx` that renders an empty fragment (blank page) and `web/src/main.tsx` that mounts `<App />` into `#root` and imports `./index.css`
- [X] T010 [US1] Create `web/vite.config.ts` with the react and tailwind plugins and a named constant `API_TARGET = "http://localhost:8080"`; proxy `/api` to `API_TARGET` and `/ws` to `API_TARGET` with `ws: true`
- [X] T011 [P] [US1] Create `web/eslint.config.js` (flat config: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks` recommended, browser globals, ignores `dist`)
- [X] T012 [P] [US1] Create `web/.prettierrc` (`{ "singleQuote": false, "semi": true }`) and `web/.prettierignore` (`dist`, `package-lock.json`)
- [X] T013 [US1] Run `npm run dev` in `web/`, open the printed URL, confirm a blank page with no console errors, then run `npm run lint` and `npm run format:check` and fix the config or code until both pass; verify quickstart section 1

**Checkpoint**: The frontend runs and lints clean.

---

## Phase 4: User Story 2 - Start the backend with one command (Priority: P1)

**Goal**: The API starts, stays running, and stops cleanly. Ten responsibility folders exist, each with a purpose description. The worker placeholder is safe.

**Independent Test**: Quickstart section 2. Starts in under 3 seconds, exits 0 on Ctrl+C, ten folders with `doc.go`, worker refuses outside the sandbox.

### Implementation for User Story 2

- [X] T014 [P] [US2] Create `api/internal/api/doc.go` with `// Package api holds HTTP handlers, routing, and middleware.` and `package api`
- [X] T015 [P] [US2] Create `api/internal/topology/doc.go` with `// Package topology holds the topology schema and validation.`
- [X] T016 [P] [US2] Create `api/internal/engine/doc.go` with `// Package engine plans and runs deployments.`
- [X] T017 [P] [US2] Create `api/internal/worker/doc.go` with `// Package worker holds the worker client and privileged operations.`
- [X] T018 [P] [US2] Create `api/internal/observer/doc.go` with `// Package observer reads kernel state and detects drift.`
- [X] T019 [P] [US2] Create `api/internal/capture/doc.go` with `// Package capture runs packet capture sessions and decodes packets.`
- [X] T020 [P] [US2] Create `api/internal/events/doc.go` with `// Package events defines event types and the WebSocket hub.`
- [X] T021 [P] [US2] Create `api/internal/store/doc.go` with `// Package store persists labs, jobs, and audit entries.`
- [X] T022 [P] [US2] Create `api/internal/audit/doc.go` with `// Package audit records privileged operations.`
- [X] T023 [US2] Create `api/cmd/api/main.go`: named constants `addrEnv = "NETLAB_API_ADDR"` and `defaultAddr = ":8080"`; `main` calls `run()` and exits 1 with the error on failure; `run()` builds an `http.Server` with an empty `http.NewServeMux()`, starts `ListenAndServe` in a goroutine, waits on `signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)`, then calls `Server.Shutdown` with a 5 second timeout and returns nil (treat `http.ErrServerClosed` as success)
- [X] T024 [US2] Create `api/cmd/worker/main.go`: import `netlab/api/internal/sandbox`; named constant `notImplementedMessage = "worker not implemented yet (NL-032)"`; call `sandbox.RequireSandbox()`, on error print it to stderr and `os.Exit(1)`; otherwise print `notImplementedMessage` and return
- [X] T025 [US2] Run `gofmt -l api` (must print nothing) and `go vet ./...` in `api/`; run `go run ./cmd/api` and stop it with Ctrl+C (exit status 0); run `go run ./cmd/worker` on the host (must print `not in sandbox: run through scripts/sandbox.sh` and exit 1) and `make sandbox-worker` (must print `worker not implemented yet (NL-032)`); verify quickstart section 2

**Checkpoint**: The backend runs, stops cleanly, and the worker placeholder is safe.

---

## Phase 5: User Story 3 - One set of root commands and shared project files (Priority: P2)

**Goal**: Root commands for install, start, build, and lint; the example environment file; ignore rules.

**Independent Test**: Quickstart section 3. Build and lint pass, three paths are ignored, no `sudo`, `.env.example` lists the three settings.

### Implementation for User Story 3

- [X] T026 [US3] Extend `Makefile` (keep the existing sandbox targets and variables) with `.PHONY` targets: `install-web` (`cd web && npm install`), `dev-web` (`cd web && npm run dev`), `dev-api` (`cd api && go run ./cmd/api`), `build` (`cd web && npm run build` then `cd api && go build ./...`), `lint` (`cd web && npm run lint && npm run format:check` then `cd api && test -z "$$(gofmt -l .)" && go vet ./...`)
- [X] T027 [P] [US3] Extend `.gitignore` with the lines `data/`, `node_modules/`, `dist/`, `*.log`, `.env` (keep the existing `.sandbox/` line)
- [X] T028 [P] [US3] Create `.env.example` with `NETLAB_API_ADDR=:8080`, `NETLAB_WORKER_SOCKET=.sandbox/worker.sock`, and a commented `# NETLAB_ALLOW_HOST=1` with a comment line "disposable VM only, never set on your own machine"; no secrets (every setting the code reads appears: "Rule: no secrets, every setting the code reads appears")
- [X] T029 [US3] Run `make build` and `make lint` from the repository root and fix until both pass with zero errors; run `git check-ignore .sandbox/ data/ node_modules/` (all three printed) and `grep -rn sudo Makefile` (no output); verify quickstart section 3

**Checkpoint**: Root commands and shared files are in place.

---

## Final Phase: Polish

- [X] T030 Run `make dev-api` in one terminal and `make dev-web` in another, then `curl -i http://localhost:5173/api/anything` and confirm the response comes from the Go server (404 from the empty mux) per quickstart section 1
- [X] T031 Run all three quickstart sections in order and report which passed; remove stray build output (`web/dist`) if present

---

## Dependencies & Execution Order

- Phase 1 first. T002 and T003 can run together with T001.
- US1 (T004 to T013) and US2 (T014 to T025) touch different folders and can run in parallel after Phase 1.
- US3 needs both: the `Makefile` targets call into `web/` and `api/` (T026 to T029 after T013 and T025 pass; T027 and T028 can start earlier).
- Polish after all stories.

## Parallel Example

After Phase 1: T004 to T013 (frontend) in parallel with T014 to T025 (backend). Within US2, T014 to T022 are all separate files and run together. Within US1, after T005: T006 to T009, T011, T012 run together.

## Implementation Strategy

- **MVP**: Phase 1 plus User Story 1 (T001 to T013): a running blank page. User Story 2 is equally small and needed by every backend ticket.
- Then US3 for the shared commands, then Polish.

---

## Phase 6: Convergence

- [X] T032 [P] Add `strictPort: true` to the `server` block in `web/vite.config.ts` so the dev server exits with an error when port 5173 is already in use per Edge Cases: port already in use (partial)
- [X] T033 [P] In `web/vite.config.ts` replace the inline proxy paths `"/api"` and `"/ws"` with named constants `API_PATH` and `WS_PATH` defined next to `API_TARGET` per Constitution IV (contradicts)
