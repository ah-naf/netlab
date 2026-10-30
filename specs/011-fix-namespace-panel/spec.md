# Feature Specification: Fix Namespace Panel Route Crash and Unclear Layout

**Feature Branch**: `011-fix-namespace-panel` (directory name; work stays on the current git branch)

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "[Image #1] See the left sidebar for host. UI is ambigous. Cant understand which is what. Clicking on Add route gives error "maximum depth reached"."

## Clarifications

### Session 2026-10-30

- Q: Does "the left sidebar for host" mean the Inspector panel or the Components palette? → A: The Inspector panel only (form for the selected namespace). The palette is out of scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a static route without an error (Priority: P1)

The user selects a namespace and clicks "Add route" in the Inspector. A new, empty route row opens so they can type a destination, gateway, output interface, and metric. Today the click fails with the error "Maximum update depth exceeded" and the panel is unusable. The same must hold for a namespace that already has routes: its saved route rows must show without error.

**Why this priority**: The feature cannot be used at all. Static routes are one of the four things the panel exists for, and the failure blocks the whole panel, not just the route table.

**Independent Test**: Select a namespace with one interface. Click "Add route". A new route row appears with no error. Fill destination `192.168.5.0/24` and gateway `10.0.0.254`, confirm, and the route is saved and its row shows again without error.

**Acceptance Scenarios**:

1. **Given** a namespace with no routes, **When** the user clicks "Add route", **Then** an empty route row opens and no error appears.
2. **Given** a namespace with no interfaces, **When** the user clicks "Add route", **Then** an empty route row opens and the output interface choice shows only "None".
3. **Given** a namespace with saved routes, **When** it is selected, **Then** every saved route row shows its values without error.
4. **Given** a new route row is open, **When** the user confirms a valid route, **Then** the route is saved and the row becomes a saved route row.
5. **Given** a new route row is open, **When** the user presses Cancel, **Then** the row closes and nothing is saved.
6. **Given** the panel is showing any namespace, **When** the user uses any control in it (rename, add or remove interface, address, gateway, role, route), **Then** no control causes the panel to fail or show a framework error.

---

### User Story 2 - Tell the panel's fields apart at a glance (Priority: P2)

The Inspector for a namespace mixes node settings, interface settings, and routing in one column of similar-looking fields. In the reported screenshot of host `ns1`, the user cannot tell which field belongs to what: several controls are all named "Remove", a hint like `10.0.0.5/24` looks like a real value, the saved address `10.0.0.1/24` has no label, and "Observed: Not deployed" has no clear meaning. The panel must make clear what each field is, which group it belongs to, and what each button does.

**Why this priority**: The data editing works but users hesitate or edit the wrong thing, which defeats the panel's purpose. It does not block use the way the crash does.

**Independent Test**: Show a namespace with two interfaces, each with an address, and one route. Without reading help text, a new user can say which address belongs to which interface, which button deletes the address and which deletes the interface, and which values are real and which are hints.

**Acceptance Scenarios**:

1. **Given** the panel shows a namespace, **When** the user looks at it, **Then** it has four clearly titled groups: the node itself (name and role), Interfaces, Default gateway, and Static routes.
2. **Given** a namespace with several interfaces, **When** the user looks at the Interfaces group, **Then** each interface is its own visually separate block with the interface name as its title, and every field inside it belongs to that interface.
3. **Given** an interface with addresses, **When** the user looks at it, **Then** the addresses sit under a label ("Addresses") and the field for adding one is clearly the add field, not a saved value.
4. **Given** any Remove control, **When** the user looks at it, **Then** its text or label says what it removes (for example "Remove address 10.0.0.1/24" or "Remove interface eth0"), and removing an interface is visually separate from removing an address.
5. **Given** an empty field with a hint, **When** the user looks at it, **Then** the hint is clearly an example (written like "e.g. 10.0.0.5/24") and cannot be mistaken for a saved value.
6. **Given** an interface or a route, **When** the user looks at its Observed line, **Then** it is labeled as the live state of the deployed lab, kept visually secondary, and worded the same on every row.
7. **Given** the node name field and the interface name field, **When** the user looks at them, **Then** their labels differ enough to tell them apart ("Namespace name" and "Interface name").
8. **Given** the role of a NAT gateway or a namespace with no role, **When** the user looks at it, **Then** it is clearly shown as a fixed value, not as an editable field.

