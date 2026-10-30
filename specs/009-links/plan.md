# Implementation Plan: Links Between Interface Handles

**Branch**: `009-links` (directory name; work stays on the current git branch) | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-links/spec.md`

## Summary

Turn the existing per-interface handles into working connections. A pure rule function decides every pairing (allowed, or rejected with a named reason). The canvas uses it for `isValidConnection`, so targets show green or red while dragging, and for a visible notice when a rejected drop is released. A creating drop becomes one history step that adds the link and, when needed, an auto-created bridge port. Each bridge gets a "new port" handle so a link to a bridge needs no manual port. Edges show a label with both interface names and the MTU, can be selected (store only; the inspector is NL-018), and can be deleted. Web only; no new dependencies. No tests (constitution).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: `@xyflow/react` 12 (`isValidConnection`, `onConnect`, `onConnectEnd`, edge `label`), Zustand 5, Tailwind CSS 4.

**Storage**: In-memory document; links already part of the schema.

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px.

**Project Type**: Web application (web side only)

**Performance Goals**: Green/red feedback within 100 ms of pointer movement (SC-005); rule check is a constant-time lookup.

**Constraints**: Reasons, handle id, notice timeout, link defaults are named constants; functions under 100 lines; document stays valid after every operation (FR-016); one undo step per create or delete (FR-015).

**Scale/Scope**: 1 constants file, 1 pure rules module, 3 new `documentOps` functions, 3 store actions, edits to Canvas, BridgeNode, toFlow, shortcuts, selection state; 1 small notice component.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only. |
| II. Simple, concise code | Pass. Library connect events and edge label reused; no new dependency. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. `checkConnection`, `createLink`, `removeLink` are small and shared by canvas, store, and delete. |
| IV. No magic strings | Pass. Reasons, new-port handle id, notice timeout, link defaults live in `constants/links.ts` and existing topology constants. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Rules in `store/`, UI in `components/`, constants and types in their folders. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Tests: ticket asks for Vitest, constitution forbids tests; satisfied by hand ([quickstart.md](quickstart.md)). Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/009-links/
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
web/src/
├── constants/links.ts                # reasons, NEW_PORT_HANDLE_ID, notice timeout, label format
├── types/links.ts                    # LinkEnd, ConnectionCheck
├── store/
│   ├── linkRules.ts                  # pure: checkConnection(document, from, to)
│   ├── documentOps.ts                # + createLink, removeLink (drops bridge ports)
│   ├── toFlow.ts                     # edge label
│   └── topologyStore.ts              # + selectedLinkId, connect, deleteSelected covers links
├── hooks/useCanvasShortcuts.ts       # Delete also removes a selected link
└── components/
    ├── Canvas.tsx                    # nodesConnectable, isValidConnection, onConnect, onConnectEnd, edge select
    ├── LinkNotice.tsx                # transient rejection message
    └── nodes/BridgeNode.tsx          # new-port handle
web/src/index.css                     # green/red handle states
docs/links.md                         # user note: allowed pairs, bridge-to-bridge via veth (FR-006)
```

**Structure Decision**: Reuse the 008 pattern: pure rules and ops in `store/`, one history-aware action per user step, constants in `constants/`. No backend change.

## Complexity Tracking

None.
