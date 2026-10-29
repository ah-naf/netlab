---

description: "Task list for App Shell Layout"
---

# Tasks: App Shell Layout

**Input**: Design documents from `/specs/006-app-shell/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, contracts/design-direction.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Design rule**: All visuals follow [design-direction.md](contracts/design-direction.md) (patch-panel tabs, rack-style rails, named tokens, Schibsted Grotesk). Do not use generic styling (default grays, `bg-gray-*`, SaaS cards, all-caps labels). Use the frontend-design skill while building UI tasks.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Shared constants, types, and fonts.

- [X] T001 [P] Create `src/types/layout.ts` with `DrawerTabId` (union of the nine tab ids), `LayoutState` (`leftWidth`, `rightWidth`, `drawerHeight`: number; `drawerCollapsed`: boolean; `activeTab`: `DrawerTabId`), `DrawerTab` (`id`, `label`), and `ToolbarAction` (`id`, `label`, `enabled`, `disabledReason`) per data-model.md
- [X] T002 [P] Create `src/constants/layout.ts` with: `LAYOUT_STORAGE_KEY = "netlab.layout"`; defaults (`leftWidth` 240, `rightWidth` 300, `drawerHeight` 240, collapsed false, active tab `deploymentLogs`); limits (left 180 to 400, right 240 to 480, drawer 120 to 480); `CENTER_MIN_WIDTH` 400; `APP_MIN_WIDTH` 1024; `RESIZE_STEP` 16; `NOT_AVAILABLE_TEXT = "Not available yet"`; `APP_NAME = "NetLab"`; `DEFAULT_PROJECT_NAME = "Untitled lab"`; the `DRAWER_TABS` array in this exact order: Deployment logs, Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT, Packet capture, Diagnostics; the `TOOLBAR_ACTIONS` array in this exact order: Save, Validate, Deploy, Stop lab, Reset lab (all disabled, reason `NOT_AVAILABLE_TEXT`); region labels "Components", "Canvas", "Inspector" each with a one-line "what will live here" sentence; and the toolbar group split (Save, Validate | Deploy, Stop lab, Reset lab)
- [X] T003 [P] Edit `index.html` to load Schibsted Grotesk (400, 500, 600) from Google Fonts with `preconnect` links and set the page `<title>` to "NetLab"

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Theme tokens, safe persistence, shared store, shared small components.

**CRITICAL**: No story starts before this phase is done.

- [X] T004 Replace `src/index.css` with: `@import "tailwindcss"`; the light token values from design-direction.md in `:root` (`--chassis`, `--panel`, `--ink`, `--ink-muted`, `--rule`, `--signal`, `--led-off`, `--led-ok`, `--led-warn`, `--led-fault`); an `@theme inline` block mapping them to Tailwind colors (`bg-chassis`, `bg-panel`, `text-ink`, `text-ink-muted`, `border-rule`, `text-signal`, `bg-led-ok`, and so on) and `--font-sans: "Schibsted Grotesk", system-ui, sans-serif`; base styles (`html, body, #root` height 100%, body background `chassis`, text `ink`, font size 14 px, `overflow: hidden`); a global `:focus-visible` rule (2 px `signal` outline, 2 px offset); and a `prefers-reduced-motion` rule that disables transitions
- [X] T005 [P] Create `src/store/safeStorage.ts` exporting a storage object (`getItem`, `setItem`, `removeItem`) that wraps `localStorage` in try/catch so blocked, full, or missing storage returns null or does nothing and never throws
- [X] T006 [P] Create `src/store/clamp.ts` exporting `clamp(value, min, max)` that returns the default for non-numbers (NaN, strings) and clamps numbers into the limits from `src/constants/layout.ts`
- [X] T007 Create `src/store/layoutStore.ts`: Zustand store with `persist` (key `LAYOUT_STORAGE_KEY`, JSON storage over `safeStorage`). State and limits exactly as in data-model.md: `leftWidth` default 240 limits 180 to 400; `rightWidth` default 300 limits 240 to 480; `drawerHeight` default 240 limits 120 to 480; `drawerCollapsed` default false; `activeTab` default `deploymentLogs` and must be one of the nine ids. Actions: `setLeftWidth`, `setRightWidth`, `setDrawerHeight` (each clamps), `toggleDrawer`, `setActiveTab` (ignores unknown ids). Use `merge` so loaded values are clamped and an unknown `activeTab` falls back to the default (depends on T001, T002, T005, T006)
- [X] T008 [P] Create `src/components/NotAvailable.tsx`: shared body that shows a name (heading) and `NOT_AVAILABLE_TEXT` plus an optional one-line hint, left-aligned, in `text-ink` and `text-ink-muted`; no sample data

**Checkpoint**: Tokens, store, and shared body ready.

---

## Phase 3: User Story 1 - A familiar workspace layout (P1) MVP

**Goal**: Toolbar slot, left column, center area, right column, and bottom drawer fill the window with no page scrollbar.

