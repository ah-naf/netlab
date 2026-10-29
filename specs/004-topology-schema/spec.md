# Feature Specification: Topology Schema

**Feature Branch**: `004-topology-schema` (directory name; work stays on the current git branch)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "@TICKETS/NL-011-topology-schema.md"

## Clarifications

### Session 2026-10-29

- Q: Should capture sessions be saved inside the lab document, or kept as runtime records outside it? → A: The capture session shape is defined in the schema, but sessions are runtime records only. The saved lab document never contains them.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One saved format for a lab (Priority: P1)

A user's lab (nodes, interfaces, links, addresses, routes) is stored as one document with a clear, fixed structure. The browser and the server both read and write that same structure, so a lab saved by one is read correctly by the other. Every object has a stable id that does not change when the user renames it, moves it on the canvas, or the Linux name changes.

**Why this priority**: Every later feature (editor, validation, deployment, inspection) depends on this shared format.

**Independent Test**: Load the example lab document in the browser side and the server side, save each back out, and compare. The two outputs match the original after normalization.

**Acceptance Scenarios**:

1. **Given** the example bridge lab document, **When** it is loaded and saved again by the browser side, **Then** the saved content equals the original after normalization.
2. **Given** the same document, **When** the server side loads and saves it, **Then** the result equals the original after normalization.
3. **Given** a node is renamed or moved on the canvas, **When** the document is saved, **Then** its id is unchanged and its canvas position is stored apart from the network data.
4. **Given** the document, **When** a reader looks for the structure, **Then** a published schema file describes every field.

---

### User Story 2 - Interfaces and links are separate, explicit objects (Priority: P1)

A node is not the same thing as a network interface. Each interface is its own object that belongs to one node. A link joins exactly two interfaces by id. A bridge's ports are explicit interface entries on the bridge. Namespace roles (host, router, NAT gateway) are a property of a namespace node.

**Why this priority**: Without explicit interfaces and two-ended links, validation and deployment cannot be correct.

**Independent Test**: Read the example document and confirm: two namespace nodes and one bridge node, each namespace has an interface, the bridge has two port interfaces, and two links each reference two interface ids.

**Acceptance Scenarios**:

1. **Given** the example document, **When** inspected, **Then** it contains nodes `ns1`, `ns2`, and `br0`, two veth links, and addresses 10.0.0.1/24 and 10.0.0.2/24 on the namespace interfaces.
2. **Given** a link in the document, **When** inspected, **Then** it names exactly two interface ids and a kind.
3. **Given** a bridge node, **When** inspected, **Then** its ports appear as interface entries owned by that bridge.
4. **Given** a namespace node, **When** inspected, **Then** its role is one of host, router, or NAT gateway.

---

### User Story 3 - Old documents keep working as the format changes (Priority: P2)

Every document carries a schema version. A migration step upgrades older documents to the current version, and a document from a newer, unknown version is rejected with a clear message instead of being half-read.

**Why this priority**: The format will change as features grow. Saved labs must not break, but nothing needs migrating yet.

**Independent Test**: Pass a version 1 document through the migration step and get the current version back. Pass a document with a future version and get a clear refusal.

**Acceptance Scenarios**:

1. **Given** a document at the current version, **When** migrated, **Then** it is returned unchanged.
2. **Given** a document with a version newer than the supported one, **When** migrated, **Then** it is rejected with a message naming the unsupported version.
3. **Given** a document with no version, **When** loaded, **Then** it is rejected with a clear message.

---

### Edge Cases

