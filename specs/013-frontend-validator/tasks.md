---

description: "Task list for Lab Validator"
---

# Tasks: Lab Validator

**Input**: Design documents from `/specs/013-frontend-validator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/issue-codes.md, contracts/vector-format.md

**Tests**: None. The constitution says no tests are written. Acceptance is by hand: `node web/scripts/checkVectors.ts` plus the steps in quickstart.md.

**Code rules** (constitution): shortest clear code, no magic strings (every issue code, message, limit, and label is a named constant), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding and the frontend-design skill for UI tasks. Do not commit unless the user asks.

**Validator purity rule**: files under `web/src/store/validation/` import only types and plain constants (no React, no Zustand store), and every relative import ends in `.ts`, so `web/scripts/checkVectors.ts` runs under plain Node. Do not use path aliases.

**Crash rule**: any `useTopologyStore` selector that returns an array or object MUST be wrapped in `useShallow` from `zustand/react/shallow`.

**UI rule**: use existing theme tokens only; never color alone (add text or a glyph); follow the look of the existing inspector panels and drawer.

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Names and types every later task uses.

- [X] T001 [P] Create `src/types/validation.ts` with `Severity = "error" | "warning"`, `IssueCode` (union from `ISSUE_CODE` values), `Issue { severity, code, resourceId: string, resourceName: string, message: string, relatedIds: string[] }`, and `IssueTarget { nodeIds: string[]; linkId: string | null }` as in `data-model.md`
- [X] T002 [P] Create `src/constants/validation.ts` with: `SEVERITY = { ERROR: "error", WARNING: "warning" }`; `ISSUE_CODE` containing exactly the 20 codes in `contracts/issue-codes.md` (string value equals the key); `ISSUE_SEVERITY` mapping each code to its severity from the contract table (only `DUPLICATE_IP_ON_SEGMENT` is `warning`); `ISSUE_ORDER` (the codes in the table order, used as the sort tie-break); `ISSUE_MESSAGE` mapping every code to one plain-text message; `LINUX_NAME = { PREFIX: "nl-", LAB_ID_CHARS: 4, MAX: 15, HASH_DIGITS: 4, SEPARATOR: "-" }`; texts `ISSUES_TAB_LABEL = "Issues"`, `ISSUES_EMPTY_TEXT = "No issues found"`, `ISSUES_CLOSE_LABEL = "Close"`, `issuesCountText(errors, warnings)`, `SEVERITY_LABEL = { error: "Error", warning: "Warning" }`, `SEVERITY_GLYPH = { error: "✕", warning: "!" }`. Depends on T001 for types only

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Pure helpers, the aggregator, and the live-state plumbing.

**CRITICAL**: No story starts before this phase is done.

- [X] T003 [P] Edit `src/store/ipAddress.ts`: add `cidrContains(cidr: string, ip: string): boolean`. Different IP families return false. Use `BigInt` for both families: parse each address to a bigint plus bit width (32 or 128), then compare the top `prefix` bits. Reuse `isIpv4`, `isIpv6`, and the existing prefix limits. Imports in this file must end in `.ts` if it gains any
- [X] T004 [P] Create `src/store/validation/linuxName.ts` with `fnv1a32(text): number` (32-bit FNV-1a over UTF-8 bytes) and `linuxName(labId: string, name: string): string` exactly as in `contracts/issue-codes.md`: `base = LINUX_NAME.PREFIX + labId.slice(0, LINUX_NAME.LAB_ID_CHARS) + LINUX_NAME.SEPARATOR`; if `base + name` is at most `LINUX_NAME.MAX` characters use it, else `base + name.slice(0, MAX - base.length - HASH_DIGITS - 1) + "-" + low 16 bits of the hash as 4 lowercase hex digits`. Result is always at most 15 characters
- [X] T005 Create `src/store/validation/validate.ts`: `type Rule = (document: Document) => Issue[]`; export `validate(document: Document): Issue[]` that runs a `RULES` array, drops nothing, and returns issues sorted errors first, then by index in `ISSUE_ORDER`, then by `resourceId` (deterministic, FR-003). Export helper `makeIssue(code, resourceId, resourceName, relatedIds = [])` that fills `severity` from `ISSUE_SEVERITY` and `message` from `ISSUE_MESSAGE`. Start with `RULES = []`; later tasks append. Wrap each rule call so one throwing rule never crashes the rest (FR-022): catch and skip. Depends on T001, T002
- [X] T006 [P] Create `src/store/validation/issueTarget.ts`: `issueTarget(document, issue): IssueTarget`. Resolve `resourceId` and every id in `relatedIds`: a node id gives that node; an interface id gives its owning node (when it exists); a link id gives `linkId` (the first link found) and, if both endpoints exist, nothing else. Missing resources add nothing. Return `{ nodeIds: [], linkId: null }` when nothing resolves. Depends on T001
- [X] T007 [P] Create `src/store/validationStore.ts` (Zustand, same style as `layoutStore.ts`): `{ open: boolean; setOpen(open: boolean) }`, default `false`, not persisted
- [X] T008 Create `src/hooks/useIssues.ts`: `useIssues(): Issue[]` returns `[]` while `useValidationStore` `open` is false, else `useMemo(() => validate(document), [document])` with `document` from `useTopologyStore`. Depends on T005, T007

**Checkpoint**: `npm run build` passes; `validate({ ...emptyDoc })` would return `[]`.

---

## Phase 3: User Story 1 - Check the lab and see every problem (Priority: P1)

**Goal**: Pressing Validate opens a live list of issues with severity, code, resource name, and message.

**Independent test**: quickstart.md section 2.

- [X] T009 [P] [US1] Create `src/store/validation/idRules.ts`: `idRules(document): Issue[]` giving one `DUPLICATE_ID` issue for each later node, interface, or link whose `id` was already seen in its own list (the resource name is the node name, interface name, or link id). Append it to `RULES` in `validate.ts`
- [X] T010 [P] [US1] Create `src/store/validation/nameRules.ts` with pure, exported rule helpers returning issue codes: `nodeNameCodes(document, nodeId, name): IssueCode[]` returning `NODE_NAME_EMPTY` when `name.trim()` is empty, `DUPLICATE_NODE_NAME` when another node already has the trimmed name, and `LINUX_NAME_COLLISION` when `linuxName(document.lab.id, name.trim())` equals the derived name of another node; `interfaceNameCodes(document, interfaceId, name): IssueCode[]` returning `INTERFACE_NAME_LENGTH` unless the name is "1 to 15 characters" (use `INTERFACE_NAME_MAX` from `src/constants/inspector.ts`), `INTERFACE_NAME_CHARS` when the name contains `/` or whitespace (reuse `PATH_SEPARATOR`), `INTERFACE_NAME_RESERVED` when the name is `.` or `..`, and `DUPLICATE_INTERFACE_NAME` when another interface of the same node has the name. Also export `nameRules(document): Issue[]` that runs both helpers for every node and interface using each resource's current name (one issue per code, never one per character) and, for duplicates and collisions, reports the later resource and puts the earlier one in `relatedIds`. Append `nameRules` to `RULES` in `validate.ts`. Depends on T004
- [X] T011 [US1] Edit `src/constants/layout.ts`: add `ISSUES` to `DRAWER_TAB_ID` and a first entry in `DRAWER_TABS` with `label: ISSUES_TAB_LABEL` and a short hint; edit `FILE_ACTIONS` so `validate` is enabled (`enabled: true`, no disabled reason needed) — adjust `ToolbarAction`/`disabledAction` use so enabled actions still type-check. Depends on T002
- [X] T012 [P] [US1] Create `src/components/IssueRow.tsx`: one issue as a row showing the severity glyph and label (text, not color alone), the code in a muted mono style, the resource name, and the message; a `<button>` with `onClick` prop (wired in US2). Use `SEVERITY_LABEL` and `SEVERITY_GLYPH`
- [X] T013 [US1] Create `src/components/IssuesPanel.tsx`: header with `issuesCountText(errors, warnings)` and a Close button (`ISSUES_CLOSE_LABEL`) that calls `setOpen(false)`; body lists `useIssues()` through `IssueRow`, or `ISSUES_EMPTY_TEXT` when empty; scrolls inside the drawer. Depends on T008, T012
- [X] T014 [US1] Edit `src/components/BottomDrawer.tsx`: when the active tab is `DRAWER_TAB_ID.ISSUES`, render `IssuesPanel` instead of `NotAvailable`. Depends on T011, T013
- [X] T015 [US1] Edit `src/components/Toolbar.tsx`: give the `validate` action an `onClick` that calls `useValidationStore.getState().setOpen(true)`, expands the drawer only if `drawerCollapsed` is true (call `toggleDrawer` in that case; never collapse an open drawer), and sets the active tab to `DRAWER_TAB_ID.ISSUES` through `useLayoutStore`. Closing from the panel does not change the tab. Depends on T011, T007

**Checkpoint**: quickstart section 2 passes for duplicate names (live list, undo and redo follow).

---

## Phase 4: User Story 2 - Jump from an issue to the offending item (Priority: P1)

**Goal**: Click an issue to select its node or link; offending nodes and links are highlighted while the list is open.

**Independent test**: quickstart.md section 3.

- [X] T016 [US2] Edit `src/components/IssueRow.tsx` / `IssuesPanel.tsx`: on click, compute `issueTarget(document, issue)`; if `linkId` is set call `setLinkSelection(linkId)`, else if `nodeIds` is not empty call `setSelection([nodeIds[0]])`; do nothing when the target is empty. Use the existing actions in `src/store/topologyStore.ts`. Depends on T006, T013
- [X] T017 [P] [US2] Create `src/hooks/useIssueHighlights.ts`: returns `{ nodes: Map<string, Severity>; links: Map<string, Severity> }` built from `useIssues()` and `issueTarget`, keeping the worst severity per id (error beats warning); empty maps when the list is closed. Wrap in `useMemo`. Depends on T006, T008
- [X] T018 [US2] Edit `src/types/flow.ts` and `src/store/toFlow.ts`: add optional `issue?: Severity` to `FlowNodeData`; `toFlowNodes(document, highlights?)` and `toFlowEdges(document, highlights?)` accept the maps from T017 and set `data.issue` on nodes and a `className` (error or warning link style) on edges. Add the two edge class names as constants in `src/constants/validation.ts`. Depends on T017
- [X] T019 [US2] Edit `src/components/Canvas.tsx` to call `useIssueHighlights()` and pass the maps into `toFlowNodes` and `toFlowEdges`; edit `src/components/nodes/NodeCard.tsx` to add a ring and a small glyph for `data.issue` (error ring and warning ring from existing tokens, glyph from `SEVERITY_GLYPH`) alongside the existing selected ring; pass `data.issue` from `NamespaceNode.tsx` and `BridgeNode.tsx`. Add the link highlight styles to `src/index.css` using existing tokens. Depends on T018

**Checkpoint**: quickstart section 3 passes (click selects, rings show, closing the list removes them).

---

## Phase 5: User Story 3 - See name problems as soon as they happen (Priority: P1)

**Goal**: The same name rules block or flag edits next to the field with no Validate click.

**Independent test**: quickstart.md section 4.

- [X] T020 [P] [US3] Edit `ISSUE_MESSAGE` in `src/constants/validation.ts` so the seven name codes (`NODE_NAME_EMPTY`, `DUPLICATE_NODE_NAME`, `LINUX_NAME_COLLISION`, `DUPLICATE_INTERFACE_NAME`, `INTERFACE_NAME_LENGTH`, `INTERFACE_NAME_CHARS`, `INTERFACE_NAME_RESERVED`) reuse the existing `NAME_ERROR` and `FIELD_ERROR` texts from `src/constants/inspector.ts` and `src/store/documentOps.ts` (import them; do not copy), plus one new text for `LINUX_NAME_COLLISION`. There is ONE message table: the list and the field show the same text per code (research §3). Do not create a second table
- [X] T021 [US3] Edit `src/store/documentOps.ts`: `validateNodeName(document, nodeId, name)` returns `ISSUE_MESSAGE[nodeNameCodes(document, nodeId, name)[0]] ?? null` (first code wins); keep the current signature so `BridgeForm`, `NamespaceForm`, and `topologyStore.ts` callers do not change. Depends on T010, T020
- [X] T022 [US3] Edit `src/store/fieldRules.ts`: `validateInterfaceName(document, interfaceId, name)` returns `ISSUE_MESSAGE[interfaceNameCodes(document, interfaceId, name)[0]] ?? null`; remove the now-duplicated length, character, reserved, and uniqueness checks from this file. Depends on T010, T020
- [ ] T023 [US3] Hand check quickstart section 4: a 16-character interface name errors next to the field; a duplicate node name errors; the collision pair from `testdata/validation/linux-name-collision-fail.json` (made in T033) shows the collision error at once; the same issue code then appears in the list. Depends on T021, T022, T033

**Checkpoint**: Name rules run on every edit and match the list.

---

## Phase 6: User Story 4 - Network rules are checked (Priority: P2)

**Goal**: Link, node-relationship, address, and route rules from `contracts/issue-codes.md`.

**Independent test**: quickstart.md section 5.

- [X] T024 [P] [US4] Create `src/store/validation/linkRules.ts` and append to `RULES`: `DANGLING_ENDPOINT` for a link whose `endpointA` or `endpointB` matches no interface; `LINK_SAME_INTERFACE` when both endpoints are the same id; `INTERFACE_IN_TWO_LINKS` once per interface used by more than one link (`relatedIds` = the link ids); `LINK_ENDPOINT_KIND` when an endpoint interface's node is missing or its `type` is not `namespace` or `bridge`, or when the link `kind` is not `veth`. Reuse `NODE_TYPE`
- [X] T025 [P] [US4] Create `src/store/validation/nodeRules.ts` and append to `RULES`: `INTERFACE_NODE_MISSING` when an interface's `nodeId` matches no node; `BRIDGE_HAS_NAMESPACE_FIELDS` when a bridge has `role`, `router`, `natRules`, or `routes`; `NAMESPACE_HAS_BRIDGE_FIELDS` when a namespace has `bridge`; `NAT_INTERFACE_NOT_ON_NODE` when a NAT rule `interfaceId` is not an interface whose `nodeId` is that node; `ROUTE_INTERFACE_MISSING` when a route `interfaceId` is set and is not an interface of that node. Reuse `NODE_TYPE`
- [X] T026 [P] [US4] Create `src/store/validation/addressRules.ts` with `INVALID_CIDR` (one issue per interface address failing `isCidr`) and `ROUTE_GATEWAY_UNREACHABLE`: for each route with a `gateway`, take the output interface's addresses (or, when `interfaceId` is not set, the addresses of every interface of the node) and report an error unless `cidrContains(address.cidr, gateway)` is true for at least one; routes without `gateway` are skipped; skip a route whose `interfaceId` does not exist (already `ROUTE_INTERFACE_MISSING`); the resource is the node. Append both rules to `RULES`. Depends on T003
- [X] T027 [US4] In `src/store/validation/addressRules.ts` add `DUPLICATE_IP_ON_SEGMENT` (warning): union-find over interface ids; union both endpoints of every link whose endpoints exist; union all interfaces of each bridge node together; then, for each segment, group the addresses with the prefix length stripped (compare the text before `/`, lowercase) and for every group of two or more report one issue per interface after the first, with `relatedIds` = the first interface. Different segments never match; link `state` is ignored; two addresses on the same node in one segment count. Append to `RULES`. Depends on T026

**Checkpoint**: each code in the contract fires on its own vector (see US5) and not on its clean twin.

---

## Phase 7: User Story 5 - One rule set, one set of shared test cases (Priority: P2)

**Goal**: Plain-data vectors and a script that checks them.

**Independent test**: quickstart.md section 1.

- [X] T028 [US5] Create `scripts/checkVectors.ts` in the style of `scripts/roundtrip.ts` (explicit `.ts` imports, `node:fs`): read every `*.json` in `../testdata/validation/` (path from the repo root, resolve relative to the script), run `validate(vector.document)`, compare the sorted `code` list to the sorted `expectedCodes`, print one line per file (`ok` or `FAIL` with expected and actual), and exit with code 1 if any file fails or any code in `ISSUE_CODE` has no `-fail` or no `-ok` file (FR-021). Also build in memory a generated lab of 200 resources (for example 70 namespaces, 10 bridges, 100 interfaces, 20 links, all valid), time one `validate` call, print the milliseconds, and exit 1 if it takes 1000 ms or more (SC-001) Depends on T005
- [X] T029 [P] [US5] Create `testdata/validation/` vectors per `contracts/vector-format.md` for the id and name rules: `duplicate-id-fail/ok`, `node-name-empty-fail/ok`, `duplicate-node-name-fail/ok`, `duplicate-interface-name-fail/ok`, `interface-name-length-fail/ok`, `interface-name-chars-fail/ok`, `interface-name-reserved-fail/ok`. Each has `description`, a full `document` (`schemaVersion` 1, lab id `a1b2`), and `expectedCodes`; a `-fail` file expects exactly the one code (add other codes only if the document cannot avoid them)
- [X] T030 [P] [US5] Create vectors for link rules: `dangling-endpoint-fail/ok`, `link-same-interface-fail/ok`, `interface-in-two-links-fail/ok`, `link-endpoint-kind-fail/ok`
- [X] T031 [P] [US5] Create vectors for node and address rules: `interface-node-missing-fail/ok`, `bridge-has-namespace-fields-fail/ok`, `namespace-has-bridge-fields-fail/ok`, `nat-interface-not-on-node-fail/ok`, `route-interface-missing-fail/ok`, `invalid-cidr-fail/ok`, `route-gateway-unreachable-fail/ok` (include one on-link route with no gateway in the ok file and one gateway-outside-prefix route in the fail file), `duplicate-ip-on-segment-fail/ok` (fail: two namespaces joined through a bridge with the same address; ok: same address in different segments), plus one combined `empty-lab-ok` and one `ipv6-and-ipv4-mixed-ok`
- [X] T032 [US5] Run `node web/scripts/checkVectors.ts`; fix any rule or vector mismatch until every file is `ok` and the exit code is 0. Depends on T009, T010, T024, T025, T026, T027, T028, T029, T030, T031, T033
- [X] T033 [P] [US5] Find two long node names with the same prefix and the same derived Linux name (same first characters and same 4-digit hash, per `linuxName`); a small throwaway script in the scratchpad that tries names like `long-name-0000…` until two hash to the same 4 digits is enough (about 300 tries expected). Create `testdata/validation/linux-name-collision-fail.json` (expects `LINUX_NAME_COLLISION`; the two names are different, so no `DUPLICATE_NODE_NAME`) and `linux-name-collision-ok.json` (two long names that do not collide). Depends on T004

**Checkpoint**: Script prints `ok` for every file and exits 0.

---

## Phase 8: Polish & Cross-Cutting

- [X] T034 Run `npm run lint`, `npm run format:check`, and `npm run build` in `web/`; fix every error (keep functions under 100 lines, no magic strings)
- [ ] T035 Run all of quickstart.md by hand (sections 1 to 6): in the running app for the UI sections, and with `checkVectors.ts` for the rules the UI cannot build (the app cannot load a saved lab yet), including the speed line (SC-001) and the 200 ms name check (SC-004); record any failure and fix it
- [X] T036 [P] Check for dead code: confirm the old inline name checks removed in T021 and T022 are gone, the `Toolbar` `validate` action has no disabled text left, and no unused constant remains in `src/constants/validation.ts`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → stories. T001 and T002 first; T005 needs both; T008 needs T005 and T007.
- **US1** (T009–T015) needs Phase 2; MVP is Phase 1 + 2 + US1.
- **US2** needs US1's panel (T013) and Phase 2 helpers.
- **US3** needs T010 (from US1) and T033 (vectors) for its check.
- **US4** needs T003 and the aggregator; independent of US2 and US3.
- **US5** needs rules from US1 and US4 to pass (T032); T028–T031 and T033 can start earlier.
- Polish last.

### Parallel opportunities

- Setup: T001, T002.
- Foundational: T003, T004, T006, T007 together, then T005, T008.
- US1: T009, T010, T012 together.
- US4: T024, T025, T026 together.
- US5: T029, T030, T031, T033 together.

## Implementation Strategy

1. **MVP**: Phases 1–2, then US1: a working Validate button and live list with id and name rules.
2. Add US2 (jump and highlights), then US3 (field wiring).
3. Add US4 (network rules) with its vectors.
4. Finish US5 (script passes for every file), then Polish.

## Phase 9: Convergence

- [ ] T037 Edit `web/src/components/nodes/NodeCard.tsx` so a node that is both selected and has an issue shows only one ring: the issue ring (`SEVERITY_RING`) wins over `ring-signal`, and the selection stays visible another way (for example a thicker border); two conflicting `ring-2` color classes are on the same element today and the winner depends on CSS order, per US2/AC4 and FR-018 (partial)
- [ ] T038 Edit `web/src/components/IssuesPanel.tsx` and `web/src/store/validationStore.ts` so the issue list cannot be open while hidden: when the Issues tab is not the active drawer tab (the user switched tab, or a persisted `issues` tab is restored after reload with the list closed), either close the list and drop the canvas highlights, or show a "Press Validate" prompt instead of a blank panel; highlights must never stay on with no visible list or Close button, per FR-016, FR-018 and US2/AC5 (partial)
- [ ] T039 Edit `web/src/store/ipAddress.ts`: replace the inline `0xffffn` in `v6Groups` with a named constant (for example `IPV6_GROUP_MASK`), per Constitution IV "No Magic Strings" (partial)
