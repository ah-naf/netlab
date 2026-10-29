# Feature Specification: Project Decisions Record

**Feature Branch**: `001-project-decisions` (no git repository; directory name only)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "@TICKETS/NL-000-decisions.md"

## Clarifications

### Session 2026-10-29

- Q: For packet capture, should NetLab depend on the external `tcpdump` program or capture inside its own Go code? → A: Use external `tcpdump` (install it) and decode its pcap output in Go.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One place for every open design choice (Priority: P1)

A developer starting any NetLab ticket opens a single decisions document and finds the agreed answer to each open choice from the product draft: how users authenticate, where data is stored, how links and roles are modeled, how resources are named, how the kernel is driven, how packets are captured, how privileged code is kept safe during development, how the frontend holds state, and how the API reports errors and versions.

**Why this priority**: Every later ticket depends on these answers. Without them, tickets stall or contradict each other.

**Independent Test**: Open the decisions document and confirm each of the ten decisions listed in the ticket has an entry with a clear outcome. Delivers value on its own because later work can start immediately.

**Acceptance Scenarios**:

1. **Given** the decisions document exists, **When** a developer looks up any of the ten decision topics, **Then** they find one entry with the chosen outcome and a one-paragraph rationale.
2. **Given** a topic has more than one viable option (packet capture), **When** the developer reads its entry, **Then** the chosen option, the rejected option, and the reason are all stated.

---

### User Story 2 - Project owner reviews and signs off (Priority: P2)

The project owner reads the record, can see the reasoning behind each choice, and can change any decision before work depends on it.

**Why this priority**: The decisions are assumptions made on the owner's behalf. They need confirmation before code builds on them.

**Independent Test**: The owner reads the document, marks each decision approved or changed, and the document shows the final state.

**Acceptance Scenarios**:

1. **Given** a drafted decisions document, **When** the owner disagrees with a decision, **Then** the entry can be edited and the change is visible with its new rationale.
2. **Given** the owner has reviewed every entry, **Then** the document states that it was reviewed and the date.

---

### User Story 3 - Tickets stay consistent with decisions (Priority: P3)

Anyone reading a ticket sees assumptions that match the decisions record. Where a ticket disagrees, the mismatch is found and fixed.

**Why this priority**: Prevents drift between the record and the plan, but only matters after the record exists.

**Independent Test**: Compare the assumptions stated in each ticket with the matching decision entry. Every mismatch is listed or resolved.

**Acceptance Scenarios**:

1. **Given** the decisions record and the existing tickets, **When** a reviewer compares them, **Then** no ticket contradicts an entry.

---

### Edge Cases

- A decision changes after tickets already depend on it: the entry records the change, and the affected tickets are listed for update.
- A decision cannot be settled yet (for example, a tool is not installed on the machine): the entry says what is missing and what the working default is, rather than leaving the topic blank.
- The owner rejects the recommended option: the entry records the rejected option as the alternative considered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST have one decisions document that lives in the repository's documentation folder.
- **FR-002**: The document MUST contain exactly one entry for each of these topics: authentication for version 1, data persistence, how veth links are modeled, how host, router, and NAT roles are modeled, resource naming and ownership, how the kernel is controlled, packet capture approach, sandboxed development of privileged code, frontend state handling, and API versioning and error format.
- **FR-003**: Each entry MUST state the decision and a one-paragraph rationale.
- **FR-004**: Entries with competing options MUST name the chosen option, the alternative, and why the choice was made.
- **FR-005**: The packet capture entry MUST record the decision to use the external `tcpdump` program with its output decoded in Go, name in-process capture as the rejected alternative, and state that `tcpdump` is not installed on the development machine and must be installed before capture work starts.
- **FR-006**: The resource naming entry MUST describe how names stay within the Linux interface-name length limit and how lab-owned resources are told apart from other resources.
- **FR-007**: The document MUST record the date it was written and the date the project owner reviewed it.
- **FR-008**: Assumptions stated in other tickets MUST match the document. Mismatches MUST be fixed or listed.
- **FR-009**: Decisions MUST respect the project constitution (simple code, no magic strings, sandboxed privileged execution, no tests written).

### Key Entities

- **Decision**: One settled design choice. Has a topic, an outcome, a rationale, and optionally a rejected alternative.
- **Decisions Record**: The collection of all decisions, with write date and owner review date.
- **Ticket Assumption**: A statement inside a ticket that depends on a decision.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All ten decision topics have an entry; zero topics are left blank or marked unknown.
- **SC-002**: A developer can find the answer to any open design question in under one minute.
- **SC-003**: The project owner can review the whole document in under 15 minutes.
- **SC-004**: Zero existing tickets contradict the record after the consistency pass.
- **SC-005**: No later ticket is blocked waiting for a design answer that this record should have given.

## Assumptions

- The ten decision topics and their recommended outcomes come from ticket NL-000 and are the starting content of the document.
- The project owner is the single reviewer and approver.
- The document is written in plain prose for people, and the constitution's no-tests rule applies, so review is a manual read-through.
- Packet capture uses the external `tcpdump` program (confirmed by the owner), with a design that allows replacing it later.
- Decisions can be changed later as long as the change is recorded in the same document.
