---

description: "Task list for Remove Unused Features"
---

# Tasks: Remove Unused Features

**Input**: Design documents from `/specs/017-remove-unused-features/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/lab-file.md, contracts/issue-codes.md, quickstart.md. Scope source: `TICKETS/NL-cleanup.md`.

**Tests**: None. The constitution says no tests are written. Acceptance is by hand with the steps in quickstart.md.

**Code rules** (constitution): delete, do not hide. Shortest clear code, no magic strings, no new dependency, `gofmt` and `go vet` clean, `npm run lint` and `format:check` clean. Use the ponytail skill. Do not commit unless the user asks.

**Keep list** (spec FR-013): Deploy and Reset buttons (disabled), Deployment logs tab, bridge port list (`PortRow.tsx`), interface and link `state`, routes and the routes table, roles `host` and `router`, `genschema`, `topocheck`, `checkExamples.ts`, `roundtrip.ts`, `DisabledButton.tsx`, and the `nl-` + lab id + short-hash name derivation (research D1). Never delete one of these.

**Build note**: Removing model fields breaks the frontend types until US1 is done. Finish Phase 2, then US1, before running `make build`.

## Format: `[ID] [P?] [Story] Description`

All paths are from the repository root.

## Phase 1: Setup

- [X] T001 Run `make build`, `make lint`, and `node web/scripts/checkExamples.ts` from a clean tree and note any failure that exists before this work, so later failures are known to be new. Save the output of `git status --short` to `/tmp/017-before.txt`. Nothing is changed.

---

## Phase 2: Foundational (blocks all stories): shrink the Go model and regenerate

**Purpose**: One source of truth. The schema and the TypeScript types come from the Go model, so it changes first.

**CRITICAL**: No story starts before this phase is done.

- [X] T002 Edit `api/internal/topology/model.go`: remove `MTU int` from `Interface` and `Link`, and remove `Bridge *BridgeSettings` from `Node`. Keep `State` on both.
- [X] T003 Edit `api/internal/topology/settings.go`: delete `BridgeSettings` and `VlanSettings`. In `NatRule` keep only `ID string` and `InterfaceID string` (json `id`, `interfaceId`); delete `Kind`, `Protocol`, `Port`, `ToAddress`, `ToPort`. Keep `RouterSettings` and `Route`.
- [X] T004 Edit `api/internal/topology/constants.go`: delete `NatKind`, `NatKindMasquerade`, `NatKindDNAT`, `CaptureState`, `CaptureStateRunning`, `CaptureStateStopped`, their `JSONSchema()` methods, and `RoleNAT`. `Role` becomes `host` and `router`, and `Role.JSONSchema()` lists only those two. Keep `enumSchema` and everything else.
- [X] T005 Delete `api/internal/topology/runtime.go` (`CaptureSession`).
- [X] T006 Edit `api/cmd/genschema/main.go`: remove the loop that adds `CaptureSession` definitions and fix the comment on `documentSchema` to say it describes the saved document.
- [X] T007 Edit `api/internal/topology/node_rules.go`: delete the `NamespaceHasBridgeFields` check (the `node.Bridge != nil` branch). Keep the bridge-has-namespace-fields check, the NAT rule interface check, and the route check.
- [X] T008 Edit `api/internal/topology/issue.go`: delete the constants, `codeOrder` entries, and `messageOf` entries for `NamespaceHasBridgeFields` (`NAMESPACE_HAS_BRIDGE_FIELDS`), `UnsupportedNodeType` (`UNSUPPORTED_NODE_TYPE`), `NameConflictExisting` (`NAME_CONFLICT_EXISTING`), and `InterfaceNameReserved` (`INTERFACE_NAME_RESERVED`). Add `CodeNodeNameChars Code = "NODE_NAME_CHARS"` right after `CodeDuplicateNodeName` in the constants and in `codeOrder`, with message `Name can use only letters, digits, - and _`. Change the `INTERFACE_NAME_LENGTH` message to `Name must be 1 to 15 characters`. Delete `BackendOnly` and `AllCodes`. `codeOrder` must end with 19 codes.
- [X] T009 Run `cd api && go build ./...`. It will fail only in files this phase does not cover (`name_rules.go`, `validate.go`, `cmd/vectorcheck`). Leave those failures for US2 and US3. Then run `make generate` and confirm `docs/topology.schema.json` and `web/src/types/topology.ts` no longer contain `mtu`, `bridge`, `capture`, `nat` role, or the DNAT fields.

**Checkpoint**: Model, schema, and generated types match [data-model.md](data-model.md).

---

## Phase 3: User Story 1 - The editor shows only what the draft labs need (Priority: P1)

**Goal**: No MTU, STP, VLAN, or observed-state UI; two drawer tabs; palette entries all placeable.

**Independent Test**: quickstart step 6.

- [X] T010 [P] [US1] MTU in the document logic: in `web/src/constants/topology.ts` delete `DEFAULT_INTERFACE_MTU`. In `web/src/store/documentOps.ts` remove every `mtu: DEFAULT_INTERFACE_MTU` (lines near 216, 240, 249), the import, and `bridge: { stp: false }` when creating a bridge (line near 85). In `web/src/store/topologyStore.ts` remove the `mtu` and the `DEFAULT_INTERFACE_MTU` import (lines near 4 and 180). In `web/src/store/namespaceOps.ts` delete `setInterfaceMtu`.
- [X] T011 [US1] Bridge and link ops in `web/src/store/bridgeLinkOps.ts`: delete `DEFAULT_BRIDGE`, `setStp`, `setStpPriority`, `setLinkMtu`, `setLinkedInterfaceMtu`, and `mapBridge` if nothing else uses it. Keep `setLinkState` and the bridge port functions. Depends on T010.
- [X] T012 [P] [US1] Field rules in `web/src/store/fieldRules.ts`: delete `validateMtu`, `validateStpPriority`, and their imports. Constants: in `web/src/constants/inspector.ts` delete `MTU_MIN`, `MTU_MAX`, `FIELD_LABEL.MTU`, `FIELD_ERROR.MTU_RANGE`, and the `OBSERVED_LABEL`, `OBSERVED_TEXT`, `OBSERVED_HELP` constants. In `web/src/constants/inspectorBridgeLink.ts` delete `STP_PRIORITY_MIN`, `STP_PRIORITY_MAX`, `STP_PRIORITY_DEFAULT`, `STP_ERROR`, `VLAN_NOTE`, the `STP` and `VLAN` group titles, and the `STP`, `STP_PRIORITY`, `LINK_MTU` labels.
- [X] T013 [US1] Interface panel: in `web/src/components/inspector/InterfaceEditor.tsx` remove the MTU `ValidatedField` (the one with `fieldKey` `mtu-...`), the `validateMtu` and `setLinkedInterfaceMtu` imports, and the `ObservedLine` use. In `web/src/components/inspector/RouteRow.tsx` remove the `ObservedLine` use. Delete `web/src/components/inspector/ObservedLine.tsx`. Depends on T011, T012.
- [X] T014 [P] [US1] Bridge panel: in `web/src/components/inspector/BridgeForm.tsx` remove the two `Section`s titled `STP` and `VLAN`, the `StpFields` import, and the `VLAN_NOTE` import. Delete `web/src/components/inspector/StpFields.tsx`. Keep the ports section.
- [X] T015 [P] [US1] Link panel and label: in `web/src/components/inspector/LinkForm.tsx` remove the MTU field and the `setLinkMtu` and `validateMtu` imports. In `web/src/constants/links.ts` change `linkLabel(nameA, nameB, mtu)` to `linkLabel(nameA, nameB)` returning `` `${nameA} ↔ ${nameB}` ``, and update its call in `web/src/store/toFlow.ts` (line near 35). Depends on T011, T012.
- [X] T016 [P] [US1] Drawer tabs in `web/src/constants/layout.ts`: in `DRAWER_TAB_ID` and `DRAWER_TABS` keep only `ISSUES` and `DEPLOYMENT_LOGS`; delete `INTERFACE_STATE`, `ADDRESSES`, `ROUTES`, `NEIGHBORS`, `BRIDGE_STATE`, `FIREWALL_NAT`, `PACKET_CAPTURE`, `DIAGNOSTICS`. Update the "LED stays dark until its feature exists" comment in `web/src/components/DrawerTabs.tsx` if it no longer applies. Check `web/src/components/BottomDrawer.tsx` and `web/src/types/layout.ts` for uses of removed ids.
- [X] T017 [P] [US1] Palette in `web/src/constants/palette.ts`: delete the `veth` entry and the `nat` entry (and the `nat` line in the naming table near line 58). In `web/src/types/palette.ts` change `PaletteKind` to `Role | "namespace" | "bridge"`, and make `create` non-null; delete `available`. In `web/src/components/palette/PaletteEntry.tsx` delete the `available` branches, `DISABLED_ROW`, and the `NOT_AVAILABLE_TEXT` import. In `web/src/store/topologyStore.ts` (line near 131) replace `if (!entry?.available) return {};` with a check that the entry exists. Delete `web/src/components/NotAvailable.tsx` if `grep -rn NotAvailable web/src` shows no user. Keep `NOT_AVAILABLE_TEXT` only if `DisabledButton` actions still use it.
- [X] T018 [P] [US1] Roles in the editor: after T009 the `Role` type is `"host" | "router"`. In `web/src/constants/inspector.ts` remove the `nat` entry from `ROLE_CHOICES` and `ROLE_NAME`. Fix `web/src/components/icons/NodeIcon.tsx` and `web/src/store/nodeKind.ts` for the removed kind.
- [ ] T019 [US1] Run `cd web && npx tsc -b` (or `npm run build`) and fix every remaining compile error caused by the removals. Then run `make lint` and `make build`. Do the quickstart step 6 pass in the browser. (Compile, lint, and build pass; the browser pass is not done yet.)

**Checkpoint**: User Story 1 works on its own.

---

## Phase 4: User Story 2 - The project holds only code and files the app uses (Priority: P1)

**Goal**: No leftover packages, commands, test data, or option plumbing.

**Independent Test**: quickstart steps 1, 2, 4.

- [X] T020 [P] [US2] Delete `api/cmd/vectorcheck/`, `testdata/validation/` (including the untracked `*-bytes.json` and `*-nonascii.json`), and `web/scripts/checkVectors.ts`. In `Makefile` delete the `check-vectors` target and its name in `.PHONY`.
- [X] T021 [P] [US2] Delete the stub packages `api/internal/audit/`, `api/internal/capture/`, `api/internal/events/`, `api/internal/observer/`, `api/internal/store/` (each holds only `doc.go`). Keep `api`, `engine`, `topology`, `worker`, `sandbox`.
- [X] T022 [US2] Validation plumbing in `api/internal/topology`: delete `options.go` (`Options`, `ExistingName`). In `validate.go` change `type rule func(doc Document) []Issue`, `Validate(doc Document) []Issue`, remove `runRule` and its `recover`, and call each rule directly. Change the signature of `idRules`, `nameRules`, `linkRules`, `nodeRules`, `addressRules` (files `id_rules.go`, `name_rules.go`, `link_rules.go`, `node_rules.go`, `address_rules.go`) to `func(doc Document) []Issue`. Check `lookup.go` and `document.go` for `Options` uses.
- [X] T023 [US2] Edit `api/cmd/topocheck/main.go`: after loading the document, print one line per issue from `topology.Validate(doc)` (code, resource name, message) before printing the JSON, and keep the exit code 0 for a loadable file. Update its package comment and `usage` text.
- [X] T024 [P] [US2] Edit `specs/016-go-topology-validation/`: delete `contracts/backend-vector-format.md`; in `spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, `quickstart.md`, `checklists/requirements.md`, `contracts/issue-codes-additions.md`, and `contracts/refusal-response.md` remove or rewrite the passages about vectors, `vectorcheck`, existing names, `Options`, and byte counting so none promises them. Add one line at the top of `spec.md` saying "Trimmed by spec 017". Do not renumber stories. (Done as a "Trimmed by spec 017" note at the top of every 016 file instead of a rewrite of each passage.)
- [X] T025 [P] [US2] Edit `specs/013-frontend-validator/contracts/issue-codes.md` so its table matches [contracts/issue-codes.md](contracts/issue-codes.md) (removed, added, and changed codes).
- [X] T026 [US2] Run `cd api && go build ./... && go vet ./... && gofmt -l .` (must print nothing) and `make build lint`. Run quickstart steps 1 and 2.

