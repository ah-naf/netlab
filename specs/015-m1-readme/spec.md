# Feature Specification: Milestone 1 README

**Feature Branch**: `015-m1-readme` (directory name; work stays on the current git branch)

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "@TICKETS/NL-022-m1-readme.md"

## Clarifications

### Session 2026-10-31

- Q: Should the architecture diagram be text characters, a rendered-diagram format, or an image file? → A: A rendered-diagram format (Mermaid) written in the README. A short plain list of the five parts sits next to it so readers where it is not rendered still understand.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand what NetLab is and how it fits together (Priority: P1)

A developer who has never seen the project opens the repository front page. In a few paragraphs they learn what NetLab is, who it is for, and how its parts fit together: the browser frontend, the API, the privileged worker, the observer, and packet capture. A diagram shows how these parts talk to each other and which of them exist in Milestone 1.

**Why this priority**: Without an explanation of what the project is, the rest of the page has no context. This is the first thing every visitor reads.

**Independent Test**: Ask someone who has never seen the repo to read only the first screen of the README and explain, in their own words, what NetLab does and name the five parts. They get at least four of the five right.

**Acceptance Scenarios**:

1. **Given** the repository front page, **When** a new reader opens it, **Then** the first paragraph says what NetLab is and what a lab is.
2. **Given** the README, **When** the reader looks for the architecture, **Then** a Mermaid diagram shows the frontend, API, worker, observer, and capture, with arrows for how they connect, and a short plain list below it names the five parts and what each does.
3. **Given** the diagram, **When** the reader looks at it, **Then** it is clear which parts are built in Milestone 1 and which come later.
4. **Given** the README, **When** the reader looks for what Milestone 1 can do, **Then** a short list says: draw a lab on a canvas, edit it, validate it, save and open it, and use examples; deploying a lab is not part of it yet.

---

### User Story 2 - Reach a working canvas from a fresh clone (Priority: P1)

A developer clones the repository on a clean machine and follows only the README. They check the prerequisites, install the frontend, start the frontend and the API, open the browser, and see the working canvas with the connection indicator showing the API is reachable. Every command in the quick start works exactly as written.

**Why this priority**: This is the ticket's acceptance. A README with steps that do not work is worse than none.

