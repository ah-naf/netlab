# Feature Specification: Custom Nodes and Interface Handles

**Feature Branch**: `007-custom-nodes` (directory name; work stays on the current git branch `NL-014-custom-nodes`)

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "@TICKETS/NL-014-custom-nodes.md"

## Clarifications

### Session 2026-10-30

- Q: How should the bridge example get into the app for this feature, since open/save does not exist yet? → A: It loads automatically at app start.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See a lab on the canvas (Priority: P1)

When a lab document is loaded (for example the bridge example with two hosts and one bridge), the canvas shows one card per node at its saved position. A namespace card shows its name, an icon for its role (host, router, or NAT), and a list of its interfaces with their IP addresses. A bridge card shows its name and its ports. Every interface or port has its own connection point on the card, so a link can later attach to a specific interface and not just to the node.

**Why this priority**: Nothing else in the editor (palette, links, inspector) can be used or checked until nodes are visible. This is the core slice.

**Independent Test**: Load the bridge example. The canvas shows 3 cards (ns1, ns2, br0). ns1 and ns2 each list `eth0` with its address. br0 lists `port1` and `port2`. Each listed interface has exactly one connection point.

**Acceptance Scenarios**:

1. **Given** the bridge example is loaded, **When** the canvas appears, **Then** it shows 3 node cards at the positions saved in the document.
2. **Given** a namespace card, **When** the user looks at it, **Then** it shows the node name, a role icon, and each interface name with its addresses.
3. **Given** a bridge card, **When** the user looks at it, **Then** it shows the node name and the list of its ports.
4. **Given** any node card, **When** the user looks at its interfaces, **Then** each interface has its own connection point, and the point is tied to that interface's id (not to the node).
5. **Given** an interface with no address, **When** the card is shown, **Then** the interface is listed without an address and no placeholder address is invented.
6. **Given** a namespace with no interfaces, **When** the card is shown, **Then** it shows the name and role and an empty interface list without errors.

---

### User Story 2 - Add and remove interfaces (Priority: P1)

The user can add a new interface to a node and remove an existing one, either directly on the node card or from the inspector. A new interface gets a unique id and a default name that does not clash with the other interfaces on that node. It appears at once as a new connection point. Removing an interface removes its connection point, and any link attached to that interface is removed with it.

**Why this priority**: Links attach to interfaces, so users must be able to create the interfaces they need. The ticket's own test targets this behavior.

**Independent Test**: With the bridge example loaded, add an interface to ns1. A new row and a new connection point appear, and the lab document has a new interface entry with an id different from all others. Remove it and both disappear.

**Acceptance Scenarios**:

1. **Given** a namespace card, **When** the user adds an interface from the card, **Then** a new interface appears in the list with its own connection point and a new entry exists in the lab document with a unique id.
2. **Given** a selected node, **When** the user adds an interface from the inspector, **Then** the result is the same as adding it from the card.
3. **Given** a node that already has `eth0`, **When** the user adds another interface, **Then** it gets a default name that is not already used on that node (for example `eth1`).
4. **Given** an interface that has a link attached, **When** the user removes the interface, **Then** the interface, its connection point, and the attached link are all removed from the document and the canvas.
5. **Given** an interface without a link, **When** the user removes it, **Then** only that interface and its connection point are removed.
6. **Given** a bridge card, **When** the user adds a port, **Then** a new port appears with its own connection point, the same way as for a namespace.

---

### User Story 3 - One source of truth for the lab (Priority: P1)

The lab document is held in one canonical place in the app. The canvas is always drawn from that document: changing the document changes the canvas, and node positions on the canvas are written back to the document's layout. The canvas never keeps a separate copy of names, interfaces, or addresses.

**Why this priority**: Later features (save, load, validate, deploy) all read or write the same document. Two diverging copies would cause silent data loss.

**Independent Test**: Load the example, add an interface, drag a node, and inspect the document: it has the new interface and the new position. Reload the same example: the canvas matches the document again.

**Acceptance Scenarios**:

1. **Given** a loaded document, **When** an interface is added or removed, **Then** the document is updated first and the canvas reflects the document.
2. **Given** a loaded document, **When** the user drags a node, **Then** the node's saved position in the document's layout is updated.
3. **Given** a new document is loaded, **When** it replaces the old one, **Then** the canvas shows only the new document's nodes.
4. **Given** the document is empty, **When** the canvas is shown, **Then** it is empty with no errors.

---

### User Story 4 - Status styles on nodes (Priority: P2)

Each node card can show one of four statuses: desired, deployed, failed, or drifted. Each status has a distinct look (color and a text or icon cue, so color alone is never the only signal). For now every node is shown as desired, because deployment does not exist yet. The status is an input to the card, so later features only have to supply it.

**Why this priority**: It prepares the visual language for deploy and drift features, but nothing can be deployed yet, so it does not block the editing workflow.

**Independent Test**: Render a card with each of the four statuses and confirm all four look different and are labeled. Load the example and confirm every card shows desired.

**Acceptance Scenarios**:

