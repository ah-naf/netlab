---

description: "Task list for Properties Panel for Namespaces"
---

# Tasks: Properties Panel for Namespaces

**Input**: Design documents from `/specs/010-inspector-namespace/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: None. The constitution says no tests are written. Each story ends with a manual check from quickstart.md.

**Design rule**: UI follows the 008 [design-direction.md](../008-palette-and-node-ops/contracts/design-direction.md): flat rows, existing theme tokens (`bg-panel`, `border-rule`, `text-ink`, `text-ink-muted`, `text-signal`, `text-led-fault`), sentence case, no cards or shadows. Use the frontend-design skill for UI tasks.

**Code rules** (constitution): shortest clear code, no magic strings (use constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding. Do not commit unless the user asks.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Types and constants shared by every story.

- [X] T001 [P] Create `src/types/inspector.ts` with `FieldRule` (`(value: string) => string | null`, null means valid) and `RouteDraft` (`{ destination: string; gateway: string; interfaceId: string; metric: string }`, all strings because they are text drafts)
- [X] T002 [P] Create `src/constants/inspector.ts` with: `MTU_MIN = 68`, `MTU_MAX = 65535`, `INTERFACE_NAME_MAX = 15`, `DEFAULT_DESTINATION = { IPV4: "0.0.0.0/0", IPV6: "::/0" }`, `OBSERVED_TEXT = "Not deployed"`, `ROLE_CHOICES` (`host` labeled Host, `router` labeled Router), `STATE_CHOICES` (`up`, `down`), field labels (node name, role, interface name, MTU, state, address, default gateway, route destination, route gateway, route output interface, route metric, lab name), button labels (add address, add route, remove), section titles (Interfaces, Default gateway, Static routes), and `FIELD_ERROR` texts: `NAME_EMPTY`, `NAME_LONG` (mentions 15), `NAME_CHARS` ("no slash or spaces"), `NAME_DOT`, `NAME_TAKEN`, `MTU_RANGE` (mentions 68 to 65535), `CIDR_INVALID`, `ADDRESS_DUPLICATE`, `GATEWAY_INVALID`, `METRIC_INVALID`, `ROUTE_NEXT_HOP` ("Set a gateway or an output interface"), `LAB_NAME_EMPTY`. Add `errorBannerText(count)` returning `This lab has errors (N)`

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Pure rules and operations, the history-aware edit action, the error store, and the field component every story reuses.

**CRITICAL**: No story starts before this phase is done.

- [X] T003 [P] Create `src/store/ipAddress.ts` exporting `isIpv4(text)` (four decimal parts, each 0 to 255, digits only), `isIpv6(text)` (true when `new URL(\`http://[${text}]/\`)` parses without throwing and the text contains `:`), `isIpAddress(text)` (either), and `isCidr(text)` (one `/`; address part valid; prefix a whole number 0 to 32 for IPv4 and 0 to 128 for IPv6; host bits may be set)
- [X] T004 Create `src/store/fieldRules.ts` of pure functions returning an error text or `null`, all texts from `FIELD_ERROR`: `validateInterfaceName(document, interfaceId, name)` — "1 to 15 chars, no `/`, no whitespace, not `.` or `..`, unique on its node" (error keys `NAME_EMPTY`, `NAME_LONG`, `NAME_CHARS`, `NAME_DOT`, `NAME_TAKEN`; compare against other interfaces of the same node, case-sensitive); `validateMtu(text)` — "whole number, 68 to 65535"; `validateAddress(document, interfaceId, text)` — "valid IPv4 or IPv6 CIDR, not already on that interface" (`CIDR_INVALID`, `ADDRESS_DUPLICATE`); `validateGateway(text)` — "empty, or valid IPv4 or IPv6 address (no prefix)"; `validateDestination(text)` — "valid CIDR"; `validateMetric(text)` — "empty, or whole number 0 or more"; `validateRoute(draft: RouteDraft)` — destination valid, and gateway or output interface present (`ROUTE_NEXT_HOP`); `validateLabName(text)` — trimmed not empty. Re-export `validateNodeName` use from `src/store/documentOps.ts` for the node name (do not duplicate it). Depends on T001 to T003
- [X] T005 [P] Create `src/store/namespaceOps.ts` of pure `Document` to `Document` functions (never mutate): `setRole(document, nodeId, role)` (host or router only), `renameInterface(document, interfaceId, name)` (trimmed), `setInterfaceMtu(document, interfaceId, mtu: number)`, `setInterfaceState(document, interfaceId, state)`, `addAddress(document, interfaceId, cidr)` (append `{ cidr }`), `removeAddress(document, interfaceId, cidr)` (remove that one only), `setDefaultGateway(document, nodeId, gateway)` (default route is a `node.routes` entry whose destination is `DEFAULT_DESTINATION.IPV4` or `.IPV6`; the gateway's address family picks which; replace the existing default route of that family, add one if none, and remove it when the gateway is empty), `addRoute(document, nodeId, route)`, `updateRoute(document, nodeId, index, route)`, `removeRoute(document, nodeId, index)` (index is into the node's routes without default routes; map back to the full list), `renameLab(document, name)` (trimmed). Depends on T002
- [X] T006 [P] Create `src/store/fieldErrorStore.ts`: a Zustand store with `errors: Set<string>` of field keys, `setError(key, on)` that adds or removes a key (create a new Set each time so subscribers update), and an exported selector `hasFieldErrors` (size above 0). Not part of history
- [X] T007 Edit `src/store/topologyStore.ts`: add `edit(fn: (document: Document) => Document)` that runs `fn` on the current document, does nothing when the result is the same object, otherwise commits one history step with the existing `withHistory`; keep selection as is. Add it to `TopologyState`
- [X] T008 Create `src/hooks/useFieldDraft.ts`: `useFieldDraft({ key, value, rule, onCommit })` returning `{ draft, error, setDraft, confirm, cancel }`. `draft` starts as `value` and resets when `value` changes from outside; `error` is `rule(draft)` computed on every change; `confirm()` calls `onCommit(draft)` only when `error` is null; `cancel()` sets `draft` back to `value`; the hook calls `fieldErrorStore.setError(key, error !== null)` on every change and `setError(key, false)` on unmount. Depends on T006
- [X] T009 Create `src/components/inspector/ValidatedField.tsx`: label plus input (or `type` prop) using `useFieldDraft`; Enter and blur call `confirm`, Escape calls `cancel`; stop key events from reaching the canvas shortcuts (as `NodeTitle.tsx` does with `event.stopPropagation()`); show the error under the field in `text-led-fault text-xs` with `role="alert"`, set `aria-invalid` and `aria-describedby` linked to the error text; visible label via `aria-label` or `<label>`; class `nodrag nopan` not needed (outside canvas). Props: `fieldKey`, `label`, `value`, `rule`, `onCommit`, optional `placeholder`. Depends on T008
- [ ] T010 Manual check: app still runs; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Rules, operations, error store, and field component exist; the UI is unchanged.

