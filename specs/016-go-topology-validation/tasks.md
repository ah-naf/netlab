---

description: "Task list for Backend Lab Validation"
---

# Tasks: Backend Lab Validation

> **Trimmed by spec 017.** The shared vector files, `vectorcheck`, the existing-name option (`NAME_CONFLICT_EXISTING`, `Options`), `UNSUPPORTED_NODE_TYPE`, `INTERFACE_NAME_RESERVED`, `NAMESPACE_HAS_BRIDGE_FIELDS`, and the byte counting described below were removed. Names are ASCII only and `NODE_NAME_CHARS` was added. See `specs/017-remove-unused-features/contracts/issue-codes.md`. The text below is the record of what spec 016 first built.

**Input**: Design documents from `/specs/016-go-topology-validation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/issue-codes-additions.md, contracts/backend-vector-format.md, contracts/refusal-response.md, and the shared contract `specs/013-frontend-validator/contracts/issue-codes.md`

**Tests**: None. The constitution says no tests are written, so there are no `_test.go` files. Acceptance is by hand: `make check-vectors`, `node web/scripts/checkVectors.ts`, and the steps in quickstart.md.

**Code rules** (constitution): shortest clear Go, standard library only, no magic strings (issue codes, messages, limits, the `nl-` prefix, field names are named constants), functions under 100 lines, minimal comments, files in the folder that matches their job. Run `gofmt` and `go vet` clean. Use the ponytail skill for coding. Do not commit unless the user asks.

**Purity rule**: everything in `api/internal/topology` added here is a pure function: it never changes its input, never touches the file system, network, or clock, needs no privileges, and never lets map iteration order decide the output (sort or use slices). Rules must not panic on nil slices or missing references.

**Agreement rule**: the 20 shared code strings and their meanings are fixed by `specs/013-frontend-validator/contracts/issue-codes.md`; do not rename or reinterpret any. Known differences (leading-zero IPv4 and U+0085 / U+FEFF whitespace) are listed in `contracts/issue-codes-additions.md`: never put those inputs in a shared vector, golden name, or backend vector.

## Format: `[ID] [P?] [Story] Description`

All paths are from the repository root.

## Phase 1: Setup

**Purpose**: The shared vocabulary every later task uses.

- [X] T001 [P] Create `api/internal/topology/issue.go`: `type Severity string` with `SeverityError = "error"`, `SeverityWarning = "warning"`; `type Code string` with one constant per code whose value equals its name: the 20 shared codes in the contract's table order (`DUPLICATE_ID`, `NODE_NAME_EMPTY`, `DUPLICATE_NODE_NAME`, `DUPLICATE_INTERFACE_NAME`, `INTERFACE_NAME_LENGTH`, `INTERFACE_NAME_CHARS`, `INTERFACE_NAME_RESERVED`, `LINUX_NAME_COLLISION`, `INVALID_CIDR`, `INTERFACE_NODE_MISSING`, `DANGLING_ENDPOINT`, `LINK_SAME_INTERFACE`, `INTERFACE_IN_TWO_LINKS`, `LINK_ENDPOINT_KIND`, `BRIDGE_HAS_NAMESPACE_FIELDS`, `NAMESPACE_HAS_BRIDGE_FIELDS`, `NAT_INTERFACE_NOT_ON_NODE`, `ROUTE_INTERFACE_MISSING`, `ROUTE_GATEWAY_UNREACHABLE`, `DUPLICATE_IP_ON_SEGMENT`) followed by `UNSUPPORTED_NODE_TYPE` and `NAME_CONFLICT_EXISTING`; a `codeOrder` slice of all 22 in that order; a `severityOf` map (only `DUPLICATE_IP_ON_SEGMENT` is a warning); a `messageOf` map with one plain-text message per code; `type Issue struct { Severity Severity \`json:"severity"\`; Code Code \`json:"code"\`; ResourceID string \`json:"resourceId"\`; ResourceName string \`json:"resourceName"\`; Message string \`json:"message"\`; RelatedIDs []string \`json:"relatedIds"\` }` (RelatedIDs is never nil: an empty slice marshals as `[]`); a helper `newIssue(code Code, id, name string, related ...string) Issue` that fills severity and message and falls back to the id when the name is empty; and `HasErrors(issues []Issue) bool`
- [X] T002 [P] Create `api/internal/topology/options.go`: `type ExistingName struct { Name string \`json:"name"\`; LabID string \`json:"labId"\` }` and `type Options struct { ExistingNames []ExistingName }` ("Lab-owned names already on the machine; nil or empty skips the check")
- [X] T003 [P] Create `api/internal/topology/linuxname.go`: constants `linuxNamePrefix = "nl-"`, `linuxNameLabIDBytes = 4`, `linuxNameMax = 15`, `linuxNameHashDigits = 4`, `linuxNameSeparator = "-"`; `fnv1a32(name string) uint32` using `hash/fnv` `New32a` over the name's UTF-8 bytes; `LinuxName(labID, name string) string`: `base = "nl-" + idPart + "-"` where `idPart` is the longest whole-character (rune) prefix of `labID` whose byte length is at most 4 (constant `linuxNameLabIDBytes = 4`), so `len(base)` is at most 8 and `15 - len(base) - 5` is never negative; if `len(base) + len(name)` (bytes) is at most 15 return `base + name`; otherwise keep the longest prefix of whole characters (runes) of `name` whose byte length fits in `15 - len(base) - 5` (hash digits plus the separator), then `"-"` and `fmt.Sprintf("%04x", fnv1a32(name) & 0xffff)`, and return `base + kept + "-" + hash` ("Always at most 15 bytes"); also export `LabPrefix(labID string) string` returning `base`
- [X] T004 [P] Edit `specs/013-frontend-validator/contracts/issue-codes.md`: add the two backend-only rows `UNSUPPORTED_NODE_TYPE` and `NAME_CONFLICT_EXISTING` exactly as in `specs/016-go-topology-validation/contracts/issue-codes-additions.md` (marked "backend only"), and replace the Linux-name derivation and `INTERFACE_NAME_LENGTH` text with the byte rule from that file (all lengths in UTF-8 bytes, whole-character slicing, the lab id part cut to at most 4 bytes on whole characters, ASCII unchanged)

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: The aggregator and the hand-run check command, so every story can be verified as it lands.

**CRITICAL**: No story starts before this phase is done.

- [X] T005 Create `api/internal/topology/validate.go`: `type rule func(doc Document, opts Options) []Issue`; a `rules` slice (empty for now, later tasks append); `Validate(doc Document, opts Options) []Issue` that runs each rule through a `runRule` wrapper using `defer recover()` so a panicking rule returns nothing instead of crashing ("Never crash"), concatenates the results, sorts them stably by (errors before warnings, index in `codeOrder`, then `ResourceID` in byte order) and returns a non-nil slice (empty when clean); it MUST NOT change `doc`. Depends on T001, T002
- [X] T006 Create `api/cmd/vectorcheck/main.go` (same style as `cmd/topocheck`: `run() error`, usage constant `usage: vectorcheck <vectors folder>`, exit 1 on failure): decode each `*.json` in the folder given as the argument as `{ description, document (topology.Document), expectedCodes []string, existingNames []topology.ExistingName }`, run `topology.Validate(doc, Options{ExistingNames})` for the top-level files with no existing names and for `backend/*.json` with their `existingNames`, compare the sorted multiset of codes with `expectedCodes`, and print one line per file (`ok    <name>` or `FAIL  <name>: expected [...] got [...]`); then the coverage check: every one of the 20 shared codes has a top-level file starting with `<code lowercase, _ replaced by ->-fail` and one with `-ok`, and each of the 2 backend codes has both in `backend/`; print `MISSING vector <name>` for each gap; then time one `Validate` on a generated 200-resource lab (70 nodes, 100 interfaces, 30 links, all valid) and print `speed: <ms> ms`; exit 1 on any FAIL, MISSING, issue in the generated lab, or a time of 1000 ms or more. Depends on T005
- [X] T007 [P] Edit `Makefile`: add `check-vectors` to `.PHONY` and a target `check-vectors:` running `cd api && go run ./cmd/vectorcheck ../testdata/validation`. Depends on T006

**Checkpoint**: `make check-vectors` runs and reports every current vector `FAIL` (no rules yet) and the coverage `MISSING` list for the backend codes; `go build ./...` passes.

---

## Phase 3: User Story 1 - A bad lab is refused before anything is changed (Priority: P1)

**Goal**: `Validate` returns every problem, with all the shared rules implemented.

**Independent test**: quickstart.md steps 1 and 3.

- [X] T008 [P] [US1] Create `api/internal/topology/id_rules.go`: rule `idRules` returning `DUPLICATE_ID` for each later node, interface, or link whose `ID` was already seen in its own list (resource name: node name, interface name, link id)
- [X] T009 [P] [US1] Create `api/internal/topology/name_rules.go` with rule `nameRules` (the `LINUX_NAME_COLLISION` check is added in T020): for each node, `NODE_NAME_EMPTY` when `strings.TrimSpace(name)` is empty, else `DUPLICATE_NODE_NAME` when an earlier node has the same trimmed name (related id: the earlier node); for each interface, `INTERFACE_NAME_LENGTH` when the name is not "1 to 15 bytes" (`len(name)`), `INTERFACE_NAME_CHARS` when it contains `/` or any character for which `unicode.IsSpace` is true, `INTERFACE_NAME_RESERVED` when it is `.` or `..`, and `DUPLICATE_INTERFACE_NAME` when an earlier interface of the same node has the same name (related id: the earlier interface); one issue per code, never one per character; compare with earlier resources only (the later one is reported), and a node with an empty name never also raises a duplicate
- [X] T010 [P] [US1] Create `api/internal/topology/link_rules.go`: rule `linkRules`: `DANGLING_ENDPOINT` when `EndpointA` or `EndpointB` matches no interface; `LINK_SAME_INTERFACE` when both ends are the same id; `LINK_ENDPOINT_KIND` when an existing end's node is missing or its type is not `namespace` or `bridge`, or when `Kind` is not `veth`; `INTERFACE_IN_TWO_LINKS` once per interface used by more than one link, counting a link at most once per interface (related ids: the link ids, in document order); resource for link issues is the link id with the link id as its name
- [X] T011 [P] [US1] Create `api/internal/topology/node_rules.go`: rule `nodeRules`: `INTERFACE_NODE_MISSING` when an interface's `NodeID` matches no node; for each node: `BRIDGE_HAS_NAMESPACE_FIELDS` when a bridge has a non-empty `Role`, a non-nil `Router`, a non-empty `NatRules`, or non-empty `Routes`; `NAMESPACE_HAS_BRIDGE_FIELDS` when a namespace has a non-nil `Bridge`; `NAT_INTERFACE_NOT_ON_NODE` when any NAT rule's `InterfaceID` is not an interface whose `NodeID` is that node; `ROUTE_INTERFACE_MISSING` when a route's non-empty `InterfaceID` is not an interface of that node; at most one issue per code per node
- [X] T012 [P] [US1] Create `api/internal/topology/address_rules.go` with `net/netip`: rule `addressRules`: `INVALID_CIDR` once per interface address that `netip.ParsePrefix` rejects; `ROUTE_GATEWAY_UNREACHABLE` once per node having a route with a non-empty `Gateway` whose output interface exists on the node (or, when `InterfaceID` is empty, any interface of the node) and no address of the considered interfaces satisfies `prefix.Masked().Contains(gateway)` (an unparsable gateway counts as unreachable; a route whose `InterfaceID` is not on the node is skipped because `ROUTE_INTERFACE_MISSING` covers it; routes without a gateway are never checked); `DUPLICATE_IP_ON_SEGMENT` (warning) with a union-find over interface ids: unite both ends of every link whose ends both exist, unite all interfaces of each bridge node, group valid parsed addresses (`netip.Addr`, prefix length ignored, no unmapping) by segment, count each interface once per address, and report every interface after the first in a group (related id: the first interface); IPv4 and IPv6 never match each other
- [X] T013 [US1] Edit `api/internal/topology/validate.go` to put `idRules`, `nameRules`, `linkRules`, `nodeRules`, `addressRules` in the `rules` slice; run `make check-vectors` and fix any shared vector that does not match (the four non-ASCII vectors and the backend ones come in later phases). Depends on T008, T009, T010, T011, T012
- [X] T014 [P] [US1] Create `testdata/validation/many-problems-fail.json` (shared; the editor reads it too): one lab with at least 10 different problems at once, for example a duplicate node name, an empty node name, a duplicate interface name on one node, an interface name with a slash, a name of 16 characters, a dangling link end, an interface in two links, a link of kind `tunnel`, a bridge with a role, and an unreachable route gateway; `expectedCodes` lists every code the editor and the backend return for it (build the list by running `node web/scripts/checkVectors.ts` logic by hand or by reading both outputs, and confirm both sides give the same multiset) ("returns all 10 in one result")

**Checkpoint**: the 46 original shared vectors plus `many-problems-fail.json` all print `ok` from `make check-vectors`.

---

## Phase 4: User Story 2 - The backend and the frontend always agree (Priority: P1)

**Goal**: Same codes on both sides, including non-ASCII names.

**Independent test**: quickstart.md steps 1 and 2.

- [ ] T015 [US2] Edit `web/src/store/validation/linuxName.ts` to match the byte rule: lengths in UTF-8 bytes (`new TextEncoder().encode(...).length`); the lab id part of the base is the longest whole-character prefix of the lab id that fits in 4 bytes (iterate `for (const ch of labId)` adding `encode(ch).length` while the total stays at most 4) instead of `labId.slice(0, 4)`; the room for the kept name `MAX - base.length - HASH_DIGITS - SEPARATOR.length` is then never negative; when shortening keep the longest prefix of whole characters (iterate `for (const ch of name)` and add `encode(ch).length`) that fits in `MAX - base.length - HASH_DIGITS - SEPARATOR.length` bytes; FNV-1a already runs over UTF-8 bytes; ASCII results must not change. Depends on T004
- [ ] T016 [US2] Edit `web/src/store/validation/nameRules.ts` so `INTERFACE_NAME_LENGTH` fires when the byte length of the name (`new TextEncoder().encode(name).length`) is 0 or over `INTERFACE_NAME_MAX`; keep `INTERFACE_NAME_MAX = 15`. Depends on T015
- [ ] T017 [P] [US2] Create the four shared non-ASCII vectors in `testdata/validation/` (format as in `contracts/backend-vector-format.md`, shared section): `interface-name-length-fail-bytes.json` (an interface named `éééééééé`, 16 bytes, expects `INTERFACE_NAME_LENGTH`), `interface-name-length-ok-bytes.json` (`ééééééé`, 14 bytes, expects none), `linux-name-collision-fail-nonascii.json` (two long non-ASCII node names that shorten to the same Linux name; find the pair with a small throwaway script in the scratchpad that implements the byte rule and tries names like `ñandú-0001`, `ñandú-0002`, … until two derive the same name) and `linux-name-collision-ok-nonascii.json` (two long non-ASCII names that do not collide). Depends on T003
- [ ] T018 [US2] Run `node web/scripts/checkVectors.ts` and `make check-vectors`; both must print `ok` for every shared vector and exit 0. Fix any difference in the Go or the editor rule (never change a vector's expected codes to hide a mismatch). Depends on T013, T014, T016, T017

**Checkpoint**: every top-level vector gives the same codes on both sides.

---

## Phase 5: User Story 3 - Deploy-time names are safe and never clash (Priority: P1)

**Goal**: The collision rule and a derivation that is provably identical on both sides.

**Independent test**: quickstart.md steps 1 and 2 for the collision vectors; the golden names file for the derivation.

- [ ] T019 [P] [US3] Create `testdata/linux-names.json` (outside `testdata/validation/`, so the vector loops never read it): a list of `{ "labId": string, "name": string, "derived": string }` entries covering: a short ASCII name, a name of exactly the longest length that still fits, a 16-character ASCII name, a long ASCII name, a name with a space, an empty lab id, a lab id longer than 4 characters, a lab id of multi-byte characters (`éééé`, which gives the id part `éé`), a lab id with an astral character (for example `😀ab`, which fits 4 bytes as just `😀`), `éééééééé`, a long name made of 3-byte characters (for example `日本語のネットワーク名前`), and a name that ends exactly where a multi-byte character would be cut; compute each `derived` with a throwaway Python script in the scratchpad that implements the byte rule independently of both code bases (FNV-1a 32, low 16 bits, `%04x`) so it is a third implementation, not a copy
- [ ] T020 [US3] In `api/internal/topology/name_rules.go` add to `nameRules` (or a second rule `linuxNameRules` appended in `validate.go`) the check `LINUX_NAME_COLLISION`: for each later node whose trimmed name is not empty, not a duplicate of an earlier name, and whose `LinuxName(doc.Lab.ID, trimmedName)` equals the derived name of an earlier node, report the later node with the earlier node's id in `RelatedIDs`; one issue per cause (never both a duplicate and a collision for the same pair). Depends on T003, T009
- [ ] T021 [US3] Extend `api/cmd/vectorcheck/main.go` to read `testdata/linux-names.json` (the argument folder's parent plus `linux-names.json`) and check `topology.LinuxName(labId, name) == derived` for every entry and that every `derived` is at most 15 bytes; print one line per entry (`ok` or `FAIL`); exit 1 on any difference. Depends on T019, T020
- [ ] T022 [US3] Extend `web/scripts/checkVectors.ts` the same way: read `../../testdata/linux-names.json`, call the editor's `linuxName(labId, name)` from `../src/store/validation/linuxName.ts` and compare with `derived`; print one line per entry; add failures to the exit code. Depends on T015, T019

**Checkpoint**: both checks print `ok` for every golden name, and the collision vectors (ASCII and non-ASCII) pass on both sides.

---

## Phase 6: User Story 4 - Backend-only checks (Priority: P2)

**Goal**: Unsupported node types and conflicts with existing names.

**Independent test**: quickstart.md step 4.

- [ ] T023 [US4] Create `api/internal/topology/backend_rules.go`: rule `backendRules`: `UNSUPPORTED_NODE_TYPE` for each node whose `Type` is not `NodeTypeNamespace` or `NodeTypeBridge`; `NAME_CONFLICT_EXISTING` for each node with a non-empty trimmed name whose `LinuxName(doc.Lab.ID, name)` equals an `Options.ExistingNames` entry's `Name` where the name starts with `linuxNamePrefix` ("names without the `nl-` prefix are ignored") and the entry's `LabID` is not `doc.Lab.ID` (an empty entry `LabID` counts as foreign; an entry owned by this lab is never a conflict; nil or empty `ExistingNames` skips the check); the message names the conflicting existing name. Append `backendRules` to `rules` in `validate.go`. Depends on T005, T003
- [ ] T024 [P] [US4] Create the backend vectors in `testdata/validation/backend/` (format in `contracts/backend-vector-format.md`): `unsupported-node-type-fail.json` (a node of type `router`), `unsupported-node-type-ok.json`, `name-conflict-existing-fail.json` (lab id `a1b2-one`, node `ns1`, an existing entry `nl-a1b2-ns1` owned by `a1b2-two`), `name-conflict-existing-ok.json` (no existing names for a lab with the same node), `name-conflict-existing-ok-own-lab.json` (the existing entry is owned by `a1b2-one`), `name-conflict-existing-ok-no-prefix.json` (existing name `ns1` without `nl-`), and `name-conflict-existing-ok-empty-set.json` (`existingNames` empty); every file has `description`, a full `document`, `expectedCodes`, and where needed `existingNames`. Depends on T023 for the expected behavior
- [ ] T025 [US4] Run `make check-vectors`; every backend vector prints `ok` and the coverage check lists no `MISSING` backend code. Depends on T023, T024

**Checkpoint**: unsupported types and foreign existing names are refused; own-lab, unowned, and empty-set cases are not.

---

## Phase 7: User Story 5 - Run the check without a test framework (Priority: P2)

**Goal**: One command proves everything and fails loudly when something is wrong.

**Independent test**: quickstart.md step 1 and the break-it checks below.

- [ ] T026 [US5] Prove the command fails correctly: copy `testdata/` to a scratch folder (`cp -r testdata <scratchpad>/testdata-broken`), change one `expectedCodes` in a copy of a vector, run `cd api && go run ./cmd/vectorcheck <scratchpad>/testdata-broken/validation` and confirm one `FAIL` line and exit code 1; delete one `-ok` file in the copy and confirm a `MISSING vector` line and exit 1; confirm the real folder is untouched and still exits 0. Depends on T025
- [ ] T027 [US5] Confirm the command needs no privileges and changes nothing: run it as the normal user (not in the sandbox); `grep -rn "os/exec\|syscall\|netlink\|os.WriteFile\|os.Create" api/cmd/vectorcheck api/internal/topology/*.go` shows none of them in the new files; running it twice leaves `git status` unchanged. Depends on T025

**Checkpoint**: the command is the single hand check and behaves as FR-012 states.

---

## Phase 8: Polish & Cross-Cutting

- [ ] T028 Run `make lint` and `make build`; fix `gofmt`, `go vet`, `eslint`, `prettier`, and type errors (functions under 100 lines, no magic strings, no unused constants in `issue.go`)
- [ ] T029 [P] Edit `README.md`: add a row to the Checks table for `make check-vectors` ("Backend validator vectors", command `make check-vectors` from the repository root, pass looks like: every line `ok`, a `speed:` line, exit 0) and keep the rest unchanged
- [ ] T030 Determinism and agreement: run `make check-vectors` twice and `node web/scripts/checkVectors.ts` once; the two Go runs print identical output apart from the `speed:` milliseconds; both sides exit 0 (SC-001, SC-002, SC-005)
- [ ] T031 Run all of quickstart.md by hand (steps 1 to 6) and record any failure and fix it. Depends on T030

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → stories. T005 needs T001 and T002; T006 needs T005.
- **US1** (T008–T014) needs Phase 2; the five rule files T008–T012 are independent and parallel.
- **US2** needs US1's rules (T013) and T004; T015 and T016 are editor edits and can run in parallel with US1 once T004 is done.
- **US3** needs T003 and T009; T019 (golden file) is independent.
- **US4** needs T005 and T003; independent of US2 and US3.
- **US5** verification needs everything it checks (T025).
- Polish last.

### Parallel opportunities

- Setup: T001, T002, T003, T004.
- US1: T008, T009, T010, T011, T012, T014.
- US2: T015 with T017.
- US3: T019 with T020.
- US4: T024 with T023 (T024's expected results depend on T023's behavior, so confirm after).
- Polish: T029.

## Implementation Strategy

1. **MVP**: Setup, Foundational, then US1: `Validate` returns every shared rule's issues and `make check-vectors` shows the shared vectors passing.
2. Add US2 (editor alignment and non-ASCII vectors) and US3 (collision and golden names) so both sides provably agree.
3. Add US4 (backend-only codes) and US5 (prove the command).
4. Finish with Polish: lint, build, README row, determinism, and the full quickstart.