1. **Given** the example is loaded, **When** the canvas appears, **Then** every node card shows the desired style.
2. **Given** a card given status deployed, failed, or drifted, **When** it is shown, **Then** it uses that status's distinct style.
3. **Given** any status style, **When** the user looks at it in light and in dark appearance, **Then** it is readable and distinguishable from the other three without relying on color alone.

---

### Edge Cases

- Interface ids are never reused within a document, even after a removal, so an old id cannot point to a different interface by accident.
- Two interfaces on the same node must never share a name; the default name for a new interface skips names in use.
- A node with many interfaces: the card grows to list them all, and connection points stay aligned with their rows and do not overlap.
- A long node name or a long address list does not break the card layout; text is cut off with the full text available on hover.
- A document where a link refers to an interface that does not exist: the canvas does not crash; the dangling link is not drawn.
- Removing the last interface of a node is allowed.
- Add and remove are only offered for namespace and bridge nodes, the only node types that exist.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The canvas MUST draw each namespace node as a card showing its name, a role icon (host, router, NAT), and a list of its interfaces with their addresses.
- **FR-002**: The canvas MUST draw each bridge node as a card showing its name and the list of its ports.
- **FR-003**: Every interface or port MUST have its own connection point on its node card. The connection point's identifier MUST equal the interface id. A node itself MUST NOT be a connection point.
- **FR-004**: The bridge example MUST load automatically at app start, and loading it MUST show 3 nodes with 4 correct connection points: one each on ns1 and ns2, and two on br0.
- **FR-005**: Users MUST be able to add an interface to a node from the node card and from the inspector, with the same result.
- **FR-006**: Adding an interface MUST create a new entry in the lab document with an id unique within the document and a default name unique on that node, and MUST show a new connection point.
- **FR-007**: Users MUST be able to remove an interface from the node card and from the inspector. Removing it MUST also remove its connection point and every link attached to it.
- **FR-008**: The lab document MUST be held in one canonical store. The canvas nodes and links MUST be derived from it and MUST NOT hold their own copy of lab data.
- **FR-009**: Dragging a node MUST update that node's position in the document's layout only, with no change to the network model.
- **FR-010**: Node cards MUST support four statuses: desired, deployed, failed, drifted. Each MUST have a distinct style with a non-color cue. The status is supplied from outside the card and MUST be desired for all nodes in this feature.
- **FR-011**: The node cards MUST work in both light and dark appearance, using the app's named theme colors.
- **FR-012**: Add and remove actions MUST be reachable with the keyboard, and each connection point MUST have an accessible name that includes the node name and interface name.
- **FR-013**: The canvas MUST NOT crash on an empty document, a node with no interfaces, or a link whose interface is missing.
- **FR-014**: No tests are written (constitution). The ticket's check "adding an interface creates a handle and a store entry with a unique id" is verified by hand in the running app, and the check that the bridge example shows 3 nodes with correct handles is also verified by hand.

### Key Entities

- **Lab document**: The canonical record of the lab: nodes, interfaces, links, and layout. Held in one place; all views derive from it.
- **Node**: A namespace (with a role: host, router, NAT) or a bridge. Has a stable id and a name. It owns a set of interfaces but is not itself a connection point.
- **Interface**: Belongs to one node. Has a unique id, a name unique on its node, and zero or more addresses. For a bridge, the interfaces are its ports. Its id is the connection point id.
- **Link**: Joins two interfaces. Exists only while both interfaces exist.
- **Node status**: One of desired, deployed, failed, drifted. Controls the card style. Always desired for now.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Loading the bridge example shows 3 node cards and 4 connection points, each matching an interface in the document, with 0 missing and 0 extra.
- **SC-002**: A user can add an interface to a node in 2 clicks or fewer, and the new row and connection point appear immediately.
- **SC-003**: After adding 20 interfaces in a row across nodes, 100% of ids in the document are unique.
- **SC-004**: Removing an interface leaves 0 links in the document that point to it.
- **SC-005**: After any add, remove, or drag, the canvas matches the document exactly (no node, interface, or position differs).
- **SC-006**: All four status styles are visibly distinct from each other in both light and dark appearance.
- **SC-007**: A canvas of 20 nodes with 5 interfaces each stays responsive when dragging a node, with no visible lag.

## Assumptions

- The topology schema and the bridge example from the schema feature exist and are the shape of the lab document.
- The app shell from the previous feature exists; the canvas fills its center area and the inspector area is the right column.
- The inspector for each node type is built in later features. This feature only adds the add/remove interface controls there (a minimal inspector section for a selected node), not the full inspector.
- Adding nodes from a palette, deleting nodes, and drawing links are separate later features and are out of scope. Existing links in a loaded document are drawn if the canvas shows them, but creating links is out of scope.
- The bridge example loads automatically at app start, so the canvas is never empty on first run. A real open/save flow is a later feature and will replace this.
- The status value is a plain input with default desired. Real deployed, failed, and drifted data comes from later deployment features.
- Default interface names are `eth0`, `eth1`, ... for namespaces and `port1`, `port2`, ... for bridges, using the first number not in use on that node.
- No tests are written, per the constitution; verification is by hand in the running app.
- Desktop-first, mouse and keyboard; touch is out of scope.
