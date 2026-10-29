---

description: "Task list for the Project Decisions Record"
---

# Tasks: Project Decisions Record

**Input**: Design documents from `/specs/001-project-decisions/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/decisions-document.md, quickstart.md

**Tests**: None. The constitution says no tests are written. Each story is checked by hand with `quickstart.md`.

**Organization**: Tasks are grouped by user story. The deliverable is one file, `docs/decisions.md`, built up across the stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to (US1, US2, US3)
- Most tasks edit the same file, so few are parallel.

## Phase 1: Setup

**Purpose**: Create the file skeleton from the contract.

- [X] T001 Create `docs/decisions.md` following `specs/001-project-decisions/contracts/decisions-document.md`: title `# NetLab Decisions Record`, a `Written: 2026-10-29` line, a `Reviewed: pending` line, and an empty `## Known mismatches` section at the end

---

## Phase 2: Foundational

No blocking prerequisites beyond T001. Source content for every entry is `TICKETS/NL-000-decisions.md` and the "Clarifications" section of `specs/001-project-decisions/spec.md`.

---

## Phase 3: User Story 1 - One place for every open design choice (Priority: P1) 🎯 MVP

**Goal**: `docs/decisions.md` has all ten entries, each with a decision and rationale.

**Independent Test**: Run quickstart steps 1 to 3. Both counts are 10, entry 7 and entry 5 contain the required statements.

**Entry rules (apply to every task below)**: each entry is a level-2 heading `## <number>. <Topic>`, then the fields `**Status**: Proposed`, `**Decision**:` (one or two sentences), `**Rationale**:` (one paragraph). Add `**Alternative considered**:` where the task says so. Numbers stay fixed 1 to 10 in this order. Use the wording of `TICKETS/NL-000-decisions.md` as the starting point.

### Implementation for User Story 1

- [X] T002 [US1] Add entry `## 1. Authentication for version 1` to `docs/decisions.md`: one static bearer token read from the `NETLAB_TOKEN` environment variable, checked by both the API and the worker, with lab ownership keyed by token owner id
- [X] T003 [US1] Add entry `## 2. Data persistence` to `docs/decisions.md`: SQLite through the pure Go driver `modernc.org/sqlite` (no cgo) for labs, jobs, capture metadata, and the audit log, with topology documents also exportable as JSON files
- [X] T004 [US1] Add entry `## 3. veth link model` to `docs/decisions.md`: a veth pair is an edge with two interface endpoints, and the palette entry "veth pair" is a shortcut that creates a link between two chosen interfaces, not a node
- [X] T005 [US1] Add entry `## 4. Host, router, and NAT roles` to `docs/decisions.md`: roles of a namespace-backed node, set with a `role` field plus role settings, not separate kernel object types
- [X] T006 [US1] Add entry `## 5. Resource naming and ownership` to `docs/decisions.md`: lab resources use the prefix `nl` plus a short lab id (for example `nl-a1b2-ns1`, `nl-a1b2-br0`); names are shortened by a deterministic short hash to fit the 15-character Linux interface name limit, the user-facing name stays only in the topology, and lab-owned resources are told apart from all others by this prefix (FR-006)
- [X] T007 [US1] Add entry `## 6. Kernel control approach` to `docs/decisions.md`: use `vishvananda/netlink` and `netns` for links, addresses, routes, and bridges; run external programs (`nft`, `tc`, `tcpdump`) only with a fixed path and separate arguments; namespace operations run on a locked OS thread
- [X] T008 [US1] Add entry `## 7. Packet capture` to `docs/decisions.md` with `**Alternative considered**:` filled in: chosen is external `tcpdump` with its pcap output decoded in Go; rejected is in-process capture (more code to own, different privilege surface); state that `tcpdump` is not installed on the development machine and must be installed before capture work starts; note the capture sits behind an interface so it can be replaced later (FR-004, FR-005)
- [X] T009 [US1] Add entry `## 8. Sandboxed development of privileged code` to `docs/decisions.md`: privileged Go code runs only inside the sandbox (`scripts/sandbox.sh`, a throwaway user, network, and mount namespace, see `TICKETS/NL-001-sandbox-harness.md`); only the worker runs there and the API stays on the host; no `sudo`
- [X] T010 [US1] Add entry `## 9. Frontend state` to `docs/decisions.md`: Zustand, with the desired topology as the single source for the canvas and observed state in a separate store
- [X] T011 [US1] Add entry `## 10. API versioning and error format` to `docs/decisions.md`: all routes under `/api/v1`, errors shaped `{ "error": { "code", "message", "resource", "details" } }`
- [X] T012 [US1] Run quickstart steps 1 to 3 from `specs/001-project-decisions/quickstart.md` and fix `docs/decisions.md` until: exactly 10 entries, 10 `**Rationale**` lines, no blank entry