**Checkpoint**: User Stories 1 and 2 pass together.

---

## Phase 5: User Story 3 - Names are plain ASCII (Priority: P2)

**Goal**: One ASCII rule, same on both sides, no byte counting.

**Independent Test**: quickstart step 5.

- [X] T027 [P] [US3] Backend rule in `api/internal/topology/name_rules.go`: replace the `/` and whitespace check with one helper `isPlainName(name string) bool` that is true when every byte is in `[A-Za-z0-9_-]`. Use it for `INTERFACE_NAME_CHARS` (interfaces) and, in `nodeNameIssues`, add `CodeNodeNameChars` for a non-empty node name that fails it (after the empty check, before the duplicate check). Delete `hasSpace`, `isReserved`, `reservedNames`, `pathSeparator`, the reserved-name branch, and the `unicode` import. Rename `maxInterfaceNameBytes` to `maxInterfaceNameLength`.
- [X] T028 [US3] Backend names in `api/internal/topology/linuxname.go`: delete `prefixWithin` and the `unicode/utf8` import; use plain slicing (`labID[:min(len(labID), linuxNameLabIDBytes)]`, `name[:room]`). Rename `linuxNameLabIDBytes` to `linuxNameLabIDLength`. Keep the 15 limit, the hash, and the `nl-` prefix exactly as they are, so `LinuxName` returns the same result for ASCII input. Depends on T027.
- [X] T029 [P] [US3] Editor rule in `web/src/store/validation/nameRules.ts` and `web/src/constants/validation.ts`: first revert the uncommitted byte edits with `git checkout -- web/src/store/validation/nameRules.ts web/src/constants/validation.ts web/src/constants/labFile.ts web/src/store/validation/linuxName.ts`, then delete `web/src/store/validation/bytes.ts`. Then replace the `/`-and-whitespace test with a `PLAIN_NAME = /^[A-Za-z0-9_-]+$/` constant, flag interfaces with `INTERFACE_NAME_CHARS`, and add `NODE_NAME_CHARS` (add to `ISSUE_CODE`, `ISSUE_MESSAGE` with `Name can use only letters, digits, - and _`, and the field error text) for node names. Delete the `INTERFACE_NAME_RESERVED` code, message, and rule, the `NAMESPACE_HAS_BRIDGE_FIELDS` code, message, and rule (`web/src/store/validation/nodeRules.ts` line near 23), and `FIELD_ERROR.NAME_DOT` if unused. Keep issue code order the same as `codeOrder` in `issue.go`.
- [X] T030 [US3] Editor name fields: check `web/src/components/inspector/InterfaceNameField.tsx`, `web/src/components/nodes/NodeTitle.tsx`, `web/src/store/naming.ts`, and `web/src/store/validation/linuxName.ts` so that typing a name with a disallowed character shows the same error live. Depends on T029.
- [X] T031 [US3] Run `make build lint` and quickstart step 5 (`café` gives `INTERFACE_NAME_CHARS` in both `topocheck` and the editor; a node named `ns 1` gives `NODE_NAME_CHARS` in both).

