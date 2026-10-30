# Feature Specification: Links Between Interface Handles

**Feature Branch**: `009-links` (directory name; work stays on the current git branch)

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "@TICKETS/NL-016-links.md"

## Clarifications

### Session 2026-10-30

- Q: When a link is deleted, should the namespace interface it used be deleted too? → A: No. Delete the bridge port, keep the namespace interface unlinked.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Connect nodes by dragging (Priority: P1)

The user drags from a connection handle on one node to a handle on another node. If the pair is allowed, a link appears on the canvas. The link joins two interfaces, one on each node, and Each node already shows its interfaces as handles, and the user adds namespace interfaces with the existing add-interface control. A bridge also offers a "new port" handle, so the user can connect to a bridge without adding a port first. Namespace to namespace creates a veth between two free interfaces, one in each namespace. Namespace to bridge creates a veth with the namespace end on a free namespace interface and the other end a port on the bridge, created automatically when the new-port handle is used. Bridge to bridge creates a veth whose two ends are both bridge ports, one on each bridge, each created automatically when its new-port handle is used.

**Why this priority**: Links are what turn separate nodes into a network. Without them a lab has nothing to deploy.

**Independent Test**: Build ns1, ns2, and br0 from the palette. Connect ns1 to br0 and ns2 to br0. The lab then has two links, two namespace interfaces, and two bridge ports, matching the structure of the bundled example lab (`examples/bridge-lab.json`).

**Acceptance Scenarios**:

1. **Given** two namespace nodes, **When** the user connects them, **Then** one link appears between the two chosen free interfaces and no interface is created.
2. **Given** a namespace and a bridge, **When** the user connects them, **Then** one link appears; when the bridge end is its new-port handle, the bridge gains a new port with a default name unique within the bridge, and that port is the other endpoint.
3. **Given** two bridges, **When** the user connects them, **Then** one link appears whose endpoints are bridge ports; each end made from a new-port handle gains a new port.
4. **Given** ns1, ns2, and br0 connected as ns1-br0 and ns2-br0, **When** the result is compared with the example lab, **Then** it has the same nodes, interface owners, and links, ignoring ids, positions, and addresses.
5. **Given** a namespace interface that is already in a link, **When** the user drags from or to it, **Then** it shows red with the reason "interface already linked" and no link is made.
6. **Given** a new link, **When** it is created, **Then** it has the default MTU, shared by both of its interfaces, and starts in the up state.

---

### User Story 2 - See allowed and rejected connections while dragging (Priority: P1)

While the user drags a connection, every candidate target shows green if the connection would be allowed and red if it would be rejected. When the user releases on a rejected target, no link is created and a visible message gives the reason.

**Why this priority**: Rules without feedback feel like a broken editor. The user must learn why a connection fails without guessing.

**Independent Test**: Drag from a namespace handle to itself, to a node already linked to it, and to a valid node. Self and duplicate targets show red with a reason on release; the valid target shows green and creates a link.

**Acceptance Scenarios**:

1. **Given** the user is dragging a connection, **When** the pointer is over a valid target, **Then** the target shows a green indicator.
2. **Given** the user is dragging a connection, **When** the pointer is over an invalid target, **Then** the target shows a red indicator.
3. **Given** the user releases on an invalid target, **When** the drag ends, **Then** no link, interface, or port is created and a visible message states the reason.
4. **Given** the user drags from a node onto the same node, **When** the pointer is over it, **Then** it shows red and the reason is "no self-links".
5. **Given** the user releases on empty canvas, **When** the drag ends, **Then** nothing is created and no error message shows.
6. **Given** a rejected connection, **When** the message shows, **Then** it names the specific rule broken (for example self-link, interface already linked, unsupported node pair), not a generic failure.

---

### User Story 3 - Read links on the canvas (Priority: P2)

Each link shows a label with its two interface names and its MTU. Clicking a link selects it and opens the link inspector.

**Why this priority**: The labels let the user check wiring at a glance. The inspector itself is built by another feature, so this story only needs selection to work.

**Independent Test**: Connect ns1 to br0. The link label shows both interface names and the MTU. Click the link and confirm it is selected and the properties panel receives it.

**Acceptance Scenarios**:

