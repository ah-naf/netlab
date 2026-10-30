# Research: Palette, Drag and Drop, and Node Operations

## R1. Drag from palette to canvas

- **Decision**: Native HTML5 drag and drop. `PaletteEntry` sets `draggable` and writes the entry id to `dataTransfer` under one MIME constant. `Canvas` handles `onDragOver` (allow drop) and `onDrop`: read the id, convert the pointer with React Flow's `screenToFlowPosition`, call `createNode`. A drop outside the canvas has no handler, so nothing is created (FR-005).
- **Rationale**: No dependency, works with React Flow's documented pattern. Needs `ReactFlowProvider` above the hook, so `Canvas` becomes an outer provider plus an inner component.
- **Alternatives**: `dnd-kit` (rejected: new dependency for one drop target); click-to-add (rejected: the ticket asks for drag).

## R2. Palette entries as data

- **Decision**: A `PALETTE_ENTRIES` constant array: `id`, `label`, `description`, `icon`, `create` (`{ type, role? }` or null) and `available`. The palette renders from it; `createNode` reads `create`. veth pair has `create: null`, `available: false`.
- **Rationale**: One place to add parts later (links, other devices). No per-entry branches in components.

## R3. Default names and ids

- **Decision**: `nextFreeName(prefix, start, usedNames)` returns prefix plus the smallest free number. Name rule by kind: namespace and host use `ns` from 1, router `r` from 1, NAT `nat` from 1, bridge `br` from 0. The existing interface naming reuses the same function. Ids: `node-`, `if-`, `link-` plus `crypto.randomUUID()`.
- **Rationale**: Matches the spec assumption; one helper for nodes and interfaces; ids never repeat so undo cannot clash.
- **Alternatives**: Counter per prefix (rejected: must persist and breaks after undo).

## R4. History

- **Decision**: Store keeps `past: Document[]` and `future: Document[]`. Every document change goes through one `commit(next)` that pushes the current document onto `past` (dropping the oldest beyond 100), clears `future`, and sets the new document. `undo` and `redo` swap documents between the lists. `loadDocument` clears both lists. Selection lives outside the document, so it is not in history (FR-014).
- **Rationale**: Documents are immutable and share structure, so snapshots are cheap at this scale. A snapshot list is simpler than patches or an undo library. Pure ops return a new document, so each user action is exactly one commit (FR-013).
- **Alternatives**: `zundo` or `immer` patches (rejected: new dependency, more code).

## R5. One history step per drag

- **Decision**: `Canvas` calls `beginDrag()` on `onNodeDragStart` and `endDrag()` on `onNodeDragStop`. `beginDrag` remembers the current document; position changes during the drag update `layout` without touching history; `endDrag` pushes the remembered document onto `past` only if the layout changed.
- **Rationale**: Gives one undo step per drag with no empty steps for a click.

## R6. Selection and shortcuts

- **Decision**: React Flow props: `selectionOnDrag`, `panOnDrag={[1, 2]}` (middle and right buttons pan, left drags a selection box), `multiSelectionKeyCode="Shift"`, `deleteKeyCode={null}`. Selection changes arrive as `select` changes in `onNodesChange` and update `selectedNodeIds` in the store. A `useCanvasShortcuts` hook listens on `window` for Delete, Ctrl+D, Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y; it ignores the event when the target is an input, textarea, or editable element (FR-016), and calls `preventDefault` for Ctrl+D so the browser does not bookmark.
- **Rationale**: Delete needs the cascade and history, so React Flow's own delete is turned off. Key names are constants.

## R7. Delete and duplicate as pure operations

- **Decision**: In `documentOps.ts`: `deleteNodes(doc, ids)` removes nodes, their interfaces, links on those interfaces, and route or NAT references on other nodes (reusing a shared `removeInterfaces(doc, ids)` that `removeInterface` also uses). `duplicateNodes(doc, ids)` builds an id map for nodes and interfaces, copies each node with a new name (via `nextFreeName`) and position plus a fixed offset, copies interfaces with the same name, MTU, state, addresses, and copies only links whose two endpoints are both in the map.
- **Rationale**: Pure functions keep validity rules in one place (FR-017) and make each action a single commit.
- **Edge**: Route and NAT references inside copied nodes are mapped to the copied interface ids when the interface was copied, and dropped otherwise.

## R8. Inline rename

- **Decision**: `NodeTitle` shows the name; double-click turns it into an input (`nodrag nopan`, focused, selected). Enter commits through `renameNode`, which returns an error text for an empty or duplicate name; the error shows under the field and the name is unchanged. Escape or blur cancels.
- **Rationale**: Validation lives in `documentOps` (one place). Typing in the field never reaches the shortcut hook because of the editable-target check.

## R9. Icons

- **Decision**: One `NodeIcon` component with six hand-drawn 24 px line icons, drawn so the shape alone says what the part is (see design-direction.md). The palette shows them large (28 px) in an inset tile. The canvas cards use the same icon through the same component, replacing `RoleIcon`. Bridge cards gain the bridge icon in the header, and plain namespaces get the namespace icon (clarification).
- **Rationale**: The user asked for self-explanatory icons. Reusing them on the canvas teaches the vocabulary: the part you drag looks like the node you get. No icon dependency.
- **Alternatives**: An icon library (rejected: new dependency, generic look).

## R10. Disabled veth pair

- **Decision**: The entry renders with `aria-disabled`, no `draggable`, muted colors, a dark LED, and `title="Not available yet"` (the existing `NOT_AVAILABLE_TEXT`).
- **Rationale**: Matches the app's convention for unbuilt features (FR-006). Enabling later is a one-line change in the entries constant.
