---

description: "Task list for the Sandbox Harness"
---

# Tasks: Sandbox Harness for Privileged Code

**Input**: Design documents from `/specs/002-sandbox-harness/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/sandbox-interface.md, quickstart.md

**Tests**: None. The constitution says no tests are written. Each story is checked by hand with `quickstart.md`.

**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 to US4, matching the stories in `spec.md`

## Rules for every task

- Never use `sudo`. Never set `NETLAB_ALLOW_HOST` in any script or Makefile target.
- Scripts pass arguments as separate words (`"$@"`), never joined into a shell string.
- Go: no magic strings. Paths, the override variable name, and the ioctl number are named constants. Keep functions short.

## Phase 1: Setup

- [X] T001 Create folders `scripts/` and `api/internal/sandbox/` at the repository root
- [X] T002 [P] Create `api/go.mod` with `module netlab/api` and `go 1.26` (NL-010 extends it later)
- [X] T003 [P] Create or extend `.gitignore` at the repository root with the line `.sandbox/`

---

## Phase 2: Foundational

No blocking prerequisites beyond Phase 1.

---

## Phase 3: User Story 1 - Run any command in a throwaway environment (Priority: P1) 🎯 MVP

**Goal**: A command runs in an isolated user, network, and mount environment and leaves nothing on the real machine.

**Independent Test**: Quickstart section 1. A bridge created inside is absent on the host, user id is 0 inside, exit status passes through.

### Implementation for User Story 1

- [X] T004 [US1] Create `scripts/sandbox-init.sh` (executable, `#!/usr/bin/env bash`, `set -euo pipefail`): mount a tmpfs on `/run`, `mkdir -p /run/netns`, run `ip link set lo up`, then `exec "$@"`
- [X] T005 [US1] Create `scripts/sandbox.sh` (executable, `#!/usr/bin/env bash`, `set -euo pipefail`): if no arguments, print a usage line to stderr and `exit 2`; otherwise `exec unshare --user --map-root-user --net --mount "$(dirname "$0")/sandbox-init.sh" "$@"` so the exit status of the command is returned
- [X] T006 [US1] Run quickstart section 1 from `specs/002-sandbox-harness/quickstart.md` and fix `scripts/sandbox.sh` and `scripts/sandbox-init.sh` until all four checks match the expected output

**Checkpoint**: The sandbox works. This is the safety guarantee for the whole project.

---

## Phase 4: User Story 2 - Check that this machine can run the sandbox (Priority: P2)

**Goal**: One command reports tools and sandbox capability, and says how to fix problems.

**Independent Test**: Quickstart section 2. Exit 0, `tcpdump` reported missing, three capabilities ok, under 10 seconds.

### Implementation for User Story 2

- [X] T007 [US2] Create `scripts/check-env.sh` (executable, `set -uo pipefail`) with a helper that prints `<item>: ok` or `<item>: missing`; check required tools `unshare`, `ip`, `nft`, `go`, `node` ("Missing makes the check fail") and optional tools `tcpdump`, `tc` ("Missing is reported and does not fail the check")
- [X] T008 [US2] In `scripts/check-env.sh` add the capability checks, each run through `scripts/sandbox.sh`: create a bridge `nlchk0`, create a veth pair `nlchk0`/`nlchk1` (not single-character names), and create a named namespace with `ip netns add nlchk`; print each as `<item>: ok` or `<item>: FAIL`
- [X] T009 [US2] In `scripts/check-env.sh` detect when `scripts/sandbox.sh true` itself fails and print how to enable user namespaces (kernel setting `user.max_user_namespaces` greater than 0 and, where present, `kernel.unprivileged_userns_clone=1`); exit 1 in that case
- [X] T010 [US2] In `scripts/check-env.sh` set the exit code: "0 when no required item is missing and all capabilities succeed; non-zero otherwise"
- [X] T011 [US2] Run quickstart section 2 and fix `scripts/check-env.sh` until the output and the under-10-seconds time match

**Checkpoint**: A developer knows in one command whether the machine is ready.

---

## Phase 5: User Story 3 - Privileged programs refuse to run outside the sandbox (Priority: P2)

**Goal**: A Go function tells the worker whether it runs in the sandbox, and a named override exists with a loud warning.

**Independent Test**: Quickstart section 3. Host says not in sandbox, sandbox says in sandbox, override prints the warning.

### Implementation for User Story 3

