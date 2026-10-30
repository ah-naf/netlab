---

description: "Task list for Fix Namespace Panel Route Crash and Unclear Layout"
---

# Tasks: Fix Namespace Panel Route Crash and Unclear Layout

**Input**: Design documents from `/specs/011-fix-namespace-panel/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Design rule**: UI follows the 008 [design-direction.md](../008-palette-and-node-ops/contracts/design-direction.md): flat rows, existing theme tokens (`bg-panel`, `border-rule`, `text-ink`, `text-ink-muted`, `text-signal`, `text-led-fault`), sentence case, no all-caps labels, no shadows. Never rely on color alone. Use the frontend-design skill for UI tasks.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding. Do not commit unless the user asks.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Texts shared by every story.

- [X] T001 Edit `src/constants/inspector.ts`: replace `SECTION_TITLE` with `GROUP_TITLE = { NAMESPACE: "Namespace", INTERFACES: "Interfaces", GATEWAY: "Default gateway", ROUTES: "Static routes" }` and update its users; set `FIELD_LABEL.NODE_NAME` to "Namespace name"; add `FIELD_LABEL.GATEWAY_ADDRESS = "Gateway address"`; add `ADDRESSES_LABEL = "Addresses"`; add `REMOVE_TEXT = { ADDRESS: "Remove address", INTERFACE: "Remove interface", ROUTE: "Remove route" }` and `removeLabel(text, target)` returning `<text> <target>` (for example "Remove address 10.0.0.1/24"); change `PLACEHOLDER` values to start with "e.g. " (`ADDRESS: "e.g. 10.0.0.5/24"`, `GATEWAY: "e.g. 10.0.0.1"`); add `ADD_ADDRESS_HINT = "Press Enter to add"`; add `ROLE_NAME = { host: "Host", router: "Router", nat: "NAT gateway" }` and change `NO_ROLE_TEXT` to "Namespace (no role)"; change `OBSERVED_LABEL` to "Observed state" and add `OBSERVED_HELP = "Shows the live state once the lab is deployed"`; add `routeTitle(destination)` returning `Route to <destination>` and `NEW_ROUTE_TITLE = "New route"`; add `SECTION_ERROR = { TEXT: "This section could not be shown", RETRY: "Try again" }`

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Small shared components the stories use. No visible change yet.

**CRITICAL**: No story starts before this phase is done.

- [X] T002 [P] Create `src/components/inspector/SectionBoundary.tsx`: a React class error boundary with state `failed`; `getDerivedStateFromError` sets `failed`; when failed it renders a `role="alert"` line `SECTION_ERROR.TEXT` and a button `SECTION_ERROR.RETRY` (use `ActionButton` from `src/components/nodes/ActionButton.tsx`) that sets `failed` back to false so the children mount again; otherwise renders its children
- [X] T003 Create `src/components/inspector/Section.tsx`: props `title`, `children`; renders a `<section aria-labelledby>` with an `<h3>` (`border-t border-rule px-3 pt-2 text-xs font-medium text-ink-muted`) showing `title`, then the children inside `SectionBoundary`. Depends on T002
- [X] T004 [P] Create `src/components/inspector/RemoveAction.tsx`: props `text` (visible), `label` (accessible name, default `text`), `onClick`, optional `danger`; with `danger` it renders a bordered button (`border border-led-fault text-led-fault px-2 py-0.5 text-xs`) so the signal is the word and the border, not color alone; without it, a plain `ActionButton` with the same visible text. Always set `aria-label={label}`

**Checkpoint**: Components compile and nothing changes on screen.

---

## Phase 3: User Story 1 - Add a static route without an error (Priority: P1) MVP

**Goal**: "Add route" and saved routes work with no "Maximum update depth exceeded", and a failing group no longer breaks the rest.

**Independent Test**: quickstart.md "The crash" steps 1 to 6 and "Containment".

- [X] T005 [P] [US1] Edit `src/components/inspector/RouteRow.tsx`: read this node's interfaces with `useTopologyStore(useShallow((s) => interfacesOf(s.document, nodeId)))` (import `useShallow` from `zustand/react/shallow`, as `src/components/NodeInspector.tsx` does) so the selector result is stable. This is the crash fix
- [X] T006 [P] [US1] Edit `src/components/inspector/NewRouteRow.tsx`: same change for its `interfaces` read. This is the crash fix for "Add route"
- [X] T007 [US1] Search `src/components` for any other `useTopologyStore(...)` selector that returns a new array or object on each read (a `.filter`, `.map`, spread, or object literal inside the selector, not wrapped in `useShallow`) and fix each the same way; selectors that return a store reference or a primitive are fine. Report what was checked
- [X] T008 [US1] Edit `src/components/inspector/NamespaceForm.tsx`: wrap the content in four `Section`s with `GROUP_TITLE`: Namespace (name field and role), Interfaces (editors and the add-interface button), Default gateway (gateway field), Static routes (routes table); remove the old inline headings and the borders they carried. Depends on T001, T003
- [ ] T009 [US1] Manual check from quickstart.md "The crash" (steps 1 to 6, console open) and "Containment"; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Route rows work; each group fails on its own.

---

## Phase 4: User Story 2 - Tell the panel's fields apart at a glance (Priority: P2)

**Goal**: Grouped blocks, labeled addresses, Remove buttons that name their target, example-style hints, one Observed wording, clear role.

**Independent Test**: quickstart.md "The layout" table, every row.

- [X] T010 [P] [US2] Edit `src/components/inspector/ObservedLine.tsx`: render `OBSERVED_LABEL: OBSERVED_TEXT` (so "Observed state: Not deployed") in `text-xs text-ink-muted` with `title={OBSERVED_HELP}`; same on every row
- [X] T011 [P] [US2] Edit `src/components/inspector/RoleField.tsx`: a read-only role (`nat` or none) shows `FIELD_LABEL.ROLE` and the full name from `ROLE_NAME` (or `NO_ROLE_TEXT`) as plain text with no input border; the editable select keeps its choices
- [X] T012 [P] [US2] Edit `src/components/inspector/GatewayField.tsx`: label `FIELD_LABEL.GATEWAY_ADDRESS`
- [X] T013 [P] [US2] Edit `src/components/inspector/ValidatedField.tsx`: style the placeholder `placeholder:italic placeholder:text-ink-muted/70` so a hint cannot be mistaken for a saved value
- [X] T014 [US2] Edit `src/components/inspector/AddressList.tsx`: show `ADDRESSES_LABEL` as a small heading above the saved addresses; each address row ends with `RemoveAction` (text `REMOVE_TEXT.ADDRESS`, label `removeLabel(REMOVE_TEXT.ADDRESS, cidr)`); below the rows keep the add field and add a `text-xs text-ink-muted` line `ADD_ADDRESS_HINT`. Depends on T004, T013
- [X] T015 [US2] Edit `src/components/inspector/InterfaceEditor.tsx`: make each interface a bordered block (`border border-rule`, with spacing between blocks); a header row shows the interface name as its title and, at the right, `RemoveAction` with `danger` (text `REMOVE_TEXT.INTERFACE`, label `removeLabel(REMOVE_TEXT.INTERFACE, name)`) calling the store's `removeInterface(item.id)`; remove the old `RemoveInterfaceButton` use; fields, addresses, and `ObservedLine` follow inside the block. Depends on T004, T010, T014
- [X] T016 [US2] Edit `src/components/inspector/RouteRow.tsx` and `src/components/inspector/NewRouteRow.tsx`: each route is a bordered block with a header row: title `routeTitle(destination)` (or `NEW_ROUTE_TITLE`) and at the right `RemoveAction` with `danger` (text `REMOVE_TEXT.ROUTE`, label `removeLabel(REMOVE_TEXT.ROUTE, destination)`) for a saved route, or Cancel and Confirm for a new route; the stored route's fields and `ObservedLine` follow. Depends on T004, T005, T006, T010
- [ ] T017 [US2] Manual check from quickstart.md "The layout" table (ask someone who has not seen the panel), and the narrow-panel edge cases (long interface name, many addresses): nothing overlaps; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Both stories work together.

---

## Phase 5: Polish

- [ ] T018 Run the whole of quickstart.md once on a fresh page load with the console open and use every control once; no console errors
- [X] T019 Confirm constitution rules across the changed files: no inline strings with meaning (all from `src/constants/inspector.ts`), every function under 100 lines; `npm run build && npm run lint && npm run format:check` pass

---

## Dependencies and Order

- Phase 1 → Phase 2 → stories. T003 needs T002; T004 is independent.
- US1 (T005 to T009): T005, T006, T007 together; T008 needs T001 and T003.
- US2 (T010 to T017) needs US1 (same files: `RouteRow.tsx`, `NewRouteRow.tsx`, `NamespaceForm.tsx`). T015 needs T004, T010, T014; T016 needs T004, T005, T006, T010.
- Polish last.

## Parallel Opportunities

- T002 and T004 together.
- T005 and T006 together.
- T010, T011, T012, and T013 together (different files).

## Implementation Strategy

- **MVP**: Phase 1, Phase 2, US1. The crash is fixed and groups are contained.
- Then US2 (the readable layout), then polish.
- Stop and run the manual check after each story; keep the app runnable after each step.
