# Feature Specification: Repository Scaffold

**Feature Branch**: `003-repo-scaffold` (directory name; work stays on the current git branch)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "@TICKETS/NL-010-repo-scaffold.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start the frontend with one command (Priority: P1)

A developer starts the frontend development server with one command and sees a blank page in the browser. The project is already set up for styling, linting, formatting, a node-based diagram editor, and shared state, so later work only adds features.

**Why this priority**: Every later frontend ticket builds on it.

**Independent Test**: Run the frontend start command and open the page in a browser. A blank page loads with no errors.

**Acceptance Scenarios**:

1. **Given** a fresh checkout with dependencies installed, **When** the developer runs the frontend start command, **Then** the page loads in the browser with no errors in the console.
2. **Given** the frontend is running, **When** the page requests a path starting with `/api` or `/ws`, **Then** the request is forwarded to the backend.
3. **Given** the frontend, **When** the developer runs the lint and format commands, **Then** both complete with no errors on the starter code.

---

### User Story 2 - Start the backend with one command (Priority: P1)

A developer starts the backend with one command. It starts, stays running, and stops cleanly when interrupted. The code is already arranged into clearly named folders, one per responsibility, so each later ticket knows where its code goes.

**Why this priority**: Every later backend ticket builds on it.

**Independent Test**: Run the backend start command, then interrupt it with Ctrl+C. It stops cleanly with a success exit.

**Acceptance Scenarios**:

1. **Given** a fresh checkout, **When** the developer runs the backend start command, **Then** it starts without errors.
2. **Given** the backend is running, **When** the developer interrupts it, **Then** it exits cleanly.
3. **Given** the repository, **When** the developer lists the backend folders, **Then** a separate folder exists for each responsibility: api, topology, engine, worker, observer, capture, events, store, sandbox, audit.
4. **Given** an empty responsibility folder, **When** a developer opens it, **Then** a short description file says what the folder is for.

---

### User Story 3 - One set of root commands and shared project files (Priority: P2)

From the repository root, the developer uses short commands to start, build, and lint both parts. Shared project files are in place: an example environment file, ignore rules, and folders for documentation and example topologies.

**Why this priority**: Makes daily work consistent, but both parts already run without it.

**Independent Test**: Run each root command and confirm it works. Check that the example environment file and folders exist.

**Acceptance Scenarios**:

1. **Given** the repository root, **When** the developer runs the build command, **Then** both the frontend and the backend build.
2. **Given** the repository root, **When** the developer runs the lint command, **Then** both parts are linted.
3. **Given** the ignore rules, **When** git checks `.sandbox/`, `data/`, and `node_modules/`, **Then** all three are ignored.
4. **Given** the example environment file, **When** a developer reads it, **Then** it lists every setting the code reads and contains no secrets.
5. **Given** any root command, **When** its definition is read, **Then** it does not use `sudo`.

---

### Edge Cases

- A dependency fails to install (no network): the install step shows the failure clearly and nothing half-installed is left that looks complete.
- Port already in use when starting the frontend or backend: the process reports the busy port and exits with an error, not a hang.
- The backend is started before the frontend (or the reverse): each runs on its own, and the proxy simply fails requests until the backend is up.
- `make sandbox-worker` runs now that a worker folder exists: the worker placeholder must not start privileged work outside the sandbox.
- Files from the earlier sandbox feature already exist (Makefile, backend module file, ignore file): they are extended, not replaced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST have a `web/` frontend project and an `api/` backend project.
- **FR-002**: The frontend MUST be set up with React, TypeScript, a build and dev server, utility-class styling, linting, and formatting, plus the node-diagram editor package and the shared-state package installed.
- **FR-003**: The frontend dev server MUST forward requests whose path starts with `/api` and `/ws` to the backend.
- **FR-004**: The backend MUST be a single Go module with entry points for the API and for the worker, and one folder per responsibility: api, topology, engine, worker, observer, capture, events, store, sandbox, audit.
- **FR-005**: Each responsibility folder that has no code yet MUST contain a short description file saying its purpose.
- **FR-006**: The API entry point MUST start, keep running, and exit cleanly on interrupt.
- **FR-007**: The worker entry point MUST be a placeholder that refuses to start outside the sandbox and otherwise reports that it is not implemented yet.
- **FR-008**: The root `Makefile` MUST provide commands to start the frontend, start the API, build everything, and lint everything, and MUST keep the existing sandbox commands.
- **FR-009**: The repository MUST include `.env.example` listing every setting the code reads with safe placeholder values and no secrets.
- **FR-010**: `.gitignore` MUST ignore `.sandbox/`, `data/`, and `node_modules/`.
- **FR-011**: The repository MUST have `docs/` and `examples/` folders.
- **FR-012**: No root command MAY use `sudo`, and no privileged code is added by this feature.
- **FR-013**: No tests are written (constitution), so the ticket's test commands and trivial tests are dropped. The code is verified by running the commands by hand.

### Key Entities

- **Frontend project (`web/`)**: The browser application source and its tooling settings.
- **Backend project (`api/`)**: The Go module with API and worker entry points and one folder per responsibility.
- **Root command set**: The short commands at the repository root for start, build, lint, and the sandbox.
- **Environment example**: A list of settings with placeholder values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer goes from a fresh checkout to a running blank page in under 5 minutes, using only the README commands.
- **SC-002**: The backend starts in under 3 seconds and stops cleanly on interrupt 100% of the time.
- **SC-003**: The root build and lint commands each finish with zero errors on the starter code.
- **SC-004**: 100% of the ten responsibility folders exist, each with a purpose description.
- **SC-005**: Zero root commands use `sudo`.
- **SC-006**: Every setting the code reads appears in the example environment file.

## Assumptions

- Node and Go are already installed. The environment check from the sandbox feature confirms this on the current machine.
- The Makefile, backend module file, `.gitignore`, and sandbox folder from the sandbox feature already exist and are extended. The existing sandbox commands and the sandbox detection folder are kept as they are.
- The worker placeholder calls the existing sandbox check first, so `make sandbox-worker` keeps working and stays safe.
- Test tooling is left out because the constitution says no tests are written. This replaces the ticket's test commands.
- Frontend package versions are pinned at install time by the package manager lock file.
- The README is written in the later README ticket (NL-022); this feature only needs the commands to exist.
