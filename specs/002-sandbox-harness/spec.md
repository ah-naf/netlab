# Feature Specification: Sandbox Harness for Privileged Code

**Feature Branch**: `002-sandbox-harness` (directory name; work stays on the current git branch)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "@TICKETS/NL-001-sandbox-harness.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run any command in a throwaway environment (Priority: P1)

A developer runs any command inside an isolated environment that behaves like it has full administrator rights over networking, but cannot see or change the developer's real network setup. When the command ends, everything it created is gone.

**Why this priority**: This is the safety guarantee the whole project relies on. Every privileged ticket depends on it.

**Independent Test**: Run a command that creates a network bridge inside the sandbox. The command succeeds inside, and the bridge does not exist on the real machine afterwards.

**Acceptance Scenarios**:

1. **Given** the sandbox command exists, **When** the developer runs a command that creates a network bridge and shows it, **Then** the command succeeds, and checking for that bridge on the real machine afterwards finds nothing.
2. **Given** the sandbox, **When** the developer asks for the current user id inside it, **Then** it shows administrator (0) while the same check on the real machine shows the normal user id.
3. **Given** a command run in the sandbox, **When** it finishes, **Then** the sandbox exits with that command's exit status.
4. **Given** the sandbox, **When** a command creates a named network environment and moves a virtual link into it, **Then** both operations work and neither is visible outside.

---

### User Story 2 - Check that this machine can run the sandbox (Priority: P2)

A developer runs one check before starting. It reports which required tools are present, which optional tools are missing, and whether the sandbox can create a bridge, a virtual link pair, and a named network environment. If something is wrong, it says how to fix it.

**Why this priority**: Without it, setup problems show up later as confusing failures inside other tickets.

**Independent Test**: Run the check on this machine. It passes and reports the missing optional tools by name.

**Acceptance Scenarios**:

1. **Given** all required tools are present, **When** the developer runs the check, **Then** it reports success.
2. **Given** an optional tool is missing (for example `tcpdump`), **When** the check runs, **Then** it names the tool as missing without failing the whole check.
3. **Given** the machine does not allow the isolated environment (user namespaces disabled), **When** the check runs, **Then** it fails with a clear message that says how to enable it.

---

### User Story 3 - Privileged programs refuse to run outside the sandbox (Priority: P2)

The privileged networking program asks whether it is running inside the sandbox. If not, it refuses to start. A clearly named override exists for a dedicated disposable machine, and using it prints a loud warning.

**Why this priority**: It stops an accidental run against the real machine even if someone skips the sandbox command.

**Independent Test**: Start the check helper on the real machine and it says "not in sandbox". Start it through the sandbox command and it says "in sandbox".

**Acceptance Scenarios**:

1. **Given** a normal shell, **When** the program checks its environment, **Then** it reports it is not in the sandbox and refuses to start.
2. **Given** the sandbox command, **When** the program checks, **Then** it reports it is in the sandbox and starts.
3. **Given** the override variable is set to 1, **When** the program starts outside the sandbox, **Then** it starts and prints a loud warning that this is for a disposable machine only.

---

### User Story 4 - Convenient shortcuts for daily use (Priority: P3)

The developer has short commands to open an interactive shell in the sandbox, to run all privileged checks in it, and to run the privileged worker in it with a socket the host-side API can reach.

**Why this priority**: Makes safe use the easy path, but the core safety exists without them.

**Independent Test**: Run the shell shortcut and confirm the prompt is inside the sandbox (user id 0, real bridge list empty).

**Acceptance Scenarios**:

1. **Given** the shortcut for an interactive shell, **When** the developer runs it, **Then** they get a shell inside the sandbox.
2. **Given** the shortcut for the worker, **When** it runs, **Then** the worker listens on a socket file under `.sandbox/` that a host-side program can reach.
3. **Given** any shortcut, **When** it is read, **Then** none of them sets the host override variable or uses `sudo`.

---

### Edge Cases

