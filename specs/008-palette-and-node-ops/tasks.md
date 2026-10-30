---

description: "Task list for Palette, Drag and Drop, and Node Operations"
---

# Tasks: Palette, Drag and Drop, and Node Operations

**Input**: Design documents from `/specs/008-palette-and-node-ops/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, contracts/design-direction.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Design rule**: All visuals follow [design-direction.md](contracts/design-direction.md): flat rows with an inset icon tile, drawn-object icons that explain themselves, existing theme tokens (`bg-panel`, `border-rule`, `text-ink`, `text-ink-muted`, `text-signal`, `led-*`), Schibsted Grotesk, sentence case, no all-caps labels, no cards or shadows. Use the frontend-design skill for UI tasks.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding. Do not commit unless the user asks.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Types and constants shared by every story.

- [X] T001 [P] Create `src/types/palette.ts` with `PaletteKind` (union: `namespace`, `host`, `veth`, `bridge`, `router`, `nat`), `PaletteCreate` (`{ type: NodeType; role?: Role }` using the types in `src/types/topology.ts`), and `PaletteEntry` (`id: PaletteKind`, `label`, `description`, `create: PaletteCreate | null`, `available: boolean`)
- [X] T002 [P] Create `src/constants/palette.ts` with: `PALETTE_ENTRIES` in this order with these exact texts — Namespace "Isolated network stack with its own interfaces and routes" (create namespace, no role); Host "A computer on the lab network" (namespace, role host); veth pair "A virtual cable between two interfaces" (`create: null`, `available: false`); Linux bridge "Connects interfaces like a switch" (bridge); Router "Forwards traffic between networks" (namespace, role router); NAT gateway "Translates addresses between inside and outside" (namespace, role nat); all others `available: true`. Also `PALETTE_DRAG_TYPE = "application/x-netlab-part"`; `NAME_RULE` mapping each creatable kind to `{ prefix, start }` — namespace and host `ns` from 1, router `r` from 1, nat `nat` from 1, bridge `br` from 0; `NODE_ID_PREFIX = "node-"`, `LINK_ID_PREFIX = "link-"`; `HISTORY_LIMIT = 100`; `DUPLICATE_OFFSET = { x: 40, y: 40 }`; `SEARCH_LABEL = "Search parts"`; `NO_MATCH_TEXT = "No matching parts"`; `NODE_NAME_LABEL = "Node name"`; `NAME_ERROR = { EMPTY: "Name cannot be empty", TAKEN: "Another node already uses this name" }`; `KEY` constants for Delete, Z, Y, D; `MULTI_SELECT_HINT = "Press Delete to remove or Ctrl+D to duplicate."`; `MULTI_SELECT_TEXT = (count) => \`${count} nodes selected\``

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Shared naming, document operations, history in the store, icons, and a canvas that supports selection and drops.

**CRITICAL**: No story starts before this phase is done.

