# Feature Specification: Palette, Drag and Drop, and Node Operations

**Feature Branch**: `008-palette-and-node-ops` (directory name; work stays on the current git branch)

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "@TICKETS/NL-015-palette-and-node-ops.md"

## Clarifications

### Session 2026-10-30

- Q: What should a plain Namespace node look like compared with a Host, given the schema allows a namespace with no role? → A: Namespace has no role and shows its own generic namespace icon, distinct from Host.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Build a lab from the palette (Priority: P1)

The left column shows a palette of building blocks: Namespace, Host, veth pair, Linux bridge, Router, and NAT gateway. Each entry has an icon, a name, and a one-line description. The user drags an entry onto the canvas and a new node appears where it was dropped, with a unique default name. Host and Router create a namespace with the matching role, NAT gateway creates a namespace with the NAT role, and Linux bridge creates a bridge.

**Why this priority**: Until users can add nodes, they can only look at the example lab. This is the core of building a topology.

**Independent Test**: Drag each of Namespace, Host, Router, NAT gateway, and Linux bridge onto the canvas. Each creates one node of the right kind and role at the drop point with a name no other node has.

**Acceptance Scenarios**:

1. **Given** the palette is shown, **When** the user looks at it, **Then** it lists Namespace, Host, veth pair, Linux bridge, Router, and NAT gateway, each with an icon and a short description.
2. **Given** an empty spot on the canvas, **When** the user drags Namespace onto it, **Then** a namespace node appears at the drop point with a default name that no other node uses.
3. **Given** the user drags Host, Router, or NAT gateway onto the canvas, **When** the node appears, **Then** it is a namespace with the role host, router, or NAT, shown with the matching role icon; a plain Namespace has no role and shows its own generic namespace icon, different from the Host icon.
4. **Given** the user drags Linux bridge onto the canvas, **When** the node appears, **Then** it is a bridge node with a default name that no other node uses.
5. **Given** several nodes were dropped in a row, **When** the user reads their names, **Then** every name is unique.
6. **Given** the user drags a palette entry but releases it outside the canvas, **When** the drag ends, **Then** nothing is created.

---

### User Story 2 - Find palette entries by search (Priority: P2)

A search box above the palette filters the entries as the user types. It matches the entry name and description, ignoring letter case. Clearing the box shows all entries again. If nothing matches, the palette says so.

**Why this priority**: With six entries the palette is easy to scan, but the filter is required and the list will grow in later features.

**Independent Test**: Type "bridge", then "NAT", then "zzz", then clear the box. Matching entries show, then the empty message, then all six.

**Acceptance Scenarios**:

1. **Given** the palette shows all entries, **When** the user types "bridge", **Then** only entries whose name or description contains "bridge" show.
2. **Given** a filter is active, **When** the user clears the search box, **Then** all six entries show again.
3. **Given** the text matches no entry, **When** the user looks at the palette, **Then** it shows a short "no matches" message.
4. **Given** the user types in uppercase, **When** entries match in lowercase, **Then** they still show.

---

### User Story 3 - Select, delete, and rename nodes (Priority: P1)

The user can select one node by clicking it, or several by shift-clicking or by dragging a selection box on empty canvas. Pressing Delete removes every selected node together with all of its interfaces and all links attached to it. The user can rename a node in place by double-clicking its name; Enter keeps the new name and Escape cancels.

**Why this priority**: Users make mistakes and change their minds. Without delete and rename the editor cannot be used for real work.

**Independent Test**: Select ns1 and br0 together, press Delete: both nodes, their interfaces, and the links to them are gone and ns2 remains. Rename ns2 to "web" and see the new name on the card.

**Acceptance Scenarios**:

1. **Given** the canvas has nodes, **When** the user clicks a node, **Then** only that node is selected.
2. **Given** a node is selected, **When** the user shift-clicks another node, **Then** both are selected.
3. **Given** the user drags a box over empty canvas, **When** the box covers nodes, **Then** those nodes are selected.
4. **Given** one or more nodes are selected, **When** the user presses Delete, **Then** those nodes, all their interfaces, and all links attached to those interfaces are removed, and no other node or link changes.
5. **Given** a node name is shown, **When** the user double-clicks it, **Then** it becomes an editable field with the current name.
6. **Given** a name is being edited, **When** the user types a new name and presses Enter, **Then** the node shows the new name.
7. **Given** a name is being edited, **When** the user presses Escape, **Then** the old name stays.
8. **Given** a name is being edited, **When** the new name is empty or equal to another node's name, **Then** it is not accepted, the field shows an error, and the old name stays until the user fixes it or cancels.
9. **Given** the user is typing in the rename field or the palette search box, **When** the user presses Delete or Backspace, **Then** text is edited and no node is deleted.

---

### User Story 4 - Duplicate nodes (Priority: P2)

With nodes selected, Ctrl+D makes copies. Each copy gets a new unique id and a new unique name, appears slightly offset from the original, and has its own copy of the original's interfaces (new ids, same names, MTU, and addresses). Links that join two duplicated nodes are copied between the copies. Links from a duplicated node to a node that was not duplicated are not copied. The copies become the new selection.