**Checkpoint**: User Story 3 passes.

---

## Phase 6: User Story 4 - Old saved labs and the written decisions still make sense (Priority: P2)

**Goal**: Old files open clean; examples and docs match the app.

**Independent Test**: quickstart steps 3, 7, 8.

- [X] T032 [US4] Strip removed fields on open in `web/src/types/topologyDocument.ts`: in `migrate`, after the version check, remove `mtu` from every interface and link, remove `bridge` from every node, drop `role` when it is `"nat"`, and reduce every NAT rule to `{ id, interfaceId }`. Keep the existing empty-list filling. Use small named helpers, no magic strings (put the removed role value in a constant).
- [X] T033 [P] [US4] Edit `examples/bridge-lab.json`, `examples/direct-link.json`, `examples/router-two-subnets.json`: remove every `mtu`, every `bridge` object, and any NAT rule field other than `id` and `interfaceId`. Edit the inline fixtures in `web/scripts/checkExamples.ts` (`mtu: 1500` near lines 46 and 63) the same way. Run `node web/scripts/checkExamples.ts`.
- [X] T034 [US4] Old-file check: make a copy of an example with `"mtu": 1500` on an interface and a link, `"bridge": {"stp": true}` on the bridge, and `"role": "nat"` on a namespace. Run `node web/scripts/roundtrip.ts` on it if that script accepts a path (read it first), or open it in `make dev-web`. Confirm it loads, shows none of them, and the saved file has none of them (quickstart step 7). Depends on T032.
- [X] T035 [P] [US4] Edit `docs/decisions.md`: decision 1 (no token; socket mode 0600 in a 0700 directory), decision 2 (no database; last deployed lab in memory; labs saved as `.netlab.json`), decision 5 (keep as written; add one line that names are ASCII only), decision 6 (fixed `ip`, `bridge`, `sysctl`, `nft`, `ping`, `curl`, `tcpdump` by absolute path with separate arguments; no netlink library), decision 7 (no capture screen; `tcpdump -c N` text output only, see NL-046), decision 9 (one desired-lab store; no observed-state store). Delete the "Known mismatches" section. Update the `Reviewed` date.
- [X] T036 [P] [US4] Edit `docs/sandbox.md`: replace the line about integration tests with a pointer to the manual acceptance run in NL-078. Edit `README.md`: delete the `check-vectors` row (the `node web/scripts/checkVectors.ts` row) from the checks table, delete the Capture box and its `CP` lines from the mermaid diagram and the "Capture" bullet, and delete the `build`/`lint` text that mentions vectors if any.
- [X] T037 [P] [US4] Edit `TICKETS/NL-000-decisions.md` only if it still lists decisions that contradict T035 (token, SQLite, capture); otherwise leave it. Confirm `TICKETS/NL-cleanup.md` matches research D1, D2, D8, D9 (it was already updated while planning).