**Independent Test**: On a clean checkout (or a second person's machine), follow the quick start line by line with no other help. Within 10 minutes the canvas is on screen, two namespaces can be dragged on, and the connection indicator shows connected.

**Acceptance Scenarios**:

1. **Given** a clean machine, **When** the reader reads the prerequisites, **Then** every tool needed for Milestone 1 is listed with its minimum version and a command to check it.
2. **Given** the prerequisites are met, **When** the reader runs the install command, **Then** the frontend dependencies install without extra steps.
3. **Given** installed dependencies, **When** the reader starts the frontend and the API as the README says, **Then** the app opens in the browser with an empty canvas.
4. **Given** both servers are running, **When** the reader looks at the toolbar, **Then** the connection indicator shows the API is reachable, and the README says what to expect.
5. **Given** the API is not running, **When** the reader opens the app, **Then** the README's troubleshooting note explains what the disconnected indicator means and how to start the API.
6. **Given** any command in the quick start, **When** it is run from the stated folder, **Then** it succeeds; the README states the folder for each command.

---

### User Story 3 - Know what runs as root and how to use the sandbox (Priority: P1)

The reader learns that nothing in Milestone 1 needs root or changes the host network. They see how the sandbox works in one short paragraph and a link to the full sandbox page, so they know how to run privileged code safely when later milestones need it.

**Why this priority**: The project is about network namespaces and bridges. A reader must know immediately that following the README cannot damage their machine.

**Independent Test**: Ask the reader whether following the README needs `sudo` and what the sandbox is for. They answer "no" and give a correct one-line description.

**Acceptance Scenarios**:

1. **Given** the README, **When** the reader looks for safety information, **Then** a clear statement says that nothing in Milestone 1 needs root.
2. **Given** that statement, **When** the reader wants more, **Then** a link leads to the sandbox page, and a short paragraph explains the sandbox in plain words.
3. **Given** the README, **When** the reader scans every command, **Then** none uses `sudo`.
4. **Given** the sandbox section, **When** the reader wants to check their machine, **Then** it names the environment check command and what a pass looks like.

---

### User Story 4 - Find my way around the project and run the checks (Priority: P2)

The reader sees a short map of the project folders and what lives in each. They also find the commands to run every check that exists today, with what a pass looks like for each.

**Why this priority**: A contributor needs this soon after the quick start, but it does not block a first run.

**Independent Test**: A new contributor runs each listed check command and sees the stated pass result.

**Acceptance Scenarios**:

1. **Given** the README, **When** the reader looks at the project layout, **Then** each top-level folder (frontend, API, docs, examples, scripts, specs, test data) has a one-line description.
2. **Given** the README, **When** the reader looks for checks, **Then** every check that exists is listed with its command, the folder to run it from, and the expected pass result: build and lint, the validator vectors, the example labs, and the sandbox integration check.
3. **Given** a check that is not available in Milestone 1 (for example an end-to-end browser test), **When** the README mentions it, **Then** it is marked as not yet available and the README does not list a command that fails.
4. **Given** the README, **When** the reader wants more detail, **Then** links lead to the decisions page, the sandbox page, and the topology format page.

---

### Edge Cases

- A command in the README that stops working after a later change must be caught: the README states that it is checked on a clean checkout before each milestone is closed.
- The diagram is not rendered in a terminal or plain editor; the plain list under it carries the same information, and the diagram block is checked to render on the hosting site before the milestone closes.
- A reader on a machine without user namespaces enabled gets a pointer to the environment check and the sandbox page's remediation text instead of a dead end.
- A reader without the API tools installed can still run the frontend alone; the README says so and says what changes (connection indicator shows disconnected).
- Operating system: the README states which systems are supported for development (Linux) and says other systems are not supported for the sandbox.
- Ports and addresses used by the frontend and API are stated so the reader can open the right page; the README says what to do if a port is busy.
- Names of make targets and scripts match the real ones exactly; a target that does not exist is never listed.
- The README does not repeat the full sandbox or decisions text; it links to them to avoid two copies that drift.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST have a front-page README at the root that opens with what NetLab is, who it is for, and what a lab is, in plain words.
- **FR-002**: The README MUST include an architecture diagram written as a Mermaid block showing the frontend, API, worker, observer, and capture, and how they connect, with the Milestone 1 parts marked; a plain-text list of the five parts and their jobs MUST follow it so the page stays clear where the diagram is not rendered.
- **FR-003**: The README MUST list what Milestone 1 includes and what it does not (deploying a lab is not included).
- **FR-004**: The README MUST list the prerequisites with minimum versions and a check command for each, and state the supported development system.
- **FR-005**: The README MUST give a quick start for the frontend and for the API, each with the exact commands and the folder to run them from, ending with the app open and the connection indicator showing connected.
- **FR-006**: The README MUST say what the reader sees when the API is not running and how to fix it.
- **FR-007**: The README MUST state that nothing in Milestone 1 needs root, MUST NOT use `sudo` in any command, and MUST explain the sandbox in a short paragraph with a link to the sandbox page.
- **FR-008**: The README MUST describe the project layout with one line per top-level folder.
- **FR-009**: The README MUST list every check that exists today, each with its command, folder, and expected pass result: build, lint and format, validator vectors, example labs, and the sandbox integration check.
- **FR-010**: The README MUST NOT list a command or make target that does not exist; checks not yet available (for example an end-to-end browser test) MUST be marked as not available yet.
- **FR-011**: The README MUST link to the sandbox page, the decisions page, and the topology format page instead of copying their content.
- **FR-012**: The README MUST state the ports the frontend and API use and what to do when one is busy.
- **FR-013**: A fresh clone that follows only the README MUST reach a working canvas and passing checks; this MUST be verified on a clean checkout before the milestone is closed.
- **FR-014**: Per the project constitution, no automated tests are written; the README's commands are verified by running them by hand.

### Key Entities

- **README**: The front-page document of the repository, written for a new developer.
- **Architecture diagram**: A Mermaid diagram inside the README of the five parts and how they connect, with Milestone 1 parts marked, plus a plain list of the parts.
- **Quick start**: The ordered list of commands from a clean clone to a working canvas.
- **Check**: A command that proves part of the project works, with its folder and expected pass result.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new developer on a clean machine reaches a working canvas with the connection indicator showing connected in under 10 minutes, using only the README.
- **SC-002**: 100% of commands in the README succeed when run as written from the stated folder on a clean checkout.
- **SC-003**: 100% of the checks listed in the README print the stated pass result.
- **SC-004**: A reader who reads only the first screen can name at least four of the five architecture parts and say that nothing needs root.
- **SC-005**: A second person following the README needs zero questions to the author to reach a working canvas.
- **SC-006**: The README contains no command that uses `sudo` and no reference to a target or script that does not exist.

## Assumptions

- The frontend runs from the `web` folder and the API from the `api` folder, as today's make targets and scripts do; the README uses the existing make targets where they exist.
- Milestone 1 delivers the canvas, editing, validation, save and open, and examples; the API in Milestone 1 serves a health check only; the worker, observer, and capture are shown in the diagram as later parts.
- Development is supported on Linux; the sandbox needs user namespaces.
- The ticket asks for "test commands for each suite". Per the constitution, no automated tests are written, so "suite" means the checks that exist today (build and lint, validator vectors, example labs, sandbox integration check). The automated frontend tests and end-to-end test from the previous ticket do not exist; the README marks them not available yet and lists no command for them.
- The sandbox, decisions, and topology format pages already exist and are linked, not rewritten.
- A second person or a clean checkout does the final run-through; the author's own machine is not enough evidence.
