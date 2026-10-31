---

description: "Task list for Properties Panel for Bridges and Links"
---

# Tasks: Properties Panel for Bridges and Links

**Input**: Design documents from `/specs/012-inspector-bridge-link/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Design rule**: Follow the 011 [UI contract](../011-fix-namespace-panel/contracts/ui-contract.md) so the panels look alike: titled `Section` groups, bordered blocks with a `chassis` header strip, `RemoveAction` with the target named, example-style hints, errors under the field. Existing theme tokens only, sentence case, never color alone. Use the frontend-design skill for UI tasks.

**Crash rule**: any `useTopologyStore` selector that returns an array or object (anything but a primitive or an existing store reference) MUST be wrapped in `useShallow` from `zustand/react/shallow`; the 011 "Maximum update depth exceeded" crash came from skipping this.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding. Do not commit unless the user asks.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Texts and the one new rule shared by every story.

- [X] T001 [P] Create `src/constants/inspectorBridgeLink.ts` with: `STP_PRIORITY_MIN = 0`, `STP_PRIORITY_MAX = 65535`, `STP_PRIORITY_DEFAULT = 32768`; `BRIDGE_LINK_GROUP_TITLE` entries `BRIDGE: "Bridge"`, `PORTS: "Ports"`, `STP: "Spanning tree"`, `VLAN: "VLAN"`, `LINK: "Link"`, `ENDPOINT_A: "Endpoint A"`, `ENDPOINT_B: "Endpoint B"`, `LAB: "Lab"`, `SUMMARY: "Summary"`; `BRIDGE_LINK_FIELD_LABEL` entries `BRIDGE_NAME: "Bridge name"`, `PORT_NAME: "Port name"`, `STP: "STP enabled"`, `STP_PRIORITY: "STP priority"`, `LINK_MTU: "MTU"`, `LINK_STATE: "State"`, `ENDPOINT_NODE: "Node"`, `ENDPOINT_INTERFACE: "Interface name"`; `LEADS_TO_LABEL = "Leads to"`, `NOT_LINKED_TEXT = "Not linked"`, `VLAN_NOTE = "VLAN settings are not supported yet."`, `SUMMARY_LABEL = { namespaces: "Namespaces", bridges: "Bridges", interfaces: "Interfaces", links: "Links" }`; `STP_ERROR = "STP priority must be a whole number from 0 to 65535"`; `peerText(nodeName, interfaceName)` returning `<node> <interface>`; also edit `src/constants/inspector.ts` and add `PORT: "Remove port"` to the existing `REMOVE_TEXT` (do not make a second remove constant). Name the two new objects `BRIDGE_LINK_GROUP_TITLE` and `BRIDGE_LINK_FIELD_LABEL` because `GROUP_TITLE` and `FIELD_LABEL` already exist in `inspector.ts`
- [X] T002 Edit `src/store/fieldRules.ts`: add `validateStpPriority(text)` returning `STP_ERROR` unless the text is "a whole number, 0 to 65535" (digits only, within `STP_PRIORITY_MIN` and `STP_PRIORITY_MAX`), else null; import the constants from `src/constants/inspectorBridgeLink.ts`. Depends on T001

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Pure operations and the field behavior the views need.

**CRITICAL**: No story starts before this phase is done.

- [X] T003 Create `src/store/bridgeLinkOps.ts` of pure functions (never mutate): `setStp(document, nodeId, stp: boolean)` sets `bridge.stp`, keeping `stpPriority` and `vlan`; `setStpPriority(document, nodeId, priority: number)` sets `bridge.stpPriority`; both create `bridge: { stp: false }` first when the node has no `bridge` object (the field is optional in the lab format) instead of failing; `setLinkMtu(document, linkId, mtu: number)` sets `mtu` on the link and on both endpoint interfaces (matched by `endpointA` and `endpointB` ids) in one returned document; `setLinkState(document, linkId, state)` sets the link `state` to `up` or `down`; `peerOf(document, interfaceId)` finds the link whose `endpointA` or `endpointB` is that interface, takes the other endpoint, and returns `{ nodeName, interfaceName }` of that interface and its node, or `null` when the interface is in no link; `summarize(document)` returns `{ namespaces, bridges, interfaces, links }` counts (namespaces and bridges counted by node `type`). Use `NODE_TYPE` from `src/constants/topology.ts`
- [X] T004 [P] Edit `src/components/inspector/ValidatedField.tsx`: add an optional `disabled` prop passed to the input; a disabled field also shows a muted look (`disabled:opacity-60 disabled:cursor-not-allowed`)

**Checkpoint**: Operations and rules compile; the UI is unchanged.

---

## Phase 3: User Story 1 - Edit a bridge and see its ports (Priority: P1) MVP

**Goal**: Selecting a bridge shows a form for its name, ports (with where each leads), STP, and the VLAN note.

**Independent Test**: quickstart.md "Bridge", steps 1 to 7.

- [ ] T005 [P] [US1] Create `src/components/inspector/PortRow.tsx`: props `interfaceId`; a bordered block with a `chassis` header strip showing the port name and, at the right, `RemoveAction` with `danger` (text `REMOVE_TEXT.PORT`, label `removeLabel(REMOVE_TEXT.PORT, name)`) calling the store's `removeInterface(interfaceId)`; inside, a `ValidatedField` "Port name" (`validateInterfaceName`, commit `renameInterface` through `edit`) and a line `LEADS_TO_LABEL` with `peerText(...)` from `peerOf`, or `NOT_LINKED_TEXT` when null. Read the document with `useTopologyStore((s) => s.document)` (a store reference)
- [ ] T006 [P] [US1] Create `src/components/inspector/StpFields.tsx`: props `nodeId`; a labeled checkbox `BRIDGE_LINK_FIELD_LABEL.STP` writing `setStp` through `edit` immediately; a `ValidatedField` `BRIDGE_LINK_FIELD_LABEL.STP_PRIORITY` with value `String(bridge?.stpPriority ?? STP_PRIORITY_DEFAULT)` (read `bridge` with optional chaining and treat a missing `bridge` as STP off), rule `validateStpPriority`, commit `setStpPriority(Number(text))`, and `disabled` while STP is off (the field stays visible). Depends on T002, T003, T004
- [ ] T007 [US1] Create `src/components/inspector/BridgeForm.tsx`: props `nodeId`; four `Section`s with `BRIDGE_LINK_GROUP_TITLE`: Bridge (a `ValidatedField` "Bridge name" using `validateNodeName` and `renameNode` from `src/store/documentOps.ts`), Ports (one `PortRow` per port from `interfacesOf(...)` ids read with `useShallow`, then the existing `AddInterfaceButton`), Spanning tree (`StpFields`), VLAN (a muted paragraph `VLAN_NOTE`, no inputs). Depends on T005, T006
- [ ] T008 [US1] Edit `src/components/NodeInspector.tsx`: when exactly one selected node has type bridge, render `BridgeForm` with `key={node.id}`; delete the old inline bridge view, the `items` selector, and these imports, which `NodeInspector.tsx` no longer uses: `AddInterfaceButton`, `InterfaceLabel`, `RemoveInterfaceButton`, `interfacesOf`, `useShallow`
- [ ] T009 [US1] Manual check from quickstart.md "Bridge" steps 1 to 7; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: A bridge can be named, its ports read and renamed, and STP set from the panel.

---

## Phase 4: User Story 2 - Edit a link between two interfaces (Priority: P1)

**Goal**: Selecting a link shows both endpoints, editable interface names, the MTU (applied to both endpoints), and the state.

**Independent Test**: quickstart.md "Link", steps 1 to 7.

- [ ] T010 [P] [US2] Create `src/components/inspector/LinkEndpoint.tsx`: props `interfaceId`; read-only text `BRIDGE_LINK_FIELD_LABEL.ENDPOINT_NODE` with the owning node's name, and a `ValidatedField` `BRIDGE_LINK_FIELD_LABEL.ENDPOINT_INTERFACE` (`validateInterfaceName`, commit `renameInterface` through `edit`)
- [ ] T011 [US2] Create `src/components/inspector/LinkForm.tsx`: props `linkId`; `Section`s: Link (a `ValidatedField` `BRIDGE_LINK_FIELD_LABEL.LINK_MTU` with `validateMtu` and commit `setLinkMtu(Number(text))` through `edit`, and a `SelectField` `BRIDGE_LINK_FIELD_LABEL.LINK_STATE` with `STATE_CHOICES` writing `setLinkState` immediately), Endpoint A (`LinkEndpoint` for `endpointA`), Endpoint B (`LinkEndpoint` for `endpointB`); return null when the link no longer exists. Depends on T003, T010
- [ ] T012 [US2] Edit `src/components/NodeInspector.tsx`: read `selectedLinkId` and whether that link exists (a boolean selector); when a link is selected and exists, render `LinkForm` with `key={linkId}`; remove the old `linkText` selector and the `LINK_SELECTED_HINT` use. Then remove `LINK_SELECTED_HINT` from `src/constants/links.ts`
- [ ] T013 [US2] Manual check from quickstart.md "Link" steps 1 to 7 (including MTU on both endpoints and one undo reversing it); `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Links edit like every other part of the lab.

