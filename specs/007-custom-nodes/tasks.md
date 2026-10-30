---

description: "Task list for Custom Nodes and Interface Handles"
---

# Tasks: Custom Nodes and Interface Handles

**Input**: Design documents from `/specs/007-custom-nodes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding and the frontend-design skill for UI tasks. Style with the existing theme tokens in `src/index.css` (`bg-panel`, `border-rule`, `text-ink`, `text-ink-muted`, `text-signal`, `led-*`); no `bg-gray-*` or default SaaS styling.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Constants, types, and build config shared by every story.

- [X] T001 [P] Create `src/constants/topology.ts` with: `NODE_TYPE = { NAMESPACE: "namespace", BRIDGE: "bridge" }` (as const, matching schema `NodeType`); `NODE_STATUS = { DESIRED: "desired", DEPLOYED: "deployed", FAILED: "failed", DRIFTED: "drifted" }`; `INTERFACE_ID_PREFIX = "if-"`; `INTERFACE_NAME_PREFIX = { namespace: "eth", bridge: "port" }` and `INTERFACE_NAME_START = { namespace: 0, bridge: 1 }`; `DEFAULT_INTERFACE_MTU = 1500` and `DEFAULT_INTERFACE_STATE = "up"`; `DEFAULT_POSITION = { x: 0, y: 0 }`; `ADD_LABEL = { namespace: "Add interface", bridge: "Add port" }`; `REMOVE_LABEL = "Remove"`; `NO_SELECTION_HINT = "Select a node to edit its interfaces."`; `NO_ADDRESS_TEXT = "no address"`; and `STATUS_STYLE` mapping each status to `{ label, glyph, borderClass }` per research.md R8 (desired: dashed `border-rule`, "Desired"; deployed: solid `border-led-ok`, "Deployed", check; failed: solid `border-led-fault`, "Failed", cross; drifted: dotted `border-led-warn`, "Drifted", warning)
- [X] T002 [P] Create `src/types/flow.ts` with `NodeStatus` (union from `NODE_STATUS` values), `FlowNodeData` (`{ status: NodeStatus }` only; no lab data copies) and `NodeKind` (union of the two `NODE_TYPE` values), following the `Theme` type pattern in `src/types/theme.ts`
- [X] T003 [P] Edit `vite.config.ts` to add `server.fs.allow: [".."]` so dev can serve `examples/bridge-lab.json` from the repo root; if `tsc -b` rejects JSON imports, add `"resolveJsonModule": true` to `tsconfig.json`

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: The store and the document-to-canvas mapping.

**CRITICAL**: No story starts before this phase is done.

- [X] T004 Create `src/store/topologyStore.ts` with a Zustand `useTopologyStore` holding `document: Document` (from `src/types/topology.ts`; start as an empty valid document, `schemaVersion` = `CURRENT_VERSION`) and `selectedNodeId: string | null`, plus actions `loadDocument(doc)` (replace document, clear selection) and `selectNode(id | null)`. No `persist` (research.md R1). Add helpers `interfacesOf(document, nodeId)` in the same file or `src/store/selectors.ts`
- [X] T005 [P] Create `src/store/toFlow.ts` exporting `toFlowNodes(document)` and `toFlowEdges(document)` per data-model.md "Derived": node `id`, `type` = node.type, `position` = `layout[id]` or `DEFAULT_POSITION`, `data: { status: NODE_STATUS.DESIRED }`; edge per link with `source`/`target` = the `nodeId` of each endpoint interface, `sourceHandle = endpointA`, `targetHandle = endpointB`; skip a link whose either interface is missing (FR-013); skip layout keys with no node
- [X] T006 In `src/main.tsx`, import `../../examples/bridge-lab.json`, call `useTopologyStore.getState().loadDocument(migrate(json))` (`migrate` from `src/types/topologyDocument.ts`) before `createRoot(...).render` (research.md R7)

**Checkpoint**: `npm run build` passes; store holds the bridge example.

---

## Phase 3: User Story 1 - See a lab on the canvas (Priority: P1) MVP

**Goal**: The example shows as 3 node cards with one handle per interface and two links.

**Independent Test**: quickstart.md check 1.

- [ ] T007 [P] [US1] Create `src/components/nodes/RoleIcon.tsx`: three small inline SVG components (host monitor, router crossed arrows, NAT swap arrows) chosen by a constant map from `Role` (`src/types/topology.ts`); `currentColor` stroke, 16 px, `aria-hidden`; default to the host icon when role is missing
- [ ] T008 [P] [US1] Create `src/components/nodes/InterfaceRow.tsx`: props `nodeName`, `interfaceId`; reads the interface from the store by id; renders name and its addresses (`NO_ADDRESS_TEXT` in muted text when none; long text truncated with `title` showing full text), and one `Handle` from `@xyflow/react` with `id={interfaceId}`, `type="source"`, `Position.Right`, `aria-label` `"<nodeName> <interfaceName>"`, vertically centered on the row. The row has class `nodrag`
- [ ] T009 [P] [US1] Create `src/components/nodes/NodeCard.tsx`: shared frame taking `title`, optional `icon`, `status`, and children; panel background, `border` classes from `STATUS_STYLE[status].borderClass`, fixed min width, header row with icon and truncated name (`title` attribute for full text); status tag is added in US4 (T021)
- [ ] T010 [US1] Create `src/components/nodes/NamespaceNode.tsx` and `src/components/nodes/BridgeNode.tsx` using `NodeCard` and `InterfaceRow`: namespace shows `RoleIcon` for its role and one row per interface of the node; bridge shows its name and one row per port. Both read the node and its interfaces from the store by `id` prop (node `data` only carries `status`). Depends on T007, T008, T009
- [ ] T011 [US1] Create `src/components/Canvas.tsx`: `ReactFlow` with `nodeTypes` (`NODE_TYPE.NAMESPACE` → `NamespaceNode`, `NODE_TYPE.BRIDGE` → `BridgeNode`; defined outside the component), `nodes`/`edges` from `useMemo` over `toFlowNodes`/`toFlowEdges` of the store document, `connectionMode={ConnectionMode.Loose}`, `nodesConnectable={false}`, `fitView`, `Background`, `onNodeClick`/`onPaneClick` calling `selectNode`. Import `@xyflow/react/dist/style.css`. Keep the "Canvas" label header from the old placeholder (`REGION.CANVAS`) via `SidePanel`-style frame
- [ ] T012 [US1] Edit `src/components/AppShell.tsx` to render `Canvas` in the center slot instead of the Canvas `SidePanel` placeholder (keep `as="main"`, `aria-label`, `col-start-3 row-start-1` classes); remove the now-unused `dotGrid` prop use if nothing else needs it
- [ ] T013 [US1] Style React Flow to the app theme in `src/index.css`: edge stroke `var(--ink-muted)`, handle size and color (`var(--signal)`), controls and background using tokens, so light and dark both read well
- [ ] T014 [US1] Manual check: `npm run dev`, run quickstart.md checks 1 and 10 (empty document, no-interface node, dangling link); `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: MVP. The example shows 3 cards, 4 handles, 2 links.