---

## Phase 3: User Story 1 - Edit a namespace and its interfaces (Priority: P1) MVP

**Goal**: Selecting a namespace shows a form to edit its name, its interfaces (name, MTU, state), and their addresses.

**Independent Test**: quickstart.md "Edit a namespace": rename, add interface, rename it, MTU 1400, state down, add and remove `10.0.0.5/24`; canvas card matches; undo reverses one edit.

- [X] T011 [P] [US1] Create `src/components/inspector/AddressList.tsx`: props `interfaceId`; reads the interface's addresses from the store; one row per address with a Remove button calling `edit` with `removeAddress`; below it a `ValidatedField` ("Add address", key `address-<interfaceId>`) whose rule is `validateAddress` and whose commit calls `edit` with `addAddress` then clears the field (key the field so its draft resets after a commit)
- [X] T012 [US1] Create `src/components/inspector/InterfaceEditor.tsx`: props `interfaceId`; a `ValidatedField` for the name (`validateInterfaceName`, commit `renameInterface`), a `ValidatedField` for MTU (`validateMtu`, commit `setInterfaceMtu` with the number), a select for state from `STATE_CHOICES` (writes immediately with `setInterfaceState`), `AddressList`, and the existing `RemoveInterfaceButton` from `src/components/nodes/InterfaceRow.tsx`. All writes go through `useTopologyStore.getState().edit(...)`. Depends on T011
- [X] T013 [US1] Create `src/components/inspector/NamespaceForm.tsx`: props `nodeId`; heading area with a `ValidatedField` for the node name (rule uses `validateNodeName` from `documentOps.ts`, commit uses `renameNode` through `edit`); an "Interfaces" section listing one `InterfaceEditor` per interface (`interfacesOf` from `topologyStore.ts`) followed by the existing `AddInterfaceButton`; scrollable. Depends on T012
- [X] T014 [US1] Edit `src/components/NodeInspector.tsx`: when exactly one selected node has type namespace, render `NamespaceForm` with `key={node.id}`; keep the existing views for a bridge, several nodes, and nothing selected
- [ ] T015 [US1] Manual check from quickstart.md "Edit a namespace"; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: A namespace can be named, given interfaces, MTUs, states, and addresses from the panel.

---

## Phase 4: User Story 2 - See and fix invalid values as you type (Priority: P1)

**Goal**: Errors show next to the field; bad values never reach the lab; the panel says the lab has errors.

**Independent Test**: quickstart.md "Invalid values" table, every row; Escape and fix flows.

- [X] T016 [P] [US2] Create `src/components/inspector/ErrorBanner.tsx`: reads the error count from `fieldErrorStore`; when above 0 shows `errorBannerText(count)` in `text-led-fault` with `role="status"`; renders nothing at 0
- [X] T017 [US2] Edit `src/components/inspector/NamespaceForm.tsx`: render `ErrorBanner` at the top of the form
- [X] T018 [US2] Review `src/components/inspector/ValidatedField.tsx` and `src/hooks/useFieldDraft.ts` against the "Field behavior" table in contracts/ui-contract.md: Enter or blur with a valid draft writes once; with an invalid draft writes nothing and keeps draft and error; Escape restores the lab value and clears the error and the error-store flag; unmounting (selecting another node) clears the flag. Fix any gap
- [ ] T019 [US2] Manual check from quickstart.md "Invalid values" (all rows, fix, Escape) and the edge check "Select another node with a bad draft open"; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Every covered field validates live and never writes a bad value.

