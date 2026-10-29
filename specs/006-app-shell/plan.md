# Implementation Plan: App Shell Layout

**Branch**: `006-app-shell` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-app-shell/spec.md`

## Summary

Replace the plain header with a desktop workspace: toolbar (name, project, five disabled lab buttons, connection status), left column, center area, right column, and a bottom drawer with nine honest "Not available yet" tabs. Panels resize by dragging or arrow keys, the drawer collapses, and sizes, collapsed state, and active tab persist in local storage. Light and dark follow the system through named CSS color tokens. Web only; no new dependencies. No tests (constitution).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: Tailwind CSS 4, Zustand 5 (`persist` middleware).

**Storage**: Browser local storage, one key, wrapped for failure.

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px.

**Project Type**: Web application (web side only)

**Performance Goals**: Drag follows the pointer with no visible lag (SC-002); tooltip within 1 s (SC-006).

**Constraints**: No page scrollbar; center min width 400 px; all sizes, limits, tab ids, labels, and the storage key are named constants. Functions under 100 lines.

**Scale/Scope**: 1 store, 1 drag hook, about 9 small components, 1 constants file, 1 types file, CSS tokens.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. React and TypeScript only. |
| II. Simple, concise code | Pass. No new dependency; own 30-line drag hook. frontend-design and ponytail skills apply at implementation. |
| III. Small, reusable functions | Pass. `clamp`, `safeStorage`, `ResizeHandle`, `DisabledButton`, `NotAvailable` are each reused. |
| IV. No magic strings | Pass. Sizes, limits, tab ids and labels, button labels, storage key, message text are constants in `constants/layout.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Files in `web/src/{components,hooks,store,constants,types}`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |
| No tests | Pass. Ticket's Vitest check replaced by manual check (FR-013). |

Post-design re-check: no change. No violations, Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/006-app-shell/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             # created later by /speckit-tasks
```

### Source Code (repository root)

```text
web/src/
├── App.tsx                      # renders AppShell
├── index.css                    # theme tokens (light, dark) + Tailwind mapping
├── constants/layout.ts          # sizes, limits, tabs, toolbar actions, storage key, messages
├── types/layout.ts              # DrawerTabId, LayoutState, ToolbarAction
├── store/layoutStore.ts         # Zustand + persist + clamp + safeStorage
├── hooks/useResizeDrag.ts       # pointer drag helper for ResizeHandle
└── components/
    ├── AppShell.tsx             # grid of all regions
    ├── Toolbar.tsx              # name, project, actions, ConnectionIndicator
    ├── DisabledButton.tsx       # disabled button + hover reason
    ├── ResizeHandle.tsx         # separator with drag and arrow keys
    ├── SidePanel.tsx            # labeled "Not available yet" column/center area
    ├── BottomDrawer.tsx         # collapse toggle, tab bar, panel
    ├── DrawerTabs.tsx           # tablist with keyboard arrows
    ├── NotAvailable.tsx         # shared "Not available yet" body
    └── ConnectionIndicator.tsx  # existing; dot colors move to theme tokens
```

**Structure Decision**: Web-only change inside `web/src` following the existing folder layout. No backend change.

## Complexity Tracking

No violations.