---

## Phase 5: User Story 3 - See the whole lab when nothing is selected (Priority: P2)

**Goal**: The nothing-selected view shows the lab name and live counts.

**Independent Test**: quickstart.md "Nothing selected", steps 1 to 3.

- [ ] T014 [P] [US3] Create `src/components/inspector/LabSummary.tsx`: read `summarize(s.document)` with `useTopologyStore(useShallow(...))` (an object of numbers); render a definition list with one row per count using `SUMMARY_LABEL`
- [ ] T015 [US3] Edit `src/components/NodeInspector.tsx`: in the nothing-selected view render two `Section`s: `BRIDGE_LINK_GROUP_TITLE.LAB` with `LabNameField`, and `BRIDGE_LINK_GROUP_TITLE.SUMMARY` with `LabSummary`; keep the existing "select a node" hint below. Depends on T014
- [ ] T016 [US3] Manual check from quickstart.md "Nothing selected" steps 1 to 3 (counts follow add, delete, undo); `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: All three stories work together.

---

## Phase 6: Polish

- [ ] T017 Run the whole of quickstart.md once on a fresh page load with the console open and use every control once; no console errors, no "Maximum update depth exceeded"
- [ ] T018 Confirm the crash rule and the constitution across the new files: every array or object selector is wrapped in `useShallow`; no inline strings with meaning; every function under 100 lines; `npm run build && npm run lint && npm run format:check` pass

---

## Dependencies and Order

- Phase 1 → Phase 2 → stories. T002 needs T001; T003 needs nothing but is read by later tasks; T004 is independent.
- US1 (T005 to T009): T005 and T006 together; T007 needs both; T008 needs T007.
- US2 (T010 to T013) needs Phase 2; independent of US1 except the shared `NodeInspector.tsx` edits (T012 after T008).
- US3 (T014 to T016) needs Phase 2; T015 after T012 (same file).
- Polish last.

## Parallel Opportunities

- T001 and T004 together; T003 can run beside T001.
- T005, T006, and T010 together (different files).
- T014 can run while US1 or US2 work is in progress.

## Implementation Strategy

- **MVP**: Phase 1, Phase 2, US1. A bridge can be named and set up from the panel.
- Then US2 (links), then US3 (lab summary), then polish.
- Stop and run the manual check after each story; keep the app runnable after each step.
