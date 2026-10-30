# Implementation Plan: Custom Nodes and Interface Handles

**Branch**: `007-custom-nodes` (directory name; work stays on git branch `NL-014-custom-nodes`) | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-custom-nodes/spec.md`

## Summary

Put the lab document in one Zustand store (`topologyStore`). Derive React Flow nodes and edges from it with one pure function. Add two custom node types: `NamespaceNode` (name, role icon, interface rows with addresses) and `BridgeNode` (name, port rows). Each interface row owns one handle whose id is the interface id. Cards have add and remove interface controls; a minimal inspector section for the selected node offers the same. Node cards take a `status` input (desired, deployed, failed, drifted) with four distinct styles; all nodes are `desired`. The bridge example loads at app start. Web only; no new dependencies. No tests (constitution).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: `@xyflow/react` 12, Zustand 5, Tailwind CSS 4. Role icons are small inline SVG components.

**Storage**: In-memory store only. The document is not persisted here (save/load is NL-020).

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px.

**Project Type**: Web application (web side only)

**Performance Goals**: Dragging a node in a 20-node, 100-interface lab shows no visible lag (SC-007).

**Constraints**: Colors from the existing theme tokens; status, node type, handle and label strings are named constants; functions under 100 lines; the canvas keeps no copy of lab data.

**Scale/Scope**: 1 store, 1 derive function, 2 node components plus 1 shared row/card piece, 1 inspector section, 3 role icons, constants and types files, small CSS additions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only, TypeScript. |
| II. Simple, concise code | Pass. No new dependency; ids from `crypto.randomUUID`; one derive function. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. `toFlowNodes`, `toFlowEdges`, `nextInterfaceName`, `newInterfaceId` are small; both node types share `InterfaceRow` and `NodeCard`. |
| IV. No magic strings | Pass. Node type keys, status values and labels, default name prefixes, id prefix, handle side are constants in `constants/topology.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. `components/nodes`, `store`, `types`, `constants`, `lib`-style helpers under `store`/`utils` already used by the app. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Post-design re-check: still passes; no violations, so no Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/007-custom-nodes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
web/
├── vite.config.ts                    # allow serving ../examples in dev
└── src/
    ├── main.tsx                      # load the bridge example at start
    ├── constants/topology.ts         # node types, statuses, names, prefixes
    ├── types/flow.ts                 # node data, status type
    ├── store/
    │   ├── topologyStore.ts          # document, selection, actions
    │   └── toFlow.ts                 # document -> React Flow nodes/edges
    ├── components/
    │   ├── Canvas.tsx                # ReactFlow, replaces the Canvas placeholder
    │   ├── NodeInspector.tsx         # selected node: interface list, add/remove
    │   └── nodes/
    │       ├── NamespaceNode.tsx
    │       ├── BridgeNode.tsx
    │       ├── NodeCard.tsx          # shared frame with status style
    │       ├── InterfaceRow.tsx      # row + handle + remove button
    │       └── RoleIcon.tsx          # host / router / NAT glyphs
    └── index.css                     # status color tokens
```

**Structure Decision**: Extend the existing `web/src/{components,store,types,constants}` layout. `AppShell` swaps the Canvas and Inspector placeholders for `Canvas` and `NodeInspector`.

## Complexity Tracking

No violations.