---

## Phase 4: User Story 2 - Add and remove interfaces (Priority: P1)

**Goal**: Add and remove interfaces from the card and from the inspector, with cascade removal of links.

**Independent Test**: quickstart.md checks 2 to 7, 11, 12.

- [ ] T015 [US2] In `src/store/topologyStore.ts` add `addInterface(nodeId): string` and `removeInterface(interfaceId)` per data-model.md: new id = `INTERFACE_ID_PREFIX + crypto.randomUUID()`; name = prefix + smallest free number on that node starting at `INTERFACE_NAME_START` (helper `nextInterfaceName(document, node)` in `src/store/interfaceNaming.ts`, one small function); new interface has `mtu` `DEFAULT_INTERFACE_MTU`, `state` `DEFAULT_INTERFACE_STATE`, no addresses; the id is never reused. `removeInterface` in one `set`: filter the interface; filter every link whose `endpointA` or `endpointB` equals the id; on the owning node drop `routes` entries whose `interfaceId` equals the id and `natRules` whose `interfaceId` equals the id (research.md R4). Quote: "Two interfaces on the same node must never share a name"
- [ ] T016 [P] [US2] Add a Remove button (label `REMOVE_LABEL`, `aria-label` `"Remove <nodeName> <interfaceName>"`, class `nodrag`, small, token colors) to `src/components/nodes/InterfaceRow.tsx` calling `removeInterface`
- [ ] T017 [US2] Add an Add button (label from `ADD_LABEL[type]`, class `nodrag`) at the bottom of `src/components/nodes/NamespaceNode.tsx` and `src/components/nodes/BridgeNode.tsx` calling `addInterface(id)`. After add or remove call `useUpdateNodeInternals()(id)` so React Flow re-measures handles (research.md R2); put this in one small hook `src/hooks/useRefreshHandles.ts` used by both nodes and by the row's remove button
- [ ] T018 [US2] Create `src/components/NodeInspector.tsx`: reads `selectedNodeId`; with nothing selected shows `NO_SELECTION_HINT`; otherwise shows the node name and type, its interface list (name, addresses) each with Remove, and the same Add button; reuse the store actions. Reuse `InterfaceRow` pieces where they fit but without a `Handle` (the Handle only renders inside React Flow), so split the row text part into a small shared `InterfaceLabel` in `src/components/nodes/InterfaceRow.tsx` and use it in both places
- [ ] T019 [US2] Edit `src/components/AppShell.tsx` to render `NodeInspector` in the right column instead of the Inspector placeholder (keep `aria-label="Inspector"`, `as="aside"`, same classes, same header label `REGION.INSPECTOR.label`)
- [ ] T020 [US2] Manual check: quickstart.md checks 2 to 7, 11, 12 (add on card, add on inspector, 20 unique ids, remove with link leaves 1 link, re-add gets new id, many interfaces stay aligned, keyboard); build, lint, format pass