---

### Edge Cases

- A namespace with no interfaces still lets the user open and cancel a new route row.
- Opening a new route row, then selecting another node, discards the row without error.
- A saved route row and a new route row both list this node's interfaces by name and update when an interface is added, renamed, or removed.
- Rapid repeated clicks on "Add route" open only one new route row.
- A very long interface name, address list, or route does not hide or overlap the controls next to it.
- The panel is narrow; groups and labels stay readable and do not rely on color alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Clicking "Add route" MUST open an empty route row without any error, for a namespace with no routes, with saved routes, with no interfaces, and with many interfaces.
- **FR-002**: Saved route rows MUST render without error for any number of routes.
- **FR-003**: No control in the namespace panel MAY cause the panel to fail or show a framework error. A failure in one part of the panel MUST NOT leave the rest unusable.
- **FR-004**: The panel MUST show four titled groups: node (name and role), Interfaces, Default gateway, and Static routes.
- **FR-005**: Each interface MUST be shown as its own visually separate block titled with the interface name, and every control inside it MUST belong to that interface.
- **FR-006**: An interface's addresses MUST sit under a visible label, and the add-address field MUST be clearly distinct from saved addresses.
- **FR-007**: Every Remove control MUST say what it removes, in visible text or a visible label, and removing an interface MUST be visually separate from removing an address or a route.
- **FR-008**: Hints inside empty fields MUST read as examples and MUST NOT look like saved values.
- **FR-009**: The Observed value MUST have one consistent label and wording on every interface and route row, and MUST be visually secondary to editable fields.
- **FR-010**: The node name field MUST be labeled "Namespace name" and the interface field "Interface name".
- **FR-011**: A read-only role (NAT gateway or no role) MUST be shown as fixed text, visibly different from an editable field.
- **FR-012**: The layout MUST NOT rely on color alone to tell groups, fields, or errors apart.
- **FR-013**: The change MUST be checked by hand in the running app, per the project constitution.

### Key Entities

- **Namespace panel**: The Inspector view for one selected namespace, made of the node group, the Interfaces group, the Default gateway group, and the Static routes group.
- **Interface block**: One interface's name, MTU, state, addresses, Observed line, and its own remove control.
- **Route row**: A saved or new route with destination, gateway, output interface, metric, Observed line, and remove or confirm and cancel controls.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: "Add route" opens a route row without error in 100% of attempts, across namespaces with 0, 1, and many interfaces and routes.
- **SC-002**: 0 framework errors appear in the browser console while using every control in the namespace panel once.
- **SC-003**: In a review of the panel for a namespace with two interfaces, 5 of 5 new users correctly say which button removes an address and which removes an interface.
- **SC-004**: 5 of 5 new users correctly tell a saved value from an example hint on the first look.
- **SC-005**: A new user can find where to edit an interface's MTU, an address, and a route's gateway in under 20 seconds each, without help.

## Assumptions

- The layout complaints apply to the Inspector panel shown for host `ns1` in the screenshot (the column with Name, Role, Interfaces, Default gateway, and Static routes). The Components palette is not part of this change.
- The "maximum depth reached" error is the browser's "Maximum update depth exceeded" message and appears when the route row opens; no other action in the panel is known to trigger it, but FR-003 requires that none does.
- The meaning, rules, and storage of fields stay as specified for the namespace panel feature; this change adds no field and no rule.
- Wording changes to labels and buttons are allowed; the Observed value stays "Not deployed" until deployed state exists.
- Per the project constitution, no test files are written; verification is by hand in the running app.