1. **Given** a link, **When** the user looks at it, **Then** its label shows both interface names and the MTU.
2. **Given** a link, **When** the user clicks it, **Then** it becomes the selected item and the properties panel switches to the link inspector.
3. **Given** a link, **When** an interface is renamed or the MTU changes, **Then** the label updates.
4. **Given** a selected link, **When** the user presses Delete, **Then** the link is removed together with its bridge ports, and any namespace interface it used is kept, unlinked, with its addresses.

---

### Edge Cases

- A connection to an interface that is already in a link is rejected with a visible reason; one interface is never in two links.
- A self-link is rejected, even when the node has several free interfaces.
- A second link between the same two nodes is allowed, because each link uses its own interfaces.
- Deleting a node removes its links and the bridge ports on the far side that belonged only to those links, following existing node-delete behavior; far-side namespace interfaces stay.
- Undo after creating a link removes the link and the interfaces created with it in one step; redo restores them.
- Connection types outside the three allowed pairs (for example a node type added later) are rejected with a reason naming the unsupported pair.
- Default interface and port names stay unique within their node after deletes and re-adds.
- A drag that starts and ends on the same handle without moving creates nothing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Connecting two handles MUST create one link with exactly two interface endpoints.
- **FR-002**: An interface MUST be in at most one link.
- **FR-003**: A connection from a node to itself MUST be rejected.
- **FR-004**: Namespace to namespace MUST create a veth link with both ends inside namespaces.
- **FR-005**: Namespace to bridge MUST create a veth link with the namespace end inside the namespace and the other end a port on the bridge.
- **FR-006**: Bridge to bridge MUST be allowed only as a veth pair whose two ends are ports on the two bridges. This rule MUST be documented for users.
- **FR-007**: Every other connection MUST be rejected with a visible reason.
- **FR-008**: When a link needs an interface on a bridge, the system MUST create the bridge port automatically.
- **FR-009**: A namespace end of a link MUST use an existing free interface chosen by the user; the system MUST NOT create namespace interfaces for links.
- **FR-010**: While a connection is dragged, every candidate target MUST show green when allowed and red when rejected.
- **FR-011**: A rejected connection MUST create nothing and MUST show a reason naming the broken rule.
- **FR-012**: Each link label MUST show both interface names and the MTU, and MUST update when they change.
- **FR-013**: Selecting a link MUST open the link inspector.
- **FR-014**: Deleting a link MUST delete the bridge ports it used and MUST keep namespace interfaces, with their addresses, unlinked.
- **FR-015**: Link creation MUST be a single undoable and redoable change that covers the link and all interfaces created with it.
- **FR-016**: The resulting lab data MUST stay valid against the topology document rules, so it can be saved and reloaded.
- **FR-017**: A new link MUST get the default MTU and the up state.
- **FR-018**: Every allowed and every rejected node pairing MUST be verified, by hand in the running app per the project constitution.

### Key Entities

- **Link**: An edge joining exactly two interfaces. Has a kind (veth), an MTU, and a state.
- **Interface**: A named endpoint owned by one node, in at most one link.
- **Bridge port**: An interface owned by a bridge, created automatically when a link attaches to the bridge.
- **Connection rule**: The allow or reject decision for a pair of node types, with a reason when rejected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can build ns1, ns2, br0 and wire them as in the example lab in under 2 minutes with no help.
- **SC-002**: 100% of node-type pairings are either allowed or rejected with a specific reason; none fail silently.
- **SC-003**: The wiring built by hand matches the example lab structurally on nodes, interface owners, and links.
- **SC-004**: A rejected drag leaves the lab unchanged in 100% of cases.
- **SC-005**: Users see green or red feedback within 100 ms of moving the pointer over a target.
- **SC-006**: One undo fully reverses a link creation, leaving no stray interface or port.

## Assumptions

- Node connection, node types, palette, and undo and redo from earlier features exist and are reused.
- Every interface already has its own connection handle (earlier feature); namespace interfaces are added by the user, and only bridge ports are auto-created, through a per-bridge new-port handle.
- The "veth pair" palette entry, which creates a link between two chosen interfaces, is out of scope here and stays unavailable.
- The link inspector is a separate feature; this feature only selects the link and passes it on. Editing names and MTU lives there.
- Default MTU is 1500, as in the example lab.
- Default interface names follow `eth0`, `eth1`, … on namespaces and `port1`, `port2`, … on bridges.
- "Bridge to bridge only through a veth pair" means the link is a veth whose two ends are both bridge ports; no direct bridge-to-bridge link kind exists.
- Per the project constitution, no test files are written; the ticket's test acceptance is met by running each combination by hand in the app.