---

## Phase 5: User Story 3 - One source of truth for the lab (Priority: P1)

**Goal**: Dragging writes only `layout`; the canvas always equals the document; loading a new document replaces the canvas.

**Independent Test**: quickstart.md checks 8 and 10.

- [ ] T021 [US3] In `src/store/topologyStore.ts` add `setNodePosition(nodeId, position)` writing `document.layout[nodeId]` only
- [ ] T022 [US3] In `src/components/Canvas.tsx` add `onNodesChange` that, for each change of type `position` with a `position`, calls `setNodePosition`; ignore other change types (research.md R6). Selection comes from the store, not React Flow state
- [ ] T023 [US3] Manual check: quickstart.md checks 8 and 10; confirm `loadDocument` with a different document replaces all cards and clears selection; build, lint, format pass

---

## Phase 6: User Story 4 - Status styles on nodes (Priority: P2)

**Goal**: Four distinct status looks, all nodes shown as desired.

**Independent Test**: quickstart.md check 9.

- [ ] T024 [US4] In `src/components/nodes/NodeCard.tsx` add the status tag from `STATUS_STYLE[status]`: glyph and label text in the header (non-color cue); border style (dashed, solid, dotted) from `borderClass`; make sure tag text is readable in light and dark. If no component draws glyphs yet, add four tiny inline glyphs in `src/components/nodes/StatusGlyph.tsx`
- [ ] T025 [US4] Manual check: temporarily render `NodeCard` once per status (do not commit the temporary code) and confirm four distinct looks in light and dark; confirm every example node shows Desired

---

## Phase 7: Polish and cross-cutting

- [ ] T026 [P] Long names and many rows: confirm truncation with hover `title`, no overlap of handles (quickstart.md check 11); adjust `NodeCard` and `InterfaceRow` spacing if needed
- [ ] T027 [P] Perf: with about 20 nodes of 5 interfaces each (temporary document loaded via `loadDocument` from the console), drag a node and confirm no visible lag (SC-007); if it lags, memoize `NodeCard`/`InterfaceRow` with `React.memo`
- [ ] T028 Final pass: walk all of quickstart.md; `npm run build && npm run lint && npm run format:check`; check constitution rules (no magic strings, functions under 100 lines, minimal comments)

---

## Dependencies and order

- Phase 1 then Phase 2, then stories. T004 before T005 only for types (T005 can start once `Document` types are known). T006 needs T004.
- US1 (T007 to T014) needs Phase 2. Inside US1: T007, T008, T009 in parallel, then T010, then T011, then T012, T013, T014.
- US2 needs US1 (cards and canvas exist). US3 needs US1 and the store; it is independent of US2 but shares `Canvas.tsx` and `topologyStore.ts`, so do it after US2 or edit carefully.
- US4 only needs `NodeCard` (T009), so it can run in parallel with US2/US3 if different files are touched; T024 edits `NodeCard.tsx`.
- Polish last.

## Parallel examples

- Setup: T001, T002, T003 together.
- US1: T007, T008, T009 together.
- US2: T016 with T015 (different files), then T017, T018.
- Polish: T026 and T027 together.

## Implementation strategy

1. MVP = Phases 1, 2 and US1: the example is visible with handles. Stop and check.
2. Add US2 (editing), then US3 (position write-back), then US4 (status look).
3. Keep the app runnable after each phase; run build, lint, and format checks at each manual check task.
