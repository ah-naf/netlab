# Implementation Plan: Fix Namespace Panel Route Crash and Unclear Layout

**Branch**: `011-fix-namespace-panel` (directory name; work stays on the current git branch) | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/011-fix-namespace-panel/spec.md`

## Summary

Two changes to the namespace Inspector built in `010-inspector-namespace`. First, stop the "Maximum update depth exceeded" crash: `RouteRow` and `NewRouteRow` read this node's interfaces with a store selector that returns a new array on every read, so React re-renders forever. Read the list with a shallow-compared selector, as `NodeInspector` and `NamespaceForm` already do. Second, make the panel readable: four titled groups, one bordered block per interface, an "Addresses" label, Remove buttons that say what they remove, example-style hints, one wording for the Observed line, and clearer labels. A small error boundary per group keeps one failing part from breaking the rest. Web only; no new dependencies; no data or rule changes. No tests (constitution). Visual work follows the 008 [design direction](../008-palette-and-node-ops/contracts/design-direction.md) (frontend-design skill).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: Zustand 5 (`useShallow`), Tailwind CSS 4.

**Storage**: None changed. The lab document, field rules, and operations are untouched.

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px; the Inspector column is narrow (about 380 px).

**Project Type**: Web application (web side only)

**Performance Goals**: No change; opening a route row stays instant.

**Constraints**: Colors from existing theme tokens; all visible texts are named constants in `constants/inspector.ts`; functions under 100 lines; layout must not rely on color alone (FR-012).

**Scale/Scope**: 1 constants edit, 2 new small components (`Section`, `RemoveAction`), 1 error boundary, edits to about 9 existing inspector components. No store or rule changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only. |
| II. Simple, concise code | Pass. The crash fix is one wrapper call at two sites; layout reuses small shared components instead of per-section markup. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. `Section` and `RemoveAction` are shared; no component nears 100 lines. |
| IV. No magic strings | Pass. Every new label, hint, and group title is a constant in `constants/inspector.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Everything stays in `components/inspector` and `constants`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Tests: none, by constitution; checked by hand in [quickstart.md](quickstart.md). Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/011-fix-namespace-panel/
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
├── constants/inspector.ts                  # + group titles, labels, hints, role names, remove texts
└── components/inspector/
    ├── Section.tsx                         # NEW: titled group + error boundary around its content
    ├── SectionBoundary.tsx                 # NEW: class error boundary with a short fallback
    ├── RemoveAction.tsx                    # NEW: Remove button that shows what it removes
    ├── NamespaceForm.tsx                   # four Sections
    ├── InterfaceEditor.tsx                 # bordered block, name as title, own remove control
    ├── AddressList.tsx                     # "Addresses" label, row remove text, add hint
    ├── RouteRow.tsx                        # shallow interfaces read (crash fix), titled block
    ├── NewRouteRow.tsx                     # shallow interfaces read (crash fix), "New route" block
    ├── RoutesTable.tsx                     # inside the Static routes Section
    ├── GatewayField.tsx                    # label "Gateway address"
    ├── RoleField.tsx                       # role names; read-only as fixed text
    ├── ObservedLine.tsx                    # one label and wording
    └── ValidatedField.tsx                  # example-style placeholder look
```

**Structure Decision**: Keep the 010 layout. The crash fix and the layout change are edits to existing files plus three small new components; no new folders.

## Complexity Tracking

None.