- The machine has user namespaces disabled: the check fails with fix instructions, and nothing falls back to the real machine.
- The sandbox command is given no command to run: it prints usage and exits with an error.
- The command inside the sandbox crashes or is killed: the sandbox exits and cleans up, leaving nothing behind.
- Two sandboxes run at the same time: each is fully separate and they never see each other's resources.
- The `.sandbox/` folder does not exist yet: it is created with restricted permissions.
- A tool needed for a feature is missing (`tc`, `tcpdump`): the check reports it so later features can fail with a clear message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST provide a sandbox command that runs any given command inside an isolated environment with its own user mapping, network stack, and mounts, and returns the command's exit status.
- **FR-002**: Inside the sandbox, the user MUST appear as administrator, network changes MUST affect only the sandbox, and named network environments MUST work.
- **FR-003**: The sandbox MUST prepare a private runtime directory and bring up the loopback interface before running the command.
- **FR-004**: The project MUST provide a way for programs to ask whether they run inside the sandbox, true only when both the user mapping and the network environment differ from the real machine.
- **FR-005**: The privileged worker MUST refuse to start outside the sandbox unless the override variable is set to 1, and using the override MUST print a loud warning that it is for a disposable machine only.
- **FR-006**: No shortcut command or script in the project MAY set the override variable or use `sudo`.
- **FR-007**: The project MUST provide shortcuts for an interactive sandbox shell, for running all privileged checks in the sandbox, and for running the worker in the sandbox on a socket file under `.sandbox/`.
- **FR-008**: The project MUST provide an environment check that verifies the required tools (`unshare`, `ip`, `nft`, `go`, `node`), reports the optional tools (`tcpdump`, `tc`), and confirms the sandbox can create a bridge, a virtual link pair, and a named network environment.
- **FR-009**: When the machine does not allow the isolated environment, the check MUST fail with a clear message that says how to enable it.
- **FR-010**: The design MUST be documented: only the worker runs inside the sandbox, and the API stays on the real machine and talks to the worker through a socket file under `.sandbox/` that crosses the network boundary.
- **FR-011**: The limits MUST be documented: sandboxed lab traffic cannot leave the sandbox, and nothing persists except files under `.sandbox/` and `data/`.
- **FR-012**: `.sandbox/` MUST be listed in `.gitignore`, and its folder MUST have restricted permissions.
- **FR-013**: No tests are written for this feature (constitution). Each acceptance scenario is verified by running it by hand.

### Key Entities

- **Sandbox**: A temporary isolated environment that lives only as long as the command it runs.
- **Environment Check Report**: The result of the check: required tools (present or missing), optional tools (present or missing), and the sandbox capability result.
- **Host Override**: An explicit setting that allows the worker to run outside the sandbox, for a disposable machine only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After running any sandbox command, zero network resources it created exist on the real machine.
- **SC-002**: Running the environment check takes under 10 seconds and reports a clear pass or fail.
- **SC-003**: A developer can start an interactive sandbox in one short command and under 5 seconds.
- **SC-004**: 100% of attempts to start the worker outside the sandbox without the override are refused.
- **SC-005**: Zero scripts or shortcuts in the project set the override or use `sudo`.
- **SC-006**: A new developer can follow the documentation and run their first sandboxed command in under 10 minutes.

## Assumptions

- The machine allows unprivileged isolated environments. This was confirmed on the current machine, where creating a bridge, a virtual link pair, and a named network environment all worked inside the sandbox.
- The project scaffold (ticket NL-010) provides the shortcut runner (a Makefile) before the shortcuts are added. If it is not there yet, the scripts work on their own.
- The "run all privileged checks" shortcut relies on integration checks that later tickets create. Until then it runs whatever exists and does not fail on an empty set.
- `tcpdump` is not installed on this machine, so the check reports it as missing. This is expected (decision 7).
- A single developer uses the sandbox at a time, though parallel sandboxes stay separate.