**Independent Test**: quickstart.md check 1 (1280x720 and 1920x1080, five regions visible, no page scrollbar, center takes extra space).

- [X] T009 [P] [US1] Create `src/components/SidePanel.tsx`: labeled region (`aria-label` from props) with a 24 px header strip (name, 12 px weight 500, `border-b border-rule`) and a `NotAvailable` body with the hint; `bg-panel`, no radius, `overflow-hidden` (FR-010). Center area passes a faint 20 px dot-grid background (`radial-gradient` using `--rule` at 60%) via a prop or class
- [X] T010 [P] [US1] Create `src/components/BottomDrawer.tsx` (first version): `<section aria-label="Bottom drawer">` with a header strip and a body filled by `NotAvailable`; `bg-panel`. Tabs and collapse are added in US3 and US4
- [X] T011 [US1] Create `src/components/AppShell.tsx`: root `h-screen` CSS grid with `min-width: APP_MIN_WIDTH`; rows `auto | 1fr | drawer height`, columns `left | 1fr | right` read from `useLayoutStore`; `bg-chassis` with 6 px gaps (the rails) between inset panels; toolbar row spans all columns; drawer row spans all columns; regions use `<aside aria-label="Components">`, `<main aria-label="Canvas">`, `<aside aria-label="Inspector">`; every panel has `min-h-0 min-w-0 overflow-hidden`. Toolbar slot renders a temporary `<header>` with "NetLab" until US2
- [X] T012 [US1] Replace `src/App.tsx` so it renders only `<AppShell />` and remove the old header markup
- [ ] T013 [US1] Manual check: run `npm run dev`, do quickstart.md check 1 at both sizes, fix overflow or scrollbar problems

**Checkpoint**: Layout frame works.

---

## Phase 4: User Story 2 - Toolbar with the lab actions (P1)

**Goal**: Toolbar shows NetLab, project name, five disabled buttons that explain why, and the connection status.

**Independent Test**: quickstart.md check 2.

- [X] T014 [P] [US2] Create `src/components/DisabledButton.tsx`: props `label`, `reason`; renders `<span title={reason}>` wrapping `<button disabled>`; 28 px tall, 4 px radius, 13 px weight 500, `text-ink-muted`, `cursor-not-allowed`, no hover change, flat with a 1 px `border-rule` border. Include a prop-free path for a later enabled state (when `enabled` is true render a normal button with a `signal`-tinted hover) (FR-003)
- [X] T015 [US2] Update `src/components/ConnectionIndicator.tsx`: replace `bg-gray-400`, `bg-green-500`, `bg-amber-500`, `bg-red-500` with `bg-led-off`, `bg-led-ok`, `bg-led-warn`, `bg-led-fault`; keep `CONNECTION_LABELS` and behavior unchanged; make the dot a 10 px LED with a 1 px inner ring so it reads as a lamp (FR-004)
- [X] T016 [US2] Create `src/components/Toolbar.tsx`: `<header>` 44 px, `bg-panel`, bottom `border-rule`; left: "NetLab" wordmark (18 px, weight 600, tracking -0.01em), thin vertical rule, project name `DEFAULT_PROJECT_NAME` in `text-ink-muted` 15 px; middle: the two button groups from `TOOLBAR_ACTIONS` split by a thin rule; right: `ConnectionIndicator`. Map actions to `DisabledButton`
- [X] T017 [US2] Replace the temporary header in `src/components/AppShell.tsx` with `<Toolbar />`
- [ ] T018 [US2] Manual check: quickstart.md check 2 (five buttons spelled right, all disabled, hover shows "Not available yet" within 1 second, no separate header, status visible)

**Checkpoint**: Toolbar done.

---

## Phase 5: User Story 3 - Resizable columns and a collapsible drawer (P2)

**Goal**: Drag or keyboard resize of three edges, drawer collapse, sizes remembered.

**Independent Test**: quickstart.md checks 3, 4, 5, 6 (without the tab part of check 5).

