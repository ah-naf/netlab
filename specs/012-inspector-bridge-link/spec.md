# Feature Specification: Properties Panel for Bridges and Links

**Feature Branch**: `012-inspector-bridge-link` (directory name; work stays on the current git branch)

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "@TICKETS/NL-018-inspector-bridge-link.md"

## Clarifications

### Session 2026-10-31

- Q: Should a link get its own editable name, or stay derived from the interface names and MTU? → A: Derived only. No new field. The label changes when the interface names or the MTU change.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit a bridge and see its ports (Priority: P1)

The user selects a bridge node. The right-hand panel shows a form for it: the bridge name, a list of its ports, a spanning tree (STP) switch with a priority field, and a note that VLAN settings are not supported yet. Each port row shows the port name (editable) and what it is linked to: the other node and its interface, or "Not linked". The user can rename the bridge and each port, turn STP on or off, and set the STP priority. The canvas shows the new bridge name as soon as an edit is accepted.

**Why this priority**: A bridge is the switch of the lab. Without this panel it can only be named by double-clicking on the canvas, and its ports and spanning tree setting cannot be seen or changed at all.

**Independent Test**: Select a bridge with two linked ports. Rename it `core`, rename a port, switch STP on, set priority 4096, and see which node each port connects to. The canvas card shows `core` and the stored values match.

**Acceptance Scenarios**:

1. **Given** a bridge is selected, **When** the panel opens, **Then** it shows the bridge name, one row per port, the STP switch with its priority, and the VLAN note.
2. **Given** a bridge with linked ports, **When** the user looks at a port row, **Then** it shows the port name and the node and interface at the other end of its link.
3. **Given** a bridge with a port that is in no link, **When** the user looks at that row, **Then** it shows "Not linked".
4. **Given** the panel is open, **When** the user renames the bridge and confirms, **Then** the label on the canvas shows the new name.
5. **Given** the panel is open, **When** the user renames a port and confirms, **Then** the port row, the bridge card on the canvas, and every link label that shows that port update to the new name.
6. **Given** STP is off, **When** the user looks at the priority field, **Then** it is shown but cannot be edited; turning STP on makes it editable.
7. **Given** the VLAN section, **When** the user looks at it, **Then** it shows only a "not supported yet" note and no editable VLAN fields.
8. **Given** any accepted edit, **When** the user undoes it, **Then** the previous value returns, and one confirmed edit is one undo step.

---

### User Story 2 - Edit a link between two interfaces (Priority: P1)

The user selects a link by clicking it on the canvas. The panel shows endpoint A and endpoint B, each as the node name and the interface name (the interface name is editable), the link MTU, and the link state (up or down). Changing the MTU sets the same MTU on both endpoint interfaces. Changing the state sets the link up or down. The link label on the canvas updates with every accepted edit.

**Why this priority**: Links carry the traffic. Today the link panel only prints the label, so the MTU and state cannot be changed and the endpoint names cannot be fixed from the link.

**Independent Test**: Select a link between `ns1 eth0` and `br0 port1`. Rename the `ns1` end to `eth1`, set MTU 1400, and set the state down. The canvas label shows `eth1 ↔ port1 · MTU 1400`, and both endpoint interfaces now have MTU 1400.

**Acceptance Scenarios**:

1. **Given** a link is selected, **When** the panel opens, **Then** it shows endpoint A and endpoint B, each with its node name and interface name, plus the MTU and the state.
2. **Given** the panel is open, **When** the user renames an endpoint interface and confirms, **Then** the interface name changes everywhere it shows (canvas card, link label, the owner's panel).
3. **Given** the panel is open, **When** the user changes the MTU to a valid value and confirms, **Then** the link and both of its endpoint interfaces have that MTU, and the canvas label shows it.
4. **Given** the panel is open, **When** the user changes the state, **Then** the link state is stored and shown.
5. **Given** an endpoint belongs to a bridge or a namespace, **When** the user looks at it, **Then** the node name is shown as read-only text and only the interface name is editable.
6. **Given** any accepted edit, **When** the user undoes it, **Then** one undo reverses the whole edit, including the MTU change on both endpoints.

---

### User Story 3 - See the whole lab when nothing is selected (Priority: P2)

With nothing selected, the panel shows the editable lab name and summary counts: namespaces, bridges, interfaces, and links.

**Why this priority**: It gives a quick check of what the lab contains and is a natural home for the lab name. It does not change any lab data beyond the name.

**Independent Test**: Build a lab with two namespaces, one bridge, and two links. Deselect everything and read the counts: 2 namespaces, 1 bridge, 4 interfaces, 2 links. Add a node and see its count change.

**Acceptance Scenarios**:

1. **Given** nothing is selected, **When** the panel shows, **Then** it shows the lab name field and the counts of namespaces, bridges, interfaces, and links.
2. **Given** the lab changes (a node, interface, or link is added or removed), **When** nothing is selected, **Then** the counts update without reselecting.
3. **Given** the lab is empty, **When** nothing is selected, **Then** the counts show 0 and the lab name can still be edited.

---

### Edge Cases

- A bridge with no ports shows an empty port list and the existing add-port control.
- Removing a port from the panel removes the link attached to it, as in the existing document rules. A namespace interface at the other end stays, with its addresses; a bridge port at the other end is removed with the link.
- Renaming a port to a name another port on the same bridge uses is rejected with an error next to the field; the same rule applies to every interface name.
- Two links can join the same two nodes; each link panel shows its own endpoints.
- A link whose endpoint interface was removed is never selectable; if the selected link disappears (deleted or undone), the panel returns to the nothing-selected view.
- The STP priority is checked as the user types; it must stay a whole number in the allowed range, and an invalid value is never written to the lab.
- Selecting a different item while a field has an unconfirmed invalid draft discards that draft.
- The link MTU applies to both ends at once; if an endpoint interface had a different MTU before, both become the new link MTU.
- Names are stored as user-facing names only. The deploy-time Linux names are not shown or edited here.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When exactly one bridge is selected, the panel MUST show the bridge name, its ports, the STP switch with priority, and a VLAN note.
- **FR-002**: The bridge name and every port name MUST be editable, applying on confirm (Enter or leaving the field) and cancellable with Escape.
- **FR-003**: Each port row MUST show where the port leads: the other node and interface, or "Not linked".
- **FR-004**: The panel MUST provide an STP on/off switch and a priority field; the priority MUST be editable only while STP is on.
- **FR-005**: The VLAN section MUST be hidden behind a "not supported yet" note, with no editable VLAN fields.
- **FR-006**: When exactly one link is selected, the panel MUST show endpoint A and endpoint B (node name and interface name), the MTU, and the state.
- **FR-007**: Each endpoint interface name MUST be editable; the node name beside it MUST be read-only.
- **FR-008**: Changing the link MTU MUST set the same MTU on the link and on both endpoint interfaces in one step.
- **FR-009**: The link state MUST be changeable between up and down.
- **FR-010**: A link MUST NOT get a name of its own. Its canvas label MUST stay derived from the two endpoint interface names and the MTU, and MUST change when any of them changes.
- **FR-011**: With nothing selected, the panel MUST show the editable lab name and the counts of namespaces, bridges, interfaces, and links, kept current as the lab changes.
- **FR-012**: Every editable field MUST be checked as the user types, show its error next to the field, and write a value to the lab only when it is valid and confirmed; the lab MUST never hold an invalid value.
- **FR-013**: Field rules MUST be the same as in the namespace panel: bridge name not empty and unique among nodes; interface and port names 1 to 15 characters, no `/`, no whitespace, not `.` or `..`, and unique on their node; MTU a whole number from 68 to 65535; STP priority a whole number from 0 to 65535.
- **FR-014**: While any field has an unresolved error, the panel MUST show that the lab has errors, as the namespace panel does.
- **FR-015**: Every accepted edit MUST update the stored lab and the canvas, and MUST be one undoable step.
- **FR-016**: Names MUST be stored as user-facing names only; no Linux interface or bridge name is stored or shown.
- **FR-017**: The behavior MUST be verified by hand in the running app, per the project constitution.

### Key Entities

- **Bridge**: A node of type bridge with a name, ports (interfaces it owns), an STP setting (on or off, priority), and VLAN settings that are not editable yet.
- **Port**: An interface owned by a bridge, with a name and, when linked, a link to another interface.
- **Link**: Joins two interfaces; has an MTU and a state (up or down). Its canvas label shows both interface names and the MTU.
- **Lab summary**: The lab name and the counts of namespaces, bridges, interfaces, and links.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can rename a bridge, switch on STP with a priority, and read which node each port leads to in under 1 minute with no help.
- **SC-002**: A user can change a link's MTU and see both endpoints change in under 30 seconds.
- **SC-003**: 100% of invalid values in the covered fields show an error next to the field and none are written to the lab.
- **SC-004**: An error appears within 200 ms of typing an invalid value.
- **SC-005**: 100% of accepted edits show on the canvas without a reload, and one undo reverses exactly one edit.
- **SC-006**: The counts shown with nothing selected match the lab in 100% of checks after adds, deletes, and undo.

## Assumptions

- Selection of bridges and links, the namespace panel, field checks, undo and redo, and the lab name field from earlier features exist and are reused.
- A bridge's ports are the interfaces it owns; the other end of a port is found from the link that uses it.
- STP priority range follows the common limit for the bridge (0 to 65535); the default shown when none is set is 32768.
- The panel shows no "Observed" column for bridges and links; deployed state comes with a later feature.
- Per the project constitution, no test files are written; the ticket's acceptance is met by checking by hand in the app that renaming a bridge updates the canvas label and that changing a link MTU changes both endpoints.
- The link label on the canvas keeps its current form (both interface names and the MTU); the lab format does not change.