---

## Phase 5: User Story 3 - Set the role, default gateway, and static routes (Priority: P2)

**Goal**: Role select, default gateway field, and a static routes table with the same live checks.

**Independent Test**: quickstart.md "Role, gateway, routes", steps 1 to 5.

- [X] T020 [P] [US3] Create `src/components/inspector/RoleField.tsx`: props `nodeId`; when the node's role is `host` or `router`, a select of `ROLE_CHOICES` writing `setRole` through `edit` (the canvas icon follows via `nodeKindOf`); otherwise (`nat` or no role) read-only text of the role (or "Namespace" when none)
- [X] T021 [P] [US3] Create `src/components/inspector/GatewayField.tsx`: props `nodeId`; value is the gateway of the node's first default route (destination `0.0.0.0/0` or `::/0`) or empty; a `ValidatedField` (`validateGateway`, commit `setDefaultGateway`; empty commit removes the default route)
- [X] T022 [P] [US3] Create `src/components/inspector/RouteRow.tsx`: props `nodeId`, `index` (stored route) or `draft` mode; four fields: destination (`validateDestination`), gateway (`validateGateway`), output interface (select of this node's interfaces by name plus an empty choice), metric (`validateMetric`); a stored route row commits each field through `updateRoute` after `validateRoute` passes on the would-be route; Remove calls `removeRoute`. In draft mode the fields hold local text and a Confirm button calls `addRoute` only when `validateRoute` is null; Cancel discards the draft
- [X] T023 [US3] Create `src/components/inspector/RoutesTable.tsx`: props `nodeId`; lists static routes (`node.routes` without default routes) as `RouteRow`s, an "Add route" button that shows one draft row, and an empty-state line when there are none. Depends on T022
- [X] T024 [US3] Edit `src/components/inspector/NamespaceForm.tsx`: add `RoleField` under the name, then after the interfaces add the "Default gateway" section (`GatewayField`) and the "Static routes" section (`RoutesTable`). Depends on T020, T021, T023
- [ ] T025 [US3] Manual check from quickstart.md "Role, gateway, routes" steps 1 to 5 (including route removal when its interface is removed, and NAT shown as text); `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: Role, gateway, and routes edit and validate like every other field.

---

## Phase 6: User Story 4 - Observed column and lab name (Priority: P3)

**Goal**: A read-only "Not deployed" on each interface and route row; an editable lab name when nothing is selected.

**Independent Test**: quickstart.md "Observed and lab name".

- [ ] T026 [P] [US4] Edit `src/components/inspector/InterfaceEditor.tsx` and `src/components/inspector/RouteRow.tsx`: add a read-only line "Observed: " plus `OBSERVED_TEXT` in `text-ink-muted text-xs`, not focusable, not an input
- [ ] T027 [P] [US4] Create `src/components/inspector/LabNameField.tsx`: a `ValidatedField` for the lab name (`validateLabName`, commit `renameLab` through `edit`)
- [ ] T028 [US4] Edit `src/components/NodeInspector.tsx`: in the nothing-selected view render `LabNameField` above the existing hint (the summary counts come with the link and bridge panel feature)
- [ ] T029 [US4] Manual check from quickstart.md "Observed and lab name"; `npm run build && npm run lint && npm run format:check` pass

**Checkpoint**: All four stories work together.

---

## Phase 7: Polish

- [ ] T030 Run the whole of quickstart.md once on a fresh page load; confirm no console errors; confirm typing in one field does not re-render the others (React dev tools or visible flicker); confirm undo and redo of each kind of edit
- [ ] T031 Confirm constitution rules across the new files: no inline strings with meaning (all from `constants/inspector.ts`), every function under 100 lines, `NamespaceForm.tsx` and `RoutesTable.tsx` stay small; `npm run build && npm run lint && npm run format:check` pass

---

## Dependencies and Order

- Phase 1 → Phase 2 → stories. T004 needs T001 to T003; T005 needs T002; T008 needs T006; T009 needs T008.
- US1 (T011 to T015) needs Phase 2.
- US2 (T016 to T019) needs US1 (the form must exist).
- US3 (T020 to T025) needs US1; independent of US2 except the shared `NamespaceForm.tsx` edit (T024 after T017).
- US4 (T026 to T029) needs US1 and US3 (`RouteRow.tsx`).
- Polish last.

## Parallel Opportunities

- T001 and T002 together.
- T003, T005, and T006 together once T002 is done.
- T011 can start as soon as Phase 2 is done; T016 is independent of T011.
- T020, T021, and T022 together (different files).
- T026 and T027 together.

## Implementation Strategy

- **MVP**: Phase 1, Phase 2, US1. You can already name a namespace and give it addresses.
- Then US2 (error banner and behavior audit), then US3 (routes), then US4, then polish.
- Stop and run the manual check after each story; keep the app runnable after each ticket.