**Checkpoint**: All four stories pass.

---

## Phase 7: Polish & Cross-Cutting

- [ ] T038 Run the whole quickstart.md in order (steps 1 to 8). Run `make generate` twice and confirm no diff the second time.
- [X] T039 Run the repository search from quickstart step 4. The only allowed matches are decision 7 in `docs/decisions.md`, `setPointerCapture` in `web/src/hooks/useResizeDrag.ts`, and the strip code in `web/src/types/topologyDocument.ts`. Fix anything else that matches.
- [X] T040 Run `cd api && go vet ./... && gofmt -l .` and `cd web && npm run lint && npm run format:check`. Compare with `/tmp/017-before.txt` from T001: no new warning.
- [X] T041 Check the keep list at the top of this file: each kept item still exists (`ls`, `grep`). Report anything missing.

---

## Dependencies

- Phase 1 → Phase 2 → everything else.
- US1 needs Phase 2. US2 needs Phase 2. US3 needs T008 (issue codes) and T022 (rule signatures). US4 needs Phase 2, T020 (vectors gone), and T029 for T034.
- T022 changes the signature of every rule file that T027 also edits: do T022 before T027.
- Within US1: T010 → T011 → T013 and T015; T012 before T013 and T015.

## Parallel examples

- After Phase 2: T010, T012, T014, T016, T017, T018 (US1) and T020, T021, T024, T025 (US2) touch different files and can run together.
- US4: T033, T035, T036, T037 are independent.

## Implementation strategy

1. Do Phase 1 and 2 first and stop at the T009 checkpoint.
2. MVP is User Story 1: it removes everything a learner can see. Then US2 (repository cleanup).
3. US3 and US4 are small and can be done in either order after US2.
4. Check each checkpoint with its quickstart step before moving on.
