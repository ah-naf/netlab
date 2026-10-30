# Implementation Plan: Palette, Drag and Drop, and Node Operations

**Branch**: `008-palette-and-node-ops` (directory name; work stays on the current git branch) | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-palette-and-node-ops/spec.md`

## Summary

Replace the Components placeholder with a palette (six parts, each with a self-explanatory icon, name, and description, plus a search box). Dragging a part onto the canvas creates a node at the drop point. Add multi-select, Delete, Ctrl+D duplicate, inline rename, and undo/redo. All document changes go through pure functions in `documentOps.ts` and one history-aware `commit` in `topologyStore`, so every action is one undo step and every result is a valid document. The icon set is shared by the palette and the canvas cards, so the picture on a part is the picture on its node. Web only; no new dependencies. No tests (constitution). Visual work follows [design-direction.md](contracts/design-direction.md) (frontend-design skill).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: `@xyflow/react` 12 (`screenToFlowPosition`, selection box, multi-select), Zustand 5, Tailwind CSS 4. Native HTML5 drag and drop; inline SVG icons.

**Storage**: In-memory only. History is lost on reload.

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px.

**Project Type**: Web application (web side only)

**Performance Goals**: Delete or duplicate of 20 nodes and search typing show no visible lag (SC-005, SC-007).

**Constraints**: Colors from existing theme tokens; palette entries, name rules, ids prefixes, key bindings, labels are named constants; functions under 100 lines; document stays valid after every operation (FR-017).

**Scale/Scope**: 1 constants file, 1 icon component, 1 palette (3 small components), 1 document-ops module, store history, 1 shortcuts hook, rename input; edits to Canvas, NodeCard, nodes, inspector, store.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only. |
| II. Simple, concise code | Pass. No new dependency; native drag and drop; snapshot history with no library. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. `createNode`, `deleteNodes`, `duplicateNodes`, `renameNode`, `nextFreeName`, `filterEntries` are each small and shared by every caller. |
| IV. No magic strings | Pass. Palette entries, name prefixes, id prefixes, MIME type, key bindings, history cap, offsets, labels live in `constants/palette.ts` and `constants/topology.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. `components/palette`, `components/nodes`, `hooks`, `store`, `constants`, `types`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/008-palette-and-node-ops/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-contract.md
│   └── design-direction.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
web/src/
├── constants/palette.ts              # entries, name rules, MIME, keys, history cap
├── types/palette.ts                  # PaletteKind, PaletteEntry
├── store/
│   ├── documentOps.ts                # pure: create, delete, duplicate, rename, removeInterfaces
│   ├── naming.ts                     # nextFreeName (replaces interfaceNaming.ts)
│   └── topologyStore.ts              # history, selectedNodeIds, commit, undo, redo, drag batch
├── hooks/
│   └── useCanvasShortcuts.ts         # Delete, Ctrl+D, Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y
└── components/
    ├── palette/
    │   ├── Palette.tsx               # search box + entry list, replaces Components placeholder
    │   ├── PaletteEntry.tsx          # draggable row, disabled state
    │   └── filterEntries.ts          # case-insensitive name/description filter
    ├── icons/NodeIcon.tsx            # six icons, replaces nodes/RoleIcon.tsx
    ├── nodes/NodeTitle.tsx           # name text or inline rename input
    ├── Canvas.tsx                    # drop handler, selection, drag batch
    └── NodeInspector.tsx             # multi-select text
```

**Structure Decision**: Extend the existing `web/src/{components,hooks,store,constants,types}` layout. `AppShell` swaps the Components placeholder for `Palette`.

## Complexity Tracking

No violations.
