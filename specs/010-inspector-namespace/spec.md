# Feature Specification: Properties Panel for Namespaces

**Feature Branch**: `010-inspector-namespace` (directory name; work stays on the current git branch)

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "@TICKETS/NL-017-inspector-namespace.md"

## Clarifications

### Session 2026-10-30

- Q: Should an invalid value stay only in the field, or be saved into the lab and flagged? → A: Stay only in the field. The lab keeps its last valid value, so the lab never holds a bad value.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit a namespace and its interfaces (Priority: P1)

The user selects one namespace node. The right-hand panel shows a form for it: the node name, its role, and a list of its interfaces. Each interface row shows its name, MTU, state (up or down), and its addresses. The user can rename the namespace and each interface, change MTU and state, add an address, and remove an address. The canvas node updates to match as soon as an edit is accepted.

**Why this priority**: Without this the user can build the shape of a lab but cannot give any namespace an identity or an address, so the lab cannot do anything useful.

**Independent Test**: Select a namespace with one interface. Rename it to `web`, rename the interface to `eth1`, set MTU 1400, set state down, add `10.0.0.5/24`, then remove it. The canvas card shows each accepted change and the store holds the same values.

**Acceptance Scenarios**:

1. **Given** a namespace node is selected, **When** the panel opens, **Then** it shows the node name, the role, and one row per interface with name, MTU, state, and addresses.
2. **Given** the panel is open, **When** the user changes the node name or an interface name and confirms, **Then** the canvas card shows the new name.
3. **Given** an interface row, **When** the user enters a valid address in CIDR form and confirms, **Then** the address is added to that interface and shows on the canvas card.
4. **Given** an interface with addresses, **When** the user removes one, **Then** only that address is removed.
5. **Given** an interface row, **When** the user changes its MTU or state and confirms, **Then** the new value is stored and shown.
6. **Given** any accepted edit, **When** the user undoes it, **Then** the previous value returns, and one confirmed edit is one undo step.
7. **Given** a node has no interfaces, **When** the panel opens, **Then** it shows an empty interface list with the existing add-interface control.

---

### User Story 2 - See and fix invalid values as you type (Priority: P1)

Every field checks its value as the user types. An invalid value shows a plain-language error right next to that field. An invalid value is never written to the lab: the lab keeps its last valid value until the user fixes the field or cancels it. While any field has an unresolved error, the panel shows that the lab has errors, and the lab is not reported as valid.

**Why this priority**: A lab with a bad address or a duplicate name cannot be deployed. Catching it at the field is the cheapest place to fix it.

**Independent Test**: Type `10.0.0.5/99` as an address, then `abc`, then a name already used by another namespace, then an interface name with a space. Each shows its own error next to the field and nothing changes in the lab. Fix each value and the error clears and the edit is accepted.

**Acceptance Scenarios**:

1. **Given** an address field, **When** the user types an invalid CIDR (for example `10.0.0.5/99` or `abc`), **Then** an error appears next to the field and the lab keeps its previous addresses.
2. **Given** a node name field, **When** the user types an empty name or a name used by another node, **Then** an error appears next to the field and the lab keeps the old name.
3. **Given** an interface name field, **When** the user types a name that is empty, longer than 15 characters, contains `/` or whitespace, is `.` or `..`, or is used by another interface on the same node, **Then** an error appears next to the field and the lab keeps the old name.
4. **Given** an MTU field, **When** the user types a value that is not a whole number in the allowed range, **Then** an error appears next to the field.
5. **Given** a field shows an error, **When** the user fixes the value and confirms, **Then** the error clears and the edit is accepted.
6. **Given** a field shows an error, **When** the user presses Escape, **Then** the field returns to the last valid value and the error clears.
7. **Given** at least one unresolved field error, **When** the user looks at the panel, **Then** it shows that the lab has errors, and the lab is not reported as valid.

---

### User Story 3 - Set the role, default gateway, and static routes (Priority: P2)

Below the interfaces, the panel has the role (Host or Router), a default gateway field, and a table of static routes. A route has a destination, a gateway, an output interface chosen from this node's interfaces, and a metric. The user can add a route, edit any of its fields, and remove it. The same live checks apply: invalid destination, gateway, or metric shows an error next to that field.

**Why this priority**: Addresses alone give local connectivity. Routes and a gateway let traffic leave the local network, which is needed for routers and for hosts that reach other subnets.

**Independent Test**: On a namespace, set the role to Router, set the default gateway `10.0.0.1`, and add a route `192.168.5.0/24` via `10.0.0.254` out of `eth0` with metric 100. All are stored. Then enter destination `300.1.1.0/24` and see an error.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the user changes the role between Host and Router, **Then** the role is stored and the canvas card shows the matching icon.
2. **Given** a namespace with no default gateway, **When** the user enters a valid gateway address, **Then** the gateway is stored as the node's default route.
3. **Given** the routes table, **When** the user adds a route and fills destination, gateway, output interface, and metric, **Then** the route is stored once all fields are valid.
4. **Given** a route row, **When** the user removes it, **Then** only that route is removed.
5. **Given** a route row, **When** the user enters an invalid destination, gateway, or metric, **Then** an error appears next to that field and the route keeps its last valid value.
6. **Given** a route uses an output interface, **When** that interface is removed from the node, **Then** the route is removed with it, as the document rules require.
7. **Given** the output interface choice, **When** the user opens it, **Then** it lists only this node's interfaces by name.

---

### User Story 4 - Observed column and lab name (Priority: P3)

Interface rows and route rows have a read-only "Observed" column that shows "Not deployed". It cannot be edited. When nothing is selected, the panel offers an editable lab name with the same live checks.

**Why this priority**: The Observed column reserves the place where deployed state will appear later, so the layout will not change then. The lab name is a small gap in the naming rules.