**Why this priority**: A time saver for repeated hosts, but every flow still works by dragging from the palette.

**Independent Test**: Select ns1 and br0 and press Ctrl+D: two new nodes appear, the copy of ns1 is linked to the copy of br0, neither copy is linked to ns2, and no id or name repeats.

**Acceptance Scenarios**:

1. **Given** one node is selected, **When** the user presses Ctrl+D, **Then** a copy appears slightly offset with a new unique name and new unique ids, and the copy is selected.
2. **Given** a node with interfaces and addresses, **When** it is duplicated, **Then** the copy has the same interface names, MTU, state, and addresses, each with a new id.
3. **Given** two linked nodes are both selected, **When** they are duplicated, **Then** the copies are linked to each other through the copied interfaces.
4. **Given** a selected node is linked to a node that is not selected, **When** it is duplicated, **Then** the copy has no link to the outside node, and the original keeps its link.
5. **Given** no node is selected, **When** the user presses Ctrl+D, **Then** nothing happens.

---

### User Story 5 - Undo and redo (Priority: P2)

The user can undo and redo changes to the lab: adding, deleting, duplicating, renaming, moving nodes, and adding or removing interfaces. Ctrl+Z undoes the last change, Ctrl+Shift+Z (or Ctrl+Y) redoes it. A change made after an undo discards the redo steps. Selection and scrolling are not part of history.

**Why this priority**: Delete and duplicate act on many items at once, so a safe way back matters, but the editor works without it.

**Independent Test**: Delete a node, press Ctrl+Z and the node and its links return exactly as they were; press Ctrl+Shift+Z and it is gone again.

**Acceptance Scenarios**:

1. **Given** a node was just deleted, **When** the user presses Ctrl+Z, **Then** the node, its interfaces, and its links are restored with their original ids.
2. **Given** an undo was done, **When** the user presses Ctrl+Shift+Z, **Then** the undone change is applied again.
3. **Given** an undo was done, **When** the user makes a new change, **Then** the redo steps are discarded.
4. **Given** a node was dragged to a new place, **When** the user presses Ctrl+Z, **Then** the whole drag is undone in one step, not one step per pixel.
5. **Given** nothing can be undone or redone, **When** the user presses the shortcut, **Then** nothing happens.
6. **Given** the user is typing in a text field, **When** the user presses Ctrl+Z, **Then** the field's own text undo is used, not the lab history.
7. **Given** a new lab document is loaded, **When** the user presses Ctrl+Z, **Then** nothing happens, because history starts empty.

---

### User Story 6 - The veth pair entry points to links (Priority: P3)

The palette shows a "veth pair" entry so the full set of building blocks is visible. A veth pair is a link, not a node, so dropping it never creates a node. Until link drawing exists, the entry is disabled and says "Not available yet" on hover.

**Why this priority**: It keeps the palette honest and ready for the link feature without making a fake node.

**Independent Test**: Look at the veth pair entry: it is disabled, hovering shows "Not available yet", and trying to drag it creates nothing.

**Acceptance Scenarios**:

1. **Given** the palette, **When** the user looks at the veth pair entry, **Then** it shows an icon, name, and description like the others and appears disabled.
2. **Given** the veth pair entry, **When** the user hovers it, **Then** a message says it is not available yet.
3. **Given** the veth pair entry, **When** the user tries to drag it onto the canvas, **Then** no node is created.

---

### Edge Cases