- [ ] T019 [P] [US3] Create `src/hooks/useResizeDrag.ts`: takes `axis` ("x" or "y"), `onDelta(deltaPx)`; returns `onPointerDown` that captures the pointer, listens to move and up on the handle, calls `onDelta` with the movement since the last event, and releases on up or cancel. Dragging outside the window must stop at the limit (limits are applied by the store)
- [ ] T020 [P] [US3] Create `src/components/ResizeHandle.tsx`: `role="separator"`, `tabIndex={0}`, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`; 6 px rail with a three-dot grip centered (small `rule` dots, turn `signal` on hover and focus), `cursor-col-resize` or `cursor-row-resize`; pointer drag via `useResizeDrag`; arrow keys call `onDelta(±RESIZE_STEP)` (Left/Right for vertical, Up/Down for horizontal). Color transition 100 ms; no transition on size during drag
- [ ] T021 [US3] In `src/components/AppShell.tsx` place a `ResizeHandle` in the rail between left and center, between center and right, and above the drawer. Left handle: delta adds to `leftWidth`; right handle: delta subtracts from `rightWidth`; drawer handle: delta subtracts from `drawerHeight`. Stop a column drag when the center would drop below `CENTER_MIN_WIDTH` (compute from `window.innerWidth`). Hide the drawer handle when collapsed
- [ ] T022 [US3] In `src/components/BottomDrawer.tsx` add the collapse toggle button (`aria-expanded`, icon-only chevron with `aria-label` "Collapse drawer" or "Expand drawer", wired to `toggleDrawer`). When collapsed the body is hidden and the grid drawer row shrinks to the header height (36 px); animate height 150 ms except while dragging; center grows to fill (FR-006)
- [ ] T023 [US3] Manual check: quickstart.md checks 3, 4, 5, 6. Confirm limits, center minimum 400 px, reload restores sizes and collapsed state, bad or blocked storage gives defaults without errors in the console

**Checkpoint**: Resize and persistence work.

---

## Phase 6: User Story 4 - Drawer tabs that are honest about what exists (P2)

**Goal**: Nine patch-panel tabs, each with a "Not available yet" panel and no fake data.

**Independent Test**: quickstart.md checks 5 (tab part) and 7.

- [ ] T024 [US4] Create `src/components/DrawerTabs.tsx`: `role="tablist"` rendering `DRAWER_TABS` in order; each `role="tab"` with `aria-selected`, `aria-controls`, roving `tabIndex`; patch-panel look from design-direction.md: each tab is a port with a 8 px LED (`bg-led-off` for every tab now, lit tokens reserved for later), 13 px label, 1 px `rule` separators between ports; active tab is recessed (inset edge, `text-ink`, 2 px `signal` bar at the bottom) and seats in 120 ms; Left/Right arrows (with wrap) move selection and focus; selecting calls `setActiveTab`
- [ ] T025 [US4] In `src/components/BottomDrawer.tsx` use `DrawerTabs` in the header (toggle stays at the right end) and render the body as `role="tabpanel"` (`id` matches `aria-controls`, `aria-labelledby` the tab) containing `NotAvailable` with the active tab's label and a one-line hint (no sample data) (FR-009)
- [ ] T026 [US4] Manual check: quickstart.md checks 5 and 7 (nine tabs in order, each shows its name and "Not available yet", keyboard arrows work, active tab restored after reload)

**Checkpoint**: Drawer complete.

---

## Phase 7: User Story 5 - Light and dark appearance (P3)

**Goal**: Dark values for all tokens, following the system setting with no reload.

**Independent Test**: quickstart.md check 8.

- [ ] T027 [US5] In `src/index.css` add `@media (prefers-color-scheme: dark)` overriding every token with the dark values from design-direction.md (use `#253942` for `--rule`); do not add any JS theme code
- [ ] T028 [US5] Manual check: quickstart.md check 8 with devtools emulation. Confirm text contrast of at least 4.5:1 on `panel` and `chassis`, visible rails, visible LED colors, dot grid visible but quiet, focus ring visible in both modes. Adjust token values if not

**Checkpoint**: Both themes pass.

---

## Phase 8: Polish

- [ ] T029 [P] Review all new files against the constitution: no magic strings or numbers (sizes, labels, keys all from `src/constants/layout.ts`), functions under 100 lines, no dead code, no unused imports
- [ ] T030 Run `npm run build`, `npm run lint`, and `npm run format:check` in `web/`; fix every error
- [ ] T031 Visual self-critique at 1280x720 and 1920x1080 in light and dark: confirm the patch-panel tabs are the one bold element, nothing generic (default grays, uniform cards, all-caps labels) remains, and remove one decoration if the page feels busy
- [ ] T032 Narrow edge check at 900 px: page scrolls sideways, no area hidden (quickstart.md check 9)
- [ ] T033 Run the full quickstart.md checklist once from top to bottom

---

## Dependencies and Order

- Phase 1 then Phase 2, then stories. T004 to T008 inside Phase 2: T007 needs T001, T002, T005, T006.
- US1 first (frame). US2 needs only US1's `AppShell`. US3 needs US1 (`AppShell`, `BottomDrawer`). US4 needs US3's `BottomDrawer` header (T022). US5 only needs T004 and can run any time after Phase 2.
- Same-file edits are sequential: `AppShell.tsx` (T011, T017, T021), `BottomDrawer.tsx` (T010, T022, T025), `index.css` (T004, T027).

## Parallel Examples

```text
Phase 1: T001, T002, T003 together.
Phase 2: T005, T006, T008 together (then T007; T004 independent).
US1: T009 and T010 together.
US2: T014 and T015 together.
US3: T019 and T020 together.
US5: T027 can run in parallel with US3 or US4 work (different file).
```

## Implementation Strategy

- **MVP**: Phases 1, 2, and US1 (T001 to T013). The frame with labeled empty regions runs.
- **Then**: US2 (toolbar, P1), then US3 and US4 (P2), then US5 (P3), then Polish.
- Keep the app runnable after every phase. Commit after each phase.