- Unknown extra fields in a document: they are ignored on read and dropped on save (the document shape is fixed).
- A document that contains capture sessions: they are ignored on read and dropped on save, like any other unknown field.
- Empty lab (no nodes): valid, and round-trips as an empty lab.
- Missing optional parts (no routes, no VLAN settings, no layout): valid and treated as empty.
- Two objects with the same id: not caught by the schema alone; validation (a later feature) rejects it.
- A link pointing to an interface id that does not exist: not caught by the schema alone; validation (a later feature) rejects it.
- Very large labs (hundreds of nodes): the format has no fixed limit on counts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A lab document MUST have these parts: a schema version, lab details, nodes, interfaces, links, and a layout section for canvas positions.
- **FR-002**: Every node, interface, and link MUST have a stable id that does not depend on its Linux name or its canvas position.
- **FR-003**: A node MUST have a type of namespace or bridge. A namespace node MUST also have a role of host, router, or NAT gateway.
- **FR-004**: An interface MUST belong to exactly one node and MUST have a name, an MTU, a state, and a list of addresses.
- **FR-005**: A link MUST have exactly two endpoint interface ids, a kind (veth), an MTU, and a state.
- **FR-006**: A bridge node MUST list its ports as interface entries, with bridge settings for spanning tree and an optional VLAN section.
- **FR-007**: The format MUST represent addresses (CIDR), routes (destination, gateway, output interface, metric), router settings (forwarding), and NAT rules inside the lab document. It MUST also define the capture session shape, but the saved lab document MUST NOT contain capture sessions (they are runtime records only).
- **FR-008**: Canvas positions MUST be stored in the layout section, separate from the network data.
- **FR-009**: The browser side and the server side MUST read and write the same structure, and a published schema file MUST describe it.
- **FR-010**: A migration step MUST upgrade older documents to the current version and MUST reject documents with an unknown newer version or no version.
- **FR-011**: The project MUST include an example lab document with namespaces `ns1` and `ns2`, a bridge `br0`, two veth links, and addresses 10.0.0.1/24 and 10.0.0.2/24.
- **FR-012**: The schema MUST NOT check cross-references (duplicate ids, dangling endpoints); those checks belong to validation (NL-019, NL-030).
- **FR-013**: No tests are written (constitution). The round-trip and field-name agreement checks from the ticket are replaced by manual commands that compare the outputs.

### Key Entities

- **Lab document**: The saved lab. Holds version, lab details, nodes, interfaces, links, and layout.
- **Lab**: Id, name, and description.
- **Node**: Id, name, type (namespace or bridge), role (namespaces only), plus role or bridge settings.
- **Interface**: Id, owning node id, name, MTU, state, addresses.
- **Link**: Id, two interface ids, kind, MTU, state.
- **Address**: A CIDR string.
- **Route**: Destination, gateway, output interface id, metric.
- **Bridge settings**: Spanning tree settings and optional VLAN configuration.
- **Router settings**: Whether forwarding is on.
- **NAT rule**: A masquerade or destination-rewrite rule.
- **Capture session**: Id, interface id, filter, limits. Runtime record only; never stored in the lab document.
- **Layout**: Per-node canvas position.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The example lab round-trips on both the browser side and the server side with zero differences after normalization.
- **SC-002**: Renaming or moving 100% of nodes leaves every id unchanged.
- **SC-003**: Zero field-name mismatches between the browser side and the server side (checked by comparing both field lists).
- **SC-004**: A document with an unknown future version is rejected 100% of the time, with a message naming the version.
- **SC-005**: Every field in the format is described in the published schema file.
- **SC-006**: A new developer can read the schema file and the example and hand-write a valid two-namespace lab in under 15 minutes.

## Assumptions

- The ten decisions in `docs/decisions.md` apply: veth is an edge, roles belong to namespaces, names are user-facing and Linux names are derived later, and all names are editable in the UI.
- The scaffold (NL-010) exists, so `web/`, `api/internal/topology/`, `docs/`, and `examples/` are available.
- Only version 1 exists, so the migration step is a skeleton that accepts version 1 and rejects everything else.
- Validation of rules across objects (unique ids, valid CIDRs, valid endpoints) is separate work and not part of this feature.
- Tests are not written (constitution), so checks are manual commands.
- One side (server or browser) will be the single source of truth for the field list, so the other cannot drift. Which side is chosen in planning.