- Two nodes dropped at the same spot: both are created, and neither is hidden by the other beyond overlap (they may overlap; the user can drag them apart).
- Default names skip names already in use, including names the user typed. If `ns2` was renamed, a new namespace can reuse `ns2` only if no node currently has it.
- Deleting a node that has routes or NAT rules pointing at its interfaces: those references on other nodes are removed too, so no dangling interface id remains.
- Duplicating a node twice in a row: the copies get different names (for example `ns1` copies become `ns3`, then `ns4`, depending on what is in use).
- Deleting everything: the canvas is empty and the palette still works.
- Delete, Ctrl+D, and Ctrl+Z are ignored while a text field has focus (palette search, rename field).
- Undoing a rename restores the old name even if that name was later given to another node: the rename that caused the conflict is undone first because history is linear.
- A very long name is cut off on the card, with the full name on hover and in the rename field.
- History is capped so memory stays small; the oldest steps are dropped first.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The left column MUST show a palette with the entries Namespace, Host, veth pair, Linux bridge, Router, and NAT gateway, each with an icon, a name, and a one-line description.
- **FR-002**: The palette MUST have a search box that filters entries by name and description, ignoring letter case, shows a "no matches" message when nothing matches, and shows all entries when empty.
- **FR-003**: Dragging Namespace, Host, Router, NAT gateway, or Linux bridge onto the canvas MUST create exactly one node at the drop point: a namespace with no role and its own generic icon for Namespace, a namespace with role host, router, or NAT for the matching entries, and a bridge for Linux bridge.
- **FR-004**: Every new node MUST get a default name that is unique among all current nodes, built from a short prefix and the smallest free number, and a unique id that is never reused in the document.
- **FR-005**: Releasing a palette drag outside the canvas MUST create nothing.
- **FR-006**: The veth pair entry MUST NOT create a node. It MUST be shown disabled with the hover text "Not available yet" until link creation exists.
- **FR-007**: Users MUST be able to select one node by click, add to the selection by shift-click, and select several with a selection box dragged on empty canvas. Clicking empty canvas clears the selection.
- **FR-008**: Pressing Delete with nodes selected MUST remove those nodes, every interface they own, every link attached to those interfaces, and every route or NAT rule on other nodes that points at those interfaces.
- **FR-009**: Pressing Ctrl+D with nodes selected MUST create a copy of each selected node with a new unique id and name, offset from the original, each with copies of its interfaces (new ids; same name, MTU, state, and addresses), and MUST select the copies.
- **FR-010**: Duplicating MUST copy a link only when both of its ends belong to duplicated nodes; the copied link joins the copied interfaces. Links to nodes that were not duplicated MUST NOT be copied.
- **FR-011**: Double-clicking a node name MUST start inline rename. Enter MUST commit, Escape MUST cancel, and an empty name or a name already used by another node MUST be rejected with a visible message, leaving the old name in place.
- **FR-012**: The lab document MUST keep a history of changes. Ctrl+Z MUST undo, and Ctrl+Shift+Z or Ctrl+Y MUST redo, the last change to nodes, interfaces, links, names, and positions. A new change after an undo MUST discard the redo steps.
- **FR-013**: One user action MUST be one history step: a drag, a multi-node delete, or a duplicate of many nodes undoes in a single step.
- **FR-014**: Selection MUST NOT be part of history. Loading a new document MUST clear history.
- **FR-015**: History MUST keep at most 100 steps, dropping the oldest first.
- **FR-016**: Delete, Ctrl+D, Ctrl+Z, and redo shortcuts MUST NOT act on the lab while a text field has focus.
- **FR-017**: After every create, duplicate, delete, undo, and redo, the document MUST be valid: all ids unique, all names unique per node scope, and no link, route, or NAT rule pointing at a missing interface.
- **FR-018**: Palette entries, the search box, and the delete, duplicate, and undo actions MUST be usable with the keyboard where a keyboard equivalent exists (the search box, shortcuts, and rename field), and palette entries MUST have accessible names.
- **FR-019**: No tests are written (constitution). The ticket's checks (create, duplicate, delete produce valid documents; drag each palette item) are done by hand in the running app, including checking the document for unique ids and no dangling endpoints.

### Key Entities

- **Palette entry**: A name, an icon, a one-line description, what it creates (a namespace with a role, a bridge, or nothing), and whether it is available.
- **Lab document**: The existing canonical record of nodes, interfaces, links, and layout. This feature adds nodes to it, removes nodes from it, and copies parts of it.
- **Node**: A namespace (with role none, host, router, or NAT) or a bridge, with a unique id and a unique name.
- **Selection**: The set of currently selected node ids. Not part of the document and not part of history.
- **History**: An ordered list of earlier and later document states, with a position, capped at 100 steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each of the five node entries creates the right kind of node at the drop point on the first try, 5 out of 5.
- **SC-002**: After creating 30 nodes in a row from any mix of entries, all 30 names and ids are unique.
- **SC-003**: After any delete, duplicate, undo, or redo, 0 links, routes, or NAT rules point at a missing interface and 0 ids repeat.
- **SC-004**: A user can add a node and see it on the canvas in a single drag, with no extra dialog.
- **SC-005**: Typing in the search box updates the visible entries as the user types, with no visible delay.
- **SC-006**: Undo followed by redo returns the lab to exactly the state before the undo (same ids, names, positions, and links) in 100% of tested cases.
- **SC-007**: Deleting or duplicating 20 selected nodes responds without visible lag.

## Assumptions

- The custom nodes feature exists: node cards, interface handles, the lab store, and the interface add and remove actions. This feature builds on them.
- Default name prefixes: `ns` for Namespace and Host (starting at 1: `ns1`, `ns2`), `r` for Router, `nat` for NAT gateway, and `br` for Linux bridge (starting at 0: `br0`). The number is the smallest one not in use for that prefix. The ticket gives only `ns1`, `ns2`, `br0` as examples.
- New nodes start with no interfaces. Users add interfaces with the existing add-interface controls. A new bridge starts with spanning tree off, like the example.
- Namespace, Host, Router, and NAT gateway differ only by role. A plain Namespace has no role and shows its own generic namespace icon, so it never looks like a Host.
- The veth pair entry is disabled until the link feature adds link-creation mode, following the app's "Not available yet" convention. The ticket's behavior (entering link-creation mode) arrives with that feature.
- Copies from Ctrl+D are offset by a fixed small distance from their originals. Pasting from the clipboard (Ctrl+C, Ctrl+V) is out of scope.
- Rename applies to nodes only. Interface rename is part of the later inspector features.
- History lives in memory only and is lost on reload. Saving and loading are separate later features.
- Desktop-first with mouse and keyboard; touch drag and drop is out of scope.
- No tests are written, per the constitution; verification is by hand in the running app.
