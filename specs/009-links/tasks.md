---

description: "Task list for Links Between Interface Handles"
---

# Tasks: Links Between Interface Handles

**Input**: Design documents from `/specs/009-links/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding and the frontend-design skill for UI. Do not commit unless the user asks.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Types and constants shared by every story.

- [X] T001 [P] Create `src/types/links.ts` with `LinkEnd` (`{ nodeId: string; interfaceId?: string }`, `interfaceId` absent means the bridge new-port handle) and `ConnectionCheck` (`{ ok: true } | { ok: false; reason: string }`)
- [X] T002 [P] Create `src/constants/links.ts` with `NEW_PORT_HANDLE_ID = "new-port"`, `LINK_REASON = { SELF_LINK: "A node cannot link to itself.", ALREADY_LINKED: "That interface is already in a link.", UNSUPPORTED: "These two node types cannot be linked." }`, `LINK_NOTICE_MS = 4000`, `NEW_PORT_LABEL = "New port"`, `LINK_LABEL_SEPARATOR = " ↔ "`, and `linkLabel(nameA, nameB, mtu)` returning `<nameA> ↔ <nameB> · MTU <mtu>`. Reuse `LINK_ID_PREFIX` from `src/constants/palette.ts`, `DEFAULT_INTERFACE_MTU` and `DEFAULT_INTERFACE_STATE` from `src/constants/topology.ts`

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: The pure rule and document operations that every story uses.

**CRITICAL**: No story starts before this phase is done.

- [X] T003 Create `src/store/linkRules.ts` exporting `checkConnection(document, from: LinkEnd, to: LinkEnd): ConnectionCheck`. Rules in order, first failure wins: same `nodeId` on both ends → `LINK_REASON.SELF_LINK`; an end whose `interfaceId` appears as `endpointA` or `endpointB` of any link → `ALREADY_LINKED`; an end with no `interfaceId` on a node that is not a bridge → `UNSUPPORTED`; node types pair as namespace-namespace, namespace-bridge, bridge-namespace, or bridge-bridge → `{ ok: true }`; anything else → `UNSUPPORTED`. Use `NODE_TYPE` from `src/constants/topology.ts`; no inline strings
- [X] T004 Add to `src/store/documentOps.ts` `createLink(document, from, to)`: for each end without `interfaceId`, add a bridge port interface on that node (name from `nextFreeName(INTERFACE_NAME_PREFIX[bridge], INTERFACE_NAME_START[bridge], names on that node)`, id prefix `INTERFACE_ID_PREFIX`, mtu `DEFAULT_INTERFACE_MTU`, state `DEFAULT_INTERFACE_STATE`), then append a link `{ id: LINK_ID_PREFIX + uuid, endpointA, endpointB, kind: "veth", mtu: DEFAULT_INTERFACE_MTU, state: DEFAULT_INTERFACE_STATE }`. Pure; returns the new document and the new link id. Mirror the id style of `createNode`
- [X] T005 Add to `src/store/documentOps.ts` `removeLink(document, linkId)`: remove the link, then call `removeInterfaces` for the endpoint interfaces owned by bridge nodes only. Namespace interfaces stay with their addresses (FR-014). Return the document unchanged when the id is unknown
- [X] T006 Edit `src/store/topologyStore.ts`: add `selectedLinkId: string | null` (not in history), `setLinkSelection(id)` that sets it and clears `selectedNodeIds`, and make `setSelection` clear `selectedLinkId`; `loadDocument`, `undo`, and `redo` clear `selectedLinkId` when that link no longer exists. Add `connect(from, to): ConnectionCheck` that runs `checkConnection`, and on ok does one `withHistory` step with `createLink` and returns the check; on rejection changes nothing. Extend `deleteSelected` so a selected link goes through `removeLink` in one history step and clears `selectedLinkId`

**Checkpoint**: Rules and operations exist and compile; the UI is unchanged.

---

## Phase 3: User Story 1 - Connect nodes by dragging (Priority: P1) MVP

**Goal**: Dragging from one handle to another creates a link, auto-creating bridge ports through the new-port handle.

**Independent Test**: Build ns1, ns2, br0 and connect them as in quickstart.md "Build the example"; the result matches `examples/bridge-lab.json` structurally. Undo removes link and port together.

- [ ] T007 [US1] Edit `src/components/nodes/BridgeNode.tsx`: below the port rows and above the add-port button render a row labeled `NEW_PORT_LABEL` with a `Handle` (`id={NEW_PORT_HANDLE_ID}`, `type="source"`, `position={Position.Right}`, `aria-label` `<bridge name> New port`) styled like the handle in `src/components/nodes/InterfaceRow.tsx` (class `nodrag` row). Check `src/hooks/useRefreshHandles.ts` so the new handle is measured after render; extend it only if edges to it fail to draw
- [ ] T008 [US1] Edit `src/components/Canvas.tsx`: set `nodesConnectable` (remove `{false}`); add `onConnect` that maps the connection to two `LinkEnd`s (a handle id equal to `NEW_PORT_HANDLE_ID` means no `interfaceId`; otherwise the handle id is the interface id and the node id is `source` or `target`) and calls `useTopologyStore.getState().connect(from, to)`. Put the connection-to-ends mapping in a small named helper, not inline
- [ ] T009 [US1] Edit `src/store/toFlow.ts` `toFlowEdges`: a link whose endpoint is the new-port handle never exists in the document, so no change to ids is needed; confirm edges for auto-created ports draw to the port handle (the port row handle id is the interface id)
- [ ] T010 [US1] Manual check from quickstart.md "Build the example" and the combination table rows for allowed pairs (ns-ns, ns-bridge, bridge-bridge both ways); undo and redo each create; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Links can be created; rejected pairs are not yet guarded by feedback but `connect` already refuses them.

---

## Phase 4: User Story 2 - See allowed and rejected connections while dragging (Priority: P1)

**Goal**: Green or red targets while dragging; a visible reason when a rejected handle is released.

**Independent Test**: quickstart.md combination table, rows for self-link, already-linked, empty-canvas release, and "rejected drop creates nothing".

- [ ] T011 [US2] Edit `src/components/Canvas.tsx`: add `isValidConnection` that maps the connection to ends (reuse the helper from T008) and returns `checkConnection(...).ok`, reading the document from `useTopologyStore.getState()`
- [ ] T012 [P] [US2] Edit `src/index.css`: style the library handle states `.react-flow__handle.connectingto.valid` green and `.react-flow__handle.connectingto.invalid` red (ring or fill) using existing theme tokens (`led-ok`, `led-fault`); no new colors. Use the frontend-design skill
- [ ] T013 [P] [US2] Create `src/components/LinkNotice.tsx`: shows a message with `role="alert"` above the canvas content, hidden when empty, dismisses itself after `LINK_NOTICE_MS`, styled with existing tokens (`border-led-fault`, `text-ink`)
- [ ] T014 [US2] Edit `src/components/Canvas.tsx`: keep notice text in local state; add `onConnectEnd(event, state)`: when `state.toHandle` exists and `state.isValid` is false, set the notice to the `reason` from `checkConnection` for the same ends; when no handle was hit, set nothing; clear the notice on a successful `onConnect`. Render `LinkNotice` inside the canvas area
- [ ] T015 [US2] Manual check from quickstart.md for every red row and the empty-canvas row; confirm a rejected drop leaves nodes, interfaces, ports, and links unchanged; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Every pairing is either green with a link or red with a named reason.

---

## Phase 5: User Story 3 - Read links on the canvas (Priority: P2)

**Goal**: Edge labels, link selection, and link delete.

**Independent Test**: quickstart.md "Other checks": label text, click selects, Delete removes link and bridge port while the namespace interface and address stay.

- [ ] T016 [P] [US3] Edit `src/store/toFlow.ts` `toFlowEdges`: set `label` to `linkLabel(nameA, nameB, link.mtu)` using the interface names found by endpoint id; skip the label when an interface is missing (the edge is already skipped then)
- [ ] T017 [US3] Edit `src/components/Canvas.tsx`: derive each edge's `selected` from `selectedLinkId`; add `onEdgeClick` that calls `setLinkSelection(edge.id)`; clicking empty canvas or a node clears the link selection through the existing selection handlers (`setSelection` already clears it). Style label text and background with existing tokens (small `labelStyle`, `labelBgStyle` constants in `src/constants/links.ts`)
- [ ] T018 [US3] Edit `src/hooks/useCanvasShortcuts.ts` only if needed: `store.deleteSelected()` already handles a selected link after T006; confirm Delete removes a selected link, and that Delete still ignores typing in inputs
- [ ] T019 [US3] Edit `src/components/NodeInspector.tsx`: when `selectedLinkId` is set, show a read-only line with the link label (the full inspector arrives with NL-018, add a short comment pointing to it); nothing selected keeps the existing hint
- [ ] T020 [US3] Manual check from quickstart.md "Other checks": label, click-select, Delete, undo of delete, rename an interface and see the label update; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: All three stories work together.

---

## Phase 6: Polish

- [ ] T021 [P] Create `docs/links.md`: one short page stating the allowed pairs (namespace-namespace, namespace-bridge, bridge-bridge), that an interface is in at most one link, that bridge-to-bridge is a veth whose two ends are bridge ports, that the "New port" handle creates a bridge port, and that deleting a link removes bridge ports but keeps namespace interfaces. Plain English, normal prose
- [ ] T022 Run the whole of quickstart.md once in a fresh page load; confirm no console errors; confirm the document stays valid (undo, redo, delete node with links) and `npm run build && npm run lint && npm run format:check` pass

---

## Dependencies and Order

- Phase 1 → Phase 2 → stories. T003 needs T001, T002. T004, T005 need T001, T002. T006 needs T003 to T005.
- US1 (T007 to T010) needs Phase 2.
- US2 (T011 to T015) needs US1 (same `Canvas.tsx`, shared helper from T008).
- US3 (T016 to T020) needs Phase 2 and can run beside US2 except for shared `Canvas.tsx` edits (T017 after T014).
- Polish last.

## Parallel Opportunities

- T001 and T002 together.
- T004 and T005 together after T003 (same file, so sequence the edits).
- T012 and T013 together (different files).
- T016 can run while US2 work is in progress.

## Implementation Strategy

- **MVP**: Phase 1, Phase 2, US1. You can already build the example lab.
- Then US2 (feedback), then US3 (labels, select, delete), then polish.
- Stop and run the manual check after each story; keep the app runnable after each ticket.