- [X] T012 [US3] Create `api/internal/sandbox/sandbox.go` with named constants: `HostOverrideEnv = "NETLAB_ALLOW_HOST"`, `HostOverrideValue = "1"`, `uidMapPath = "/proc/self/uid_map"`, `identityUIDMap = "0 0 4294967295"`, `selfUserNSPath = "/proc/self/ns/user"`, `selfNetNSPath = "/proc/self/ns/net"`, `nsGetUserNS = 0xb701`
- [X] T013 [US3] In `api/internal/sandbox/sandbox.go` add `HostOverrideEnabled() bool` returning true only when the environment value is exactly `"1"`
- [X] T014 [US3] In `api/internal/sandbox/sandbox.go` add small helpers `hasUserMapping()` (true when the whitespace-trimmed fields of `/proc/self/uid_map` do not equal `"0 0 4294967295"`) and `netNSOwnedBySelf()` (open `/proc/self/ns/net`, call ioctl `NS_GET_USERNS` (`0xb701`) via `syscall.Syscall(syscall.SYS_IOCTL, ...)`, `Fstat` the returned fd and `Stat` `/proc/self/ns/user`, compare inode numbers; close the returned fd)
- [X] T015 [US3] In `api/internal/sandbox/sandbox.go` add `InSandbox() bool` that returns `hasUserMapping() && netNSOwnedBySelf()`; return false on any error
- [X] T016 [US3] Add a one-line checker `api/internal/sandbox/cmd/check/main.go` that prints `in sandbox` or `not in sandbox` using `InSandbox()` (for quickstart section 3; the worker adopts the same refusal logic in NL-032)
- [X] T017 [US3] Run quickstart section 3: `cd api && go run ./internal/sandbox/cmd/check` on the host must print `not in sandbox`; `scripts/sandbox.sh go run ./api/internal/sandbox/cmd/check` (adjust the working directory) must print `in sandbox`; fix until both match

**Checkpoint**: The refusal check works. NL-032 wires it into the worker.

---

## Phase 6: User Story 4 - Convenient shortcuts for daily use (Priority: P3)

**Goal**: Short Make commands for a shell, privileged checks, and the worker.

**Independent Test**: Quickstart section 4.

### Implementation for User Story 4

- [X] T018 [US4] Create `Makefile` at the repository root with a variable `SANDBOX := scripts/sandbox.sh` and `.PHONY` targets; `sandbox-shell` runs `$(SANDBOX) bash`
- [X] T019 [US4] In `Makefile` add `sandbox-test` running `cd api && ../$(SANDBOX) go test -tags integration ./...` (an empty set must pass) and `sandbox-worker` that, when `api/cmd/worker` exists, runs `mkdir -p -m 0700 .sandbox` then `$(SANDBOX) go run ./api/cmd/worker` with the socket at `.sandbox/worker.sock`, and otherwise prints `worker not built yet (NL-032)` and exits 0
- [X] T020 [US4] Run quickstart section 4 and confirm the shell is inside the sandbox and the grep finds no `sudo` and no line setting `NETLAB_ALLOW_HOST` in `Makefile` or `scripts/`

**Checkpoint**: Safe use is the easy path.

---

## Final Phase: Polish

- [X] T021 [P] Create `docs/sandbox.md` with: the design ("only the worker runs inside the sandbox; the API stays on the real machine and talks to the worker through a socket file under `.sandbox/`"), the limits ("sandboxed lab traffic cannot leave the sandbox, and nothing persists except files under `.sandbox/` and `data/`"), the host override warning ("disposable machine only"), and a "files are not protected" note (the sandbox isolates network and mounts, not your files)
- [X] T022 Ensure `.sandbox/` is created with mode 0700 wherever scripts create it (`mkdir -p -m 0700 .sandbox`) and run `git check-ignore .sandbox/` to confirm it prints `.sandbox/` (quickstart section 5)
- [X] T023 Run all five quickstart sections once more in order and report which passed; clean up any stray files (`nlbr0`-style test resources exist only inside the sandbox and need no cleanup)

---

## Dependencies & Execution Order

- Phase 1 first. T002 and T003 can run together after T001.
- US1 (T004 to T006) blocks US2, because the check runs through the sandbox.
- US3 (T012 to T017) needs only Phase 1 (`api/go.mod`); it can run in parallel with US1 and US2 until T017, which needs US1 for the in-sandbox run.
- US4 needs US1 and, for `sandbox-worker`, only the missing-worker message (the real worker comes with NL-032).
- Polish after all stories.

## Parallel Example

After T001: T002, T003 in parallel. After T005: T007 to T011 (US2) in parallel with T012 to T016 (US3), since they touch different files.

## Implementation Strategy

- **MVP**: Phase 1 plus User Story 1 (T001 to T006). This already gives the safety guarantee.
- Then US2 (check), US3 (Go detection, needed by NL-032), US4 (shortcuts), and Polish.

---

## Phase 7: Convergence

- [X] T024 Add `RequireSandbox() error` to `api/internal/sandbox/sandbox.go` that returns nil when `InSandbox()` is true, returns nil and prints `HostOverrideWarning` to stderr when only `HostOverrideEnabled()` is true, and otherwise returns an error saying to run through `scripts/sandbox.sh`; use it in `api/internal/sandbox/cmd/check/main.go` per FR-005 (partial)
- [X] T025 [P] Replace the repeated literals `nlchk0`, `nlchk1`, and `nlchk` in `scripts/check-env.sh` with variables defined once at the top of the script per Constitution IV (contradicts)
- [X] T026 [P] Define `WORKER_SOCKET := $(SANDBOX_DIR)/worker.sock` in `Makefile` and pass it to the worker in the `sandbox-worker` target as the environment variable `NETLAB_WORKER_SOCKET` per FR-007 (partial)
