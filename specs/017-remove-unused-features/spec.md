# Feature Specification: Remove Unused Features

**Feature Branch**: `017-remove-unused-features` (directory name; work stays on the current git branch)

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "@NL-cleanup.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The editor shows only what the draft labs need (Priority: P1)

A learner opens NetLab to rebuild one of the draft labs: a namespace, a bridge, a router, links, addresses, and routes. The editor shows controls only for those things. There are no fields for MTU, spanning tree, VLANs, or address-forwarding rules beyond masquerade. There are no empty "coming soon" tabs for packet capture, diagnostics, firewall state, and similar cut features. The palette lists only parts the learner can really place.

**Why this priority**: The editor is the whole visible product today. Controls that do nothing or that no draft lab uses make the app harder to learn and look unfinished.

**Independent Test**: Open the editor, select a namespace, a bridge, a link, and an interface in turn, and open the bottom drawer. No MTU, STP, or VLAN control is shown, the drawer shows only the Issues and Deployment logs tabs, and the palette has no "veth pair" or "NAT gateway" entry.

**Acceptance Scenarios**:

1. **Given** a namespace with an interface, **When** the learner selects the interface, **Then** the panel shows name, state, and addresses, and no MTU or "observed state" line.
2. **Given** a bridge, **When** the learner selects it, **Then** the panel shows its name and ports, and no spanning-tree or VLAN setting.
3. **Given** a link, **When** the learner selects it, **Then** the panel shows its two ends and state, and no MTU.
4. **Given** the bottom drawer, **When** it is open, **Then** only the Issues and Deployment logs tabs are present.
5. **Given** the palette, **When** the learner reads it, **Then** every entry can be dragged onto the canvas.

---

### User Story 2 - The project holds only code and files the app uses (Priority: P1)

A maintainer reads the repository to add the deploy features. They find no leftover packages, commands, test data, or settings for features that were cut: validation example vectors and their checker, empty placeholder packages for audit, capture, events, observer, and storage, packet-capture records, and the unused lab fields. Build, lint, and the remaining checks still pass.

**Why this priority**: The next tickets build on this code. Dead code costs reading time on every later change and invites reuse of things that are meant to be gone.

**Independent Test**: Search the repository for the removed feature names. Nothing is found, except one allowed mention. Run the build, the lint, the schema generation twice, and the example check. All pass and the second schema generation changes nothing.

**Acceptance Scenarios**:

1. **Given** the repository after the change, **When** it is searched for MTU, STP, VLAN, DNAT, capture, observed state, and vector, **Then** no match is found, except the `tcpdump` mention in the decisions record and the browser's own pointer-capture call used for dragging panel edges.
2. **Given** the repository after the change, **When** build and lint run, **Then** both pass.
3. **Given** the lab schema, **When** it is regenerated twice, **Then** the second run produces no change, and the frontend types match the backend model.
4. **Given** the example labs, **When** the example check runs, **Then** every example passes.

---

### User Story 3 - Names are plain ASCII (Priority: P2)

A learner types a node, interface, or bridge name. Names may contain only ASCII letters, digits, `-`, and `_`. A name with any other character, such as an accented letter, is flagged as a problem in the editor and by the backend check. Length is counted in plain characters.

**Why this priority**: The draft labs use simple ASCII names. This lets the byte-counting rules go, which makes the naming checks short enough to read in one sitting.

**Independent Test**: Type `café` as an interface name. The editor flags it. Run the backend check on a lab file with the same name. It reports the same problem.

**Acceptance Scenarios**:

1. **Given** a name with a non-ASCII character, **When** the lab is checked in the editor or in the backend, **Then** a character problem is reported.
2. **Given** an ASCII name within the length limit, **When** the lab is checked, **Then** no name problem is reported.

---

### User Story 4 - Old saved labs and the written decisions still make sense (Priority: P2)

A learner opens a lab file saved before this change, which may contain MTU, spanning-tree, or other removed fields. The lab opens, the removed fields are ignored, and saving it writes a clean file. The project's decisions record and sandbox notes describe the app as it now is: no login token, no database, no capture screen.

**Why this priority**: Existing files must not break, and documents that contradict the app mislead the next reader.

**Independent Test**: Open a saved lab that contains an `mtu` value and a bridge `stp` setting. It opens without an error. Read the decisions record and check each decision against the tickets index.

**Acceptance Scenarios**:

1. **Given** a lab file with removed fields, **When** it is opened, **Then** it loads, the removed fields are not shown, and saving drops them.
2. **Given** the decisions record, **When** it is read, **Then** it states: no token, no database, `nl-` plus lab name for resource names, fixed external programs by absolute path, no capture screen, and one desired-lab store.
3. **Given** the decisions record, **When** it is read, **Then** it has no "Known mismatches" section.

---

### Edge Cases

- A saved lab uses a NAT rule with DNAT fields: it opens, only the masquerade interface is kept, and the rest is ignored.
- A saved lab uses the `nat` role: it opens and the role is treated as unset, so the node is a plain namespace.
- A saved lab contains a link or interface name that is valid today but has a non-ASCII character: it opens and shows a name problem in the Issues tab.
- Something is removed that a later ticket still needs (for example the Deployment logs tab): that item is kept, and the cleanup list names it as kept.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The editor MUST NOT show MTU, spanning-tree, VLAN, or "observed state" controls or text anywhere.
- **FR-002**: The lab model MUST NOT include MTU, bridge spanning-tree or VLAN settings, capture records, DNAT rules, or the `nat` role. A NAT rule MUST be only an id and the outgoing interface it masquerades on.
- **FR-003**: The bottom drawer MUST show only the Issues and Deployment logs tabs.
- **FR-004**: The palette MUST NOT list the "veth pair" or "NAT gateway" entries, and every remaining entry MUST be placeable.
- **FR-005**: The repository MUST NOT contain the validation example vectors, their checker, the placeholder packages for audit, capture, events, observer, and storage, or any code that only served removed features. Deploy-time resource naming (prefix, lab id, and short hash for long names) is not removed.
- **FR-006**: Name checks MUST accept only ASCII letters, digits, `-`, and `_`, and MUST count length in plain characters. The editor and the backend MUST give the same result.
- **FR-007**: The backend validity check MUST take only the lab document. The existing-name check and the codes that served it MUST be removed.
- **FR-008**: The lab schema file and the frontend types MUST match the backend model, and regenerating them MUST produce no further change.
- **FR-009**: Opening a lab saved before this change MUST work. Removed fields MUST be ignored, and saving MUST write a file without them. The schema version MUST stay the same.
- **FR-010**: The three example labs MUST load and pass the example check with no removed fields.
- **FR-011**: The decisions record, the sandbox notes, and the README MUST describe the app as it now is, and MUST NOT mention removed features, except one `tcpdump` mention in the capture decision.
- **FR-012**: The earlier spec for backend validation MUST no longer promise vectors, existing names, or byte counting.
- **FR-013**: Things later tickets need MUST stay: the Deploy and Reset buttons (disabled), the Deployment logs tab, the bridge port list, interface and link state, routes, the router role, and the tools that print or generate the lab schema.

### Key Entities

- **Lab document**: the saved lab: nodes, interfaces, links, and canvas layout. After this change it holds no MTU, no bridge spanning-tree or VLAN settings, and NAT rules with only an id and an interface.
- **Issue**: one reported lab problem, with a code, a severity, and the resource it concerns. Issue codes tied to removed features no longer exist.
- **Example lab**: a ready-made lab in the Examples menu. All three remain and load cleanly.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A search of the repository for the removed feature names returns zero matches, apart from the one allowed `tcpdump` mention and the browser pointer-capture call.
- **SC-002**: Build, lint, and the example check pass on a clean checkout, and a second schema generation produces zero changes.
- **SC-003**: Selecting each kind of item (namespace, bridge, interface, link) shows zero controls for removed features.
- **SC-004**: 100% of lab files saved before this change that were tried (at least one with MTU and one with spanning-tree settings) open without an error.
- **SC-005**: The bottom drawer shows exactly 2 tabs and the palette shows only entries that can be placed.
- **SC-006**: Every decision in the decisions record agrees with the tickets index, found by reading both once.

## Assumptions

- The goal and scope come from `TICKETS/NL-cleanup.md`. The deploy, inspect, run, and example tickets that follow are not part of this feature.
- The app has no users with files that depend on removed fields, so ignoring those fields on open is enough. No conversion step is needed.
- Deleting is permanent. If a removed feature is needed again, a new ticket adds it back.
- The `nat` role goes away. Masquerade stays as a rule on an interface of any node, so the egress lab can use the host node for it. This is a guess made for simplicity.
- A removed item that turns out to be needed by a kept feature is kept, and the reason is written in the plan.
- Work stays on the current git branch.
