---

description: "Task list for Milestone 1 README"
---

# Tasks: Milestone 1 README

**Input**: Design documents from `/specs/015-m1-readme/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/readme-contract.md

**Tests**: None. The constitution says no tests are written. Acceptance is a hand run of every README command on a clean checkout (quickstart.md).

**One deliverable**: the root `README.md`. Every task below edits that one file (or only checks it), so the tasks run one after another, never in parallel.

**Writing rules** (from the contract): short sentences and plain words in English; every command in a fenced code block with the folder it runs from; no `sudo`; no make target or script that does not exist; no copied text from `docs/sandbox.md` or `docs/decisions.md` (link instead); names, ports, and indicator texts match the repository exactly. Do not commit unless the user asks.

## Format: `[ID] [P?] [Story] Description`

All paths are from the repository root.

## Phase 1: Setup

**Purpose**: Confirm the facts the README will state, then create the empty page.

- [X] T001 Re-check the facts in `specs/015-m1-readme/research.md` on the current machine and note any difference before writing: run `git --version`, `make --version`, `node --version`, `npm --version`, `go version`; confirm `api/go.mod` says `go 1.26`, `web/vite.config.ts` has `strictPort: true` and the proxy target `http://localhost:8080`, and `HealthPath = "/api/v1/health"` in `api/internal/api/constants.go`; start the API with `make dev-api` in the background, run `curl -s localhost:8080/api/v1/health`, and record whether the worker is reported reachable (this decides whether the indicator shows "API online" or "API online, worker offline" in Milestone 1, research §8); stop the API afterward
- [X] T002 Create `README.md` at the repository root containing only the ten section headings in the order of `specs/015-m1-readme/data-model.md` (Title and intro, Milestone 1, Architecture, Prerequisites, Quick start, Troubleshooting, Safety and sandbox, Project layout, Checks, More docs), each with an empty body for now. Depends on T001

---

## Phase 2: Foundational (blocks all stories)

No separate foundational work. The page skeleton (T002) is the only prerequisite.

---

## Phase 3: User Story 1 - Understand what NetLab is and how it fits together (Priority: P1)

**Goal**: The first screen explains what NetLab is, shows the five parts, and says what Milestone 1 includes.

**Independent test**: a new reader reads the first screen and names at least four of the five parts.

- [X] T003 [US1] In `README.md` write the title and intro: NetLab lets you draw a network lab (namespaces, bridges, links) in the browser, check it, and later deploy it on Linux; say what a lab is; name who it is for (people who learn or test Linux networking). Two or three short paragraphs. Depends on T002
- [X] T004 [US1] In `README.md` write the "Milestone 1" section: a short list of what works now (draw a lab on the canvas, edit nodes and links in the properties panel, validate and read the Issues tab, save and open `.netlab.json` files, start from example labs) and one line that deploying a lab is not part of Milestone 1. Depends on T003
- [X] T005 [US1] In `README.md` write the "Architecture" diagram as a fenced `mermaid` block (`flowchart LR`) with five parts: Frontend (browser) and API in solid style; Worker, Observer, and Capture in dashed style with the label "later". Arrows: Frontend to API (REST under `/api/v1`, WebSocket later); API to Worker over a Unix socket in `.sandbox/`; Worker to the kernel; Observer reads kernel state and reports to the API; Capture runs `tcpdump` in a lab namespace and streams to the frontend through the API. Use `classDef` for the two styles. Depends on T004
- [X] T006 [US1] Directly under the diagram in `README.md` add a plain list of the five parts with one job each exactly as in the data-model table ("Frontend: browser canvas to draw, edit, validate, save, and open labs", "API: HTTP API under `/api/v1`; health check only in Milestone 1", "Worker: does the privileged work inside the sandbox", "Observer: reads real kernel state and reports it", "Capture: captures packets on a link with `tcpdump`"), marking which are built in Milestone 1. Depends on T005

**Checkpoint**: the first screen answers what NetLab is, what the five parts are, and what Milestone 1 includes.

---

## Phase 4: User Story 2 - Reach a working canvas from a fresh clone (Priority: P1)

**Goal**: A reader follows the quick start and sees the canvas with the indicator state the README promises.

**Independent test**: quickstart.md section 2 on a clean checkout.

- [X] T007 [US2] In `README.md` write "Prerequisites" as a table with columns Tool, Minimum, Check: git (any recent) `git --version`; make (GNU make 4) `make --version`; Node.js (22.18) `node --version`; npm (10) `npm --version`; Go (1.26) `go version`; then one line that `unshare`, `ip`, and `nft` are needed only for the sandbox check and not for the canvas, and one line that Linux is the supported development system and that the sandbox does not work on other systems. Depends on T006
- [X] T008 [US2] In `README.md` write "Quick start" with the exact commands in fenced blocks, run from the repository root: `make install-web`, then `make dev-api` (terminal 1, API on `:8080`), then `make dev-web` (terminal 2, frontend on `http://localhost:5173`); then say what the reader sees: an empty canvas and the toolbar indicator text recorded in T001 (use the exact indicator texts from `web/src/components/ConnectionIndicator.tsx`: "Checking API", "API online", "API online, worker offline", "API offline"). Depends on T007
- [X] T009 [US2] In `README.md` write "Troubleshooting": (1) "API offline" means the API is not running; start `make dev-api`; the frontend alone still works for the canvas, editing, validating, saving, opening, and examples; (2) if the indicator is amber "API online, worker offline", say whether that is expected in Milestone 1 based on T001 (the worker arrives with NL-032); (3) busy port 5173: the dev server stops with an error because the port is fixed; free the port or run `npm run dev -- --port <free port>` from `web`; (4) do not change the API port in Milestone 1, because the dev proxy points at `:8080`. Depends on T008