- [X] T003 Create `src/store/naming.ts` exporting `nextFreeName(prefix, start, usedNames)` that returns prefix plus the smallest number from `start` not in `usedNames` (a `Set` or array of strings). Rewrite interface naming to use it: delete `src/store/interfaceNaming.ts` and have `topologyStore.ts` call `nextFreeName(INTERFACE_NAME_PREFIX[type], INTERFACE_NAME_START[type], names on that node)`. "Two interfaces on the same node must never share a name" still holds
- [X] T004 Create `src/store/documentOps.ts` with pure functions on `Document` (return a new document, never mutate). First function: `removeInterfaces(document, ids: Set<string>)`: filters those interfaces, every link whose `endpointA` or `endpointB` is in `ids`, and on every node drops `routes` entries whose `interfaceId` is in `ids` and `natRules` whose `interfaceId` is in `ids` (move the `withoutRef` logic out of `topologyStore.ts`). Edit `removeInterface` in the store to call it
- [X] T005 Refactor `src/store/topologyStore.ts` per data-model.md: replace `selectedNodeId` and `selectNode` with `selectedNodeIds: string[]` and `setSelection(ids)`; add `past: Document[]` and `future: Document[]`; add an internal `commit(next: Document)` that pushes the current document onto `past` (drop the oldest beyond `HISTORY_LIMIT`), clears `future`, and sets `document`; `loadDocument` clears selection, `past`, and `future`; route `addInterface` and `removeInterface` through `commit`; replace `setNodePosition` with drag batching: `beginDrag()` remembers the current document, `moveNode(id, position)` writes `layout[id]` without history, `endDrag()` pushes the remembered document onto `past` (and clears `future`) only if the document changed since `beginDrag`. History stays in memory and selection is never in history
- [X] T006 [P] Create `src/components/icons/NodeIcon.tsx` replacing `src/components/nodes/RoleIcon.tsx`: one component taking `kind: PaletteKind` and `size`, six drawn-object line icons on a 24 px grid (1.5 px stroke, round caps, `currentColor`) exactly as described in design-direction.md "Icons" (namespace: dashed rounded square with a small solid node and two stubs inside; host: monitor on a stand with a small keyboard; veth: two plug ends facing each other joined by a sagging cable; bridge: horizontal bar with four ports dropping from it; router: flat box with four arrows out of its corners; nat: two boxes side by side with a wall between and a two-way arrow crossing it); `aria-hidden`. Keep each icon to at most six strokes so it reads at 16 px. Add a helper `iconKindOf(node)` mapping a node to a kind (bridge → `bridge`; namespace with role → that role's kind; namespace with no role → `namespace`). Update `NamespaceNode.tsx` to use `NodeIcon`, add the bridge icon to the header in `BridgeNode.tsx`, then delete `RoleIcon.tsx`
- [X] T007 Edit `src/components/Canvas.tsx`: split into an outer `Canvas` wrapped in `ReactFlowProvider` and an inner component (needed for `useReactFlow`); derive each node's `selected` from `selectedNodeIds`; in `onNodesChange` handle `select` changes by calling `setSelection` with the new full set and `position` changes by calling `moveNode`; add `onNodeDragStart={beginDrag}` and `onNodeDragStop={endDrag}`; set `selectionOnDrag`, `panOnDrag={[1, 2]}`, `multiSelectionKeyCode="Shift"`, `deleteKeyCode={null}`; remove the old `onNodeClick` and `onPaneClick` selection calls. Update `src/components/NodeInspector.tsx` to read `selectedNodeIds`: exactly one id shows the node view as today; nothing keeps the hint
- [ ] T008 Manual check: app still runs; click selects a node and shows it in the inspector; a drag moves a node and updates links; add and remove interface still work; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Same behavior as before, on the new store, icons, and canvas.

---

## Phase 3: User Story 1 - Build a lab from the palette (Priority: P1) MVP

**Goal**: The palette lists six parts; dragging one onto the canvas creates a node at the drop point.

**Independent Test**: quickstart.md checks 1 to 4.

- [X] T009 [US1] In `src/store/documentOps.ts` add `createNode(document, entry: PaletteEntry, position)` returning the new document and the new node id: id `NODE_ID_PREFIX` + `crypto.randomUUID()`; name from `nextFreeName(NAME_RULE[entry.id].prefix, NAME_RULE[entry.id].start, all current node names)` ("default name that is unique among all current nodes"); `type` and `role` from `entry.create`; a bridge gets `bridge: { stp: false }`; no interfaces; `layout[id] = position`. Throws or returns the document unchanged if `entry.create` is null
- [X] T010 [US1] In `src/store/topologyStore.ts` add `createNode(entryId, position)`: finds the entry in `PALETTE_ENTRIES`, ignores unavailable entries, calls the pure `createNode`, `commit`s the result, and sets the selection to the new node
- [X] T011 [P] [US1] Create `src/components/palette/PaletteEntry.tsx`: a flat row (no card, no shadow) per design-direction.md: 40 px inset icon tile (`NodeIcon` at 28 px, `border-rule`, 4 px radius), name 14 px weight 600, description 12 px `text-ink-muted` clamped to 2 lines; `draggable={entry.available}`; `onDragStart` sets `dataTransfer` type `PALETTE_DRAG_TYPE` to `entry.id` and `effectAllowed = "copy"`; hover takes `text-signal` and `border-signal`; cursor `grab`; focusable with the app's focus ring; accessible name is the label plus description
- [X] T012 [US1] Create `src/components/palette/Palette.tsx`: panel frame with the "Components" header strip (same classes as `SidePanel`/`Canvas`, `aria-label={REGION.COMPONENTS.label}`, `<aside>`), then the list of `PaletteEntry` rows separated by `border-rule` lines, `role="list"`. Edit `src/components/AppShell.tsx` to render `Palette` in the left column instead of the Components `SidePanel` placeholder (keep `col-start-1 row-start-1`)
- [X] T013 [US1] In `src/components/Canvas.tsx` add `onDragOver` (preventDefault, `dropEffect = "copy"`) and `onDrop` on the `ReactFlow` wrapper: read `PALETTE_DRAG_TYPE` from `dataTransfer`, convert `clientX`/`clientY` with `screenToFlowPosition`, call the store `createNode`. A drop with no data does nothing; a release outside the canvas has no handler so nothing is created
- [ ] T014 [US1] Manual check: quickstart.md checks 1 to 4 (palette content and icons readable without labels; drag each of Namespace, Host, Router, NAT gateway, Linux bridge; release over the toolbar creates nothing; 30 nodes in a row all have unique names and ids); build, lint, format pass

**Checkpoint**: MVP. Users can build a lab by dragging parts.

---

## Phase 4: User Story 3 - Select, delete, and rename nodes (Priority: P1)

**Goal**: Multi-select, Delete with cascade, inline rename with validation.

**Independent Test**: quickstart.md checks 7 to 9.

- [X] T015 [US3] In `src/store/documentOps.ts` add `deleteNodes(document, ids: Set<string>)`: removes those nodes and their `layout` entries, then calls `removeInterfaces` for every interface whose `nodeId` is in `ids` (so links and route/NAT references on other nodes go too). Add `validateNodeName(document, nodeId, name)` returning `NAME_ERROR.EMPTY` for an empty-after-trim name, `NAME_ERROR.TAKEN` for a name equal to another node's name (case-sensitive), else null; and `renameNode(document, nodeId, name)` returning the document with the trimmed name
- [X] T016 [US3] In `src/store/topologyStore.ts` add `deleteSelected()` (one `commit` of `deleteNodes` over `selectedNodeIds`, then clear selection; no-op when empty) and `renameNode(nodeId, name)` that returns the error text or null and `commit`s on success
- [X] T017 [US3] Create `src/hooks/useCanvasShortcuts.ts`: one `keydown` listener on `window`, registered in `src/components/AppShell.tsx` (or `Canvas.tsx`); a helper `isEditableTarget(event)` returns true for input, textarea, select, or `contentEditable` targets and every shortcut returns early when true (FR-016). For now handles `KEY.DELETE` calling `deleteSelected`; later stories add more keys in this same hook
- [X] T018 [P] [US3] Create `src/components/nodes/NodeTitle.tsx`: shows the name (truncated, `title` with the full name); double-click switches to an input (`nodrag nopan`, accessible name `NODE_NAME_LABEL`, auto-focused with the text selected, current name as value); Enter calls the store `renameNode` — if it returns an error, show the text under the field in `text-led-fault`, keep focus, keep the old name; no error closes the field; Escape or blur cancels and restores the old name; keydown events inside the field call `stopPropagation`. Use it in `src/components/nodes/NodeCard.tsx` in place of the plain title text (add a `nodeId` prop and pass it from `NamespaceNode.tsx` and `BridgeNode.tsx`)
- [X] T019 [US3] In `src/components/NodeInspector.tsx` handle several selected nodes: show `MULTI_SELECT_TEXT(count)` and `MULTI_SELECT_HINT` in the panel body
- [ ] T020 [US3] Manual check: quickstart.md checks 7 to 9 (click, shift-click, box select; Delete removes nodes, interfaces, and links with no dangling link; Delete or Backspace while typing in the rename field edits text only; rename Enter, Escape, empty name, duplicate name); build, lint, format pass

---

## Phase 5: User Story 2 - Find palette entries by search (Priority: P2)

**Goal**: A search box filters the palette by name and description.

**Independent Test**: quickstart.md check 5.

- [X] T021 [P] [US2] Create `src/components/palette/filterEntries.ts` exporting `filterEntries(entries, query)`: trims the query, returns all entries when empty, otherwise entries whose label or description contains the query, ignoring letter case
- [X] T022 [US2] In `src/components/palette/Palette.tsx` add the search input above the list: `type="search"`, label and placeholder `SEARCH_LABEL`, magnifier glyph inside, Escape clears; keep the query in local state; render `filterEntries(PALETTE_ENTRIES, query)`; when the result is empty show `NO_MATCH_TEXT` in `text-ink-muted`; the input updates the list on every keystroke
- [ ] T023 [US2] Manual check: quickstart.md check 5 ("bridge", "NAT", "zzz", clear, uppercase); build, lint, format pass

---

## Phase 6: User Story 4 - Duplicate nodes (Priority: P2)

**Goal**: Ctrl+D copies the selected nodes with new ids and names, keeping links between copies only.

**Independent Test**: quickstart.md check 10.

- [X] T024 [US4] In `src/store/documentOps.ts` add `duplicateNodes(document, ids: Set<string>)` returning the new document and the new node ids: build maps old node id → new id and old interface id → new id (`NODE_ID_PREFIX` / `INTERFACE_ID_PREFIX` / `LINK_ID_PREFIX` plus `crypto.randomUUID()`); each copy gets a new unique name using `nextFreeName` with the prefix and start from `NAME_RULE` for its kind (a namespace copy uses its role's rule), counting names already used including earlier copies in this same call; position = original layout position plus `DUPLICATE_OFFSET`; copy each node's interfaces with the same `name`, `mtu`, `state`, and `addresses` and new ids; copy `routes` and `natRules` with interface ids mapped to the copies and drop entries whose interface was not copied; copy a link only when both `endpointA` and `endpointB` map to copied interfaces; never create a link from a copy to an original
- [X] T025 [US4] In `src/store/topologyStore.ts` add `duplicateSelected()`: one `commit` of `duplicateNodes`, then select the copies; no-op when nothing is selected. In `src/hooks/useCanvasShortcuts.ts` handle Ctrl+D (also Meta+D on macOS) calling it, with `preventDefault` so the browser does not bookmark the page
- [ ] T026 [US4] Manual check: quickstart.md check 10 (copy ns1 and br0 together: copies are linked to each other and not to ns2; copy ns1 alone: no links; interface names and addresses copied; nothing selected: nothing happens; two duplicates in a row get different names); build, lint, format pass

---

## Phase 7: User Story 5 - Undo and redo (Priority: P2)

**Goal**: Ctrl+Z and Ctrl+Shift+Z (or Ctrl+Y) walk through history; one user action is one step.

**Independent Test**: quickstart.md check 11.

- [ ] T027 [US5] In `src/store/topologyStore.ts` add `undo()` (pop the last document from `past`, push the current one onto `future`, set `document`) and `redo()` (the reverse); both are no-ops when the list is empty; neither changes selection except to drop ids whose nodes no longer exist in the restored document. "A new change after an undo discards the redo steps" is already done by `commit`
- [ ] T028 [US5] In `src/hooks/useCanvasShortcuts.ts` handle Ctrl+Z (undo), Ctrl+Shift+Z and Ctrl+Y (redo), with Meta variants for macOS, and `preventDefault` when the lab handles it; the editable-target check keeps the field's own undo while typing
- [ ] T029 [US5] Manual check: quickstart.md check 11 (delete then undo restores nodes, interfaces, links, and ids; redo removes again; a drag undoes in one step; a new change after undo kills redo; undo while typing in the search box uses the field's undo; nothing happens with empty history; after `loadDocument` history is empty); build, lint, format pass

---

## Phase 8: User Story 6 - The veth pair entry points to links (Priority: P3)

**Goal**: The veth pair entry is visible but clearly unavailable and never creates a node.

**Independent Test**: quickstart.md check 6.

- [ ] T030 [US6] In `src/components/palette/PaletteEntry.tsx` style the unavailable state from design-direction.md: `aria-disabled`, reduced-contrast text, a dark `bg-led-off` dot beside the name, `cursor-not-allowed`, no hover color change, `title={NOT_AVAILABLE_TEXT}` (from `src/constants/layout.ts`), and `draggable={false}`. In the store `createNode` keep the guard that ignores unavailable entries
- [ ] T031 [US6] Manual check: quickstart.md check 6 (dim entry with a dark dot, hover shows "Not available yet", dragging it creates nothing); build, lint, format pass

---

## Phase 9: Polish and cross-cutting

- [ ] T032 [P] Icons at both sizes: view all six icons at 28 px in the palette and 16 px on canvas headers in light and dark; simplify strokes where a shape is unclear at 16 px (design-direction.md)
- [ ] T033 [P] Perf: temporarily load a document of about 20 nodes (use `loadDocument` from the console; do not commit the temporary code), select all, Delete and undo, Ctrl+D, and type quickly in the search box; fix any visible lag, for example by memoizing `PaletteEntry` and node components (SC-005, SC-007)
- [ ] T034 [P] Keyboard and accessibility: Tab reaches the search box and every entry with a visible focus ring; rename and shortcuts work from the keyboard; entries have accessible names (quickstart.md check 14)
- [ ] T035 Final pass: walk all of quickstart.md; `npm run build && npm run lint && npm run format:check`; check constitution rules (no magic strings, functions under 100 lines, minimal comments, files in the right folder); confirm no temporary debug code remains (for example `window.topologyStore`)

---

## Dependencies and order

- Phase 1 then Phase 2, then stories. Inside Phase 2: T003 and T004 come before T005; T006 is independent; T007 needs T005; T008 last.
- US1 (T009 to T014) needs Phase 2. Inside US1: T009, T010, T011 can start together (T010 needs T009), then T012, T013, T014.
- US3 (T015 to T020) needs Phase 2; it is independent of US1 but easier to check with US1 done. T017 creates the shortcuts hook that US4 and US5 extend.
- US2 (T021 to T023) needs only `Palette.tsx` from US1.
- US4 (T024 to T026) needs the shortcuts hook (T017) and `commit` (T005).
- US5 (T027 to T029) needs `commit`/`past`/`future` (T005) and the shortcuts hook (T017). It is most useful after US3 and US4, so it can be checked against delete and duplicate.
- US6 (T030, T031) needs `PaletteEntry.tsx` (T011).
- Polish last.
- Files shared across stories (`topologyStore.ts`, `documentOps.ts`, `useCanvasShortcuts.ts`, `Canvas.tsx`, `Palette.tsx`, `PaletteEntry.tsx`): edit in order, not in parallel.

## Parallel examples

- Setup: T001 and T002 together.
- Phase 2: T006 with T003 and T004.
- US1: T011 with T009.
- US3: T018 with T015 and T016.
- US2: T021 alone is parallel with any US3 or US4 task.
- Polish: T032, T033, and T034 together.

## Implementation strategy

1. MVP = Phases 1, 2 and US1: parts can be dragged onto the canvas. Stop and check.
2. Add US3 (select, delete, rename), then US4 (duplicate), US5 (undo and redo), US2 (search), US6 (veth look).
3. Keep the app runnable after each phase; run build, lint, and format at each manual check task.