**Independent Test**: Select a namespace and see "Not deployed" in the Observed column on every interface and route row, with no way to edit it. Deselect everything, rename the lab, and see the new name stored.

**Acceptance Scenarios**:

1. **Given** a namespace is selected, **When** the panel shows interface and route rows, **Then** each row has a read-only Observed value of "Not deployed".
2. **Given** nothing is selected, **When** the user edits the lab name and confirms, **Then** the lab name is stored.
3. **Given** the lab name field, **When** the user clears it, **Then** an error appears and the lab keeps its previous name.

---

### Edge Cases

- A name that differs only by case from another node's name is a different name, as for node rename today.
- An interface linked to another node can be renamed or re-addressed; the link and its label follow the new name.
- An address that is already on the same interface is rejected as a duplicate with an error next to the field.
- IPv6 CIDRs (for example `fd00::1/64`) are valid; the host bits may be set (`10.0.0.5/24` is valid).
- Removing an interface removes the routes that use it, and its links, as in the existing document rules.
- Selecting another node, or deleting the selected node, while a field has an unconfirmed invalid draft discards that draft.
- A node with many interfaces or routes keeps the panel scrollable; no rows are hidden.
- Selecting a bridge or several nodes does not show this form.
- A NAT gateway or a namespace with no role shows its role as read-only text, not as a Host or Router choice.
- Whole-lab validation (gateway reachable on a connected network, duplicate addresses across a segment) is not run by this panel; only per-field checks are.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When exactly one namespace node is selected, the panel MUST show a form with the node name, role, interface list, default gateway, and static routes table.
- **FR-002**: The node name and every interface name MUST be editable. Editing MUST apply on confirm (Enter or leaving the field) and MUST be cancellable with Escape.
- **FR-003**: Each interface row MUST show and allow editing of name, MTU, state, and addresses, with controls to add and remove an address.
- **FR-004**: The role MUST be changeable between Host and Router. For a NAT gateway or a namespace with no role, the role MUST be shown read-only.
- **FR-005**: The panel MUST provide a default gateway field. A valid value MUST be stored as the node's default route; clearing it MUST remove that route.
- **FR-006**: The panel MUST provide a static routes table with destination, gateway, output interface, and metric, and controls to add, edit, and remove a route. The default route is shown in the gateway field, not duplicated in the table.
- **FR-007**: Every editable field MUST be checked as the user types and MUST show its error next to the field.
- **FR-008**: An invalid value MUST NOT be written to the lab, so the lab never holds a bad value. The bad text stays only in the field, and the lab keeps its last valid value until the field is fixed or cancelled.
- **FR-009**: While any field has an unresolved error (an unconfirmed bad draft), the panel MUST show that the lab has errors, and the lab MUST NOT be reported as valid.
- **FR-010**: Field rules: the node name must not be empty and must be unique among nodes; an interface name must be 1 to 15 characters, must not contain `/` or whitespace, must not be `.` or `..`, and must be unique on its node; an address must be a valid IPv4 or IPv6 CIDR and not already on that interface; MTU must be a whole number from 68 to 65535; a gateway must be a valid IPv4 or IPv6 address; a route destination must be a valid CIDR; a metric must be a whole number from 0 up.
- **FR-011**: The output interface of a route MUST be chosen from the interfaces of the same node.
- **FR-012**: Every accepted edit MUST update the stored lab and the node on the canvas, and MUST be one undoable step.
- **FR-013**: Interface rows and route rows MUST include a read-only Observed column showing "Not deployed".
- **FR-014**: When nothing is selected, the panel MUST offer an editable lab name with the same live check (not empty).
- **FR-015**: Adding and removing addresses and routes MUST be verified by hand in the running app, per the project constitution.
- **FR-016**: Field rules MUST live in one reusable place so the later whole-lab validator uses the same rules and messages.

### Key Entities

- **Namespace node**: A node with a name, a role (host, router, NAT, or none), interfaces, and static routes.
- **Interface**: A named endpoint on a node with MTU, state, and addresses.
- **Address**: A CIDR value on an interface.
- **Route**: Destination, gateway, output interface, metric. The default route is a route to everywhere.
- **Field error**: A message tied to one field and one value, never saved to the lab.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can give a namespace a name, an address, a default gateway, and one static route in under 2 minutes with no help.
- **SC-002**: 100% of invalid values in the covered fields show an error next to the field and none are written to the lab.
- **SC-003**: An error appears within 200 ms of the user typing the invalid value.
- **SC-004**: Every accepted edit is visible on the canvas node (where the node shows that value) with no reload.
- **SC-005**: One undo reverses exactly one confirmed edit in 100% of cases.
- **SC-006**: After fixing every error, the panel shows no error state in 100% of cases.

## Assumptions

- Node selection, rename, undo and redo, and the add-interface control from earlier features exist and are reused.
- This feature does not depend on the whole-lab validator; it ships its own per-field checks and keeps them reusable so the validator can adopt them.
- Edits are confirmed with Enter or by leaving the field, as the existing inline rename does; this keeps one edit as one undo step. Errors still show while typing.
- The default gateway has no field of its own in the lab format; it is stored as a route to 0.0.0.0/0 (IPv4) or ::/0 (IPv6) with the gateway address, and the field shows whichever default route exists.
- Role choices are Host and Router, as the ticket says. NAT gateways and role-less namespaces keep their role and show it read-only.
- Router settings such as forwarding are not edited here.
- The MTU range 68 to 65535 follows common network limits; link-level MTU stays with the link inspector.
- The lab name edit lives in the nothing-selected view; the summary counts in that view come with the link and bridge panel feature.
- Per the project constitution, no test files are written; the ticket's test acceptance is met by running add and remove address and add and remove route by hand in the app.