**Checkpoint**: The record is complete and usable by any later ticket.

---

## Phase 4: User Story 2 - Project owner reviews and signs off (Priority: P2)

**Goal**: The owner can read the record, change any entry, and the review is recorded.

**Independent Test**: Quickstart steps 4 and 6. Dates are valid, every entry shows Approved or Changed after review.

### Implementation for User Story 2

- [X] T013 [US2] Present `docs/decisions.md` to the project owner and ask for approval or changes per entry (target: reviewable in under 15 minutes)
- [X] T014 [US2] For each entry the owner changes, rewrite it in place in `docs/decisions.md` with `**Status**: Changed`, the new decision, and the new rationale; do not delete or renumber entries
- [X] T015 [US2] Set `**Status**: Approved` on every unchanged entry and replace `Reviewed: pending` with `Reviewed: <review date, YYYY-MM-DD>` in `docs/decisions.md` only after the owner has confirmed (FR-007)

**Checkpoint**: The owner review is recorded with a real date.

---

## Phase 5: User Story 3 - Tickets stay consistent with decisions (Priority: P3)

**Goal**: No ticket contradicts the record. Anything not fixed is listed.

**Independent Test**: Quickstart step 5. Every match agrees with the record, and `## Known mismatches` lists the rest.

### Implementation for User Story 3

- [X] T016 [US3] Search `TICKETS/*.md` for each decision's terms (`token`, `sqlite`, `prefix`, `netlink`, `tcpdump`, `zustand`, `/api/v1`, `veth`, `role`, `sandbox`) and compare every match with `docs/decisions.md`; write the findings to a list
- [X] T017 [US3] Fix each ticket in `TICKETS/` that contradicts the record so it matches, or add the mismatch to `## Known mismatches` in `docs/decisions.md` as `- <ticket id>: <what disagrees with decision N>`
- [X] T018 [US3] Add to `## Known mismatches` in `docs/decisions.md` the constitution conflict: tickets that list tests as acceptance (NL-012, NL-021, NL-030, NL-031, NL-032, NL-033, NL-034, NL-035, NL-036, NL-044, NL-050, NL-061, NL-066) disagree with the constitution's no-tests rule; do not edit those tickets here
- [X] T019 [US3] If a mismatch list is empty, write `None` under `## Known mismatches` in `docs/decisions.md`

**Checkpoint**: The record and the tickets agree, or the differences are written down.

---

## Final Phase: Polish

- [X] T020 Run all six quickstart sections in `specs/001-project-decisions/quickstart.md` against `docs/decisions.md` and report which passed
- [X] T021 Check `docs/decisions.md` for plain prose: no placeholder text, no `TODO`, no filler, ISO dates only

---

## Dependencies & Execution Order

- T001 first. T002 to T011 follow in order (same file, no parallel work). T012 after T011.
- US2 (T013 to T015) needs US1 done. US3 (T016 to T019) needs US1 done and can run in parallel with US2 (different files except `docs/decisions.md` edits to separate sections).
- Polish after all stories.

## Parallel Example

After T012: T013 (owner review) can happen while T016 (ticket search) runs, since T016 only reads `TICKETS/`.

## Implementation Strategy

- **MVP**: Phase 1 plus User Story 1 (T001 to T012). This already unblocks every later ticket.
- Then US2 for the sign-off, then US3 for the consistency pass, then Polish.