**Checkpoint**: following only these sections reaches a working canvas.

---

## Phase 5: User Story 3 - Know what runs as root and how to use the sandbox (Priority: P1)

**Goal**: The reader knows nothing needs root and what the sandbox is.

**Independent test**: ask the reader whether the README needs `sudo` and what the sandbox is for.

- [X] T010 [US3] In `README.md` write "Safety and sandbox": the sentence "Nothing in Milestone 1 needs root, and no command in this README uses `sudo`."; a short paragraph in your own words (not copied) that privileged code runs only in a throwaway user, network, and mount namespace made by `scripts/sandbox.sh`, only the worker runs there, and lab traffic never reaches the real network; a link to `docs/sandbox.md` for the full design; and the environment check `scripts/check-env.sh` (run from the root) with what a pass looks like: each tool `ok`, then `bridge`, `veth pair`, and `named namespace` `ok`, exit code 0; add one sentence that if the check fails on user namespaces, the reader should follow the remediation text on the linked sandbox page. Depends on T009

**Checkpoint**: a reader can answer "does it need root?" (no) and describe the sandbox in one line.

---

## Phase 6: User Story 4 - Find my way around the project and run the checks (Priority: P2)

**Goal**: A project map and the checks that exist today, each with its pass result.

**Independent test**: a contributor runs each listed command and sees the stated pass result.

- [X] T011 [US4] In `README.md` write "Project layout" as a list with one line per top-level folder using the data-model text: `web` frontend, `api` Go API, worker, and tools, `docs` sandbox, decisions, links, and topology schema, `examples` ready-made labs, `scripts` sandbox and environment scripts, `specs` feature specs and plans, `testdata` shared validator vectors, `TICKETS` work tickets, `Makefile` common commands. Depends on T010
- [X] T012 [US4] In `README.md` write "Checks" as a table with columns Check, Command (run from the repository root), Pass looks like, with exactly the six rows in `specs/015-m1-readme/research.md` section 5 (`make build`, `make lint`, `node web/scripts/checkVectors.ts`, `node web/scripts/checkExamples.ts`, `scripts/check-env.sh`, `make sandbox-test`), then one line: "Automated frontend unit tests and the end-to-end browser test (`make test-web`, `make e2e-web`) are not available yet." with no command for them. State in one line that `make sandbox-test` passing with "[no test files]" is normal for now, and in one line that every command in this README is run on a clean checkout before each milestone is closed. Depends on T011
- [X] T013 [US4] In `README.md` write "More docs" with links to `docs/sandbox.md`, `docs/decisions.md`, `docs/links.md`, and `docs/topology.schema.json`, one short line each saying what the page covers. Depends on T012

**Checkpoint**: every top-level folder is described and every check has a command and a pass result.

---

## Phase 7: Polish & Cross-Cutting

- [X] T014 Run the rule scans from `specs/015-m1-readme/quickstart.md` section 4 on `README.md`: no `sudo`; every `make <target>` it mentions exists in `Makefile`; every script path it mentions exists; no text copied from `docs/sandbox.md` or `docs/decisions.md`; fix anything found. Depends on T013
- [X] T015 Run every command in the README exactly as written from a clean clone: `git clone . /tmp/netlab-clean` from the repository root (a clone holds only committed files, so then copy the working `README.md` into `/tmp/netlab-clean/README.md`, unless the README has already been committed with the user's approval): the quick start (start both servers, `curl -s localhost:5173` returns the page and `curl -s localhost:8080/api/v1/health` returns JSON, then stop them) and every row of the Checks table; confirm each pass result matches the README text and fix any mismatch in `README.md`. Depends on T014
- [ ] T016 Open the repository front page on the hosting site (or a Mermaid preview) and confirm the diagram renders and says the same as the plain list under it; then have a second person follow the README on a clean checkout and record the time to a working canvas (under 10 minutes), whether they named at least four parts, whether they thought it needs root, and any question they had to ask (SC-001, SC-004, SC-005). A local Mermaid preview counts for the render check until the README is pushed. This is a hand check and cannot be done by an agent alone. Depends on T015

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (empty) → stories in order. All README edits are in one file, so T003 to T013 run strictly in task order.
- **MVP**: T001 to T009 (intro, architecture, prerequisites, quick start, troubleshooting) gives a README that reaches a working canvas; T010 adds the safety promise.
- T014 to T016 close the feature and need everything before them.

### Parallel opportunities

None for edits: one file, sequential. T001's fact checks can run in parallel inside the one task (independent commands).

## Implementation Strategy

1. **MVP**: Setup, then US1 and US2: the page explains the project and reaches a working canvas.
2. Add US3 (safety and sandbox), then US4 (layout, checks, docs).
3. Finish with Polish: rule scans, a clean-checkout run, and the second-reader check.
