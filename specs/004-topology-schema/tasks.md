---

description: "Task list for the Topology Schema"
---

# Tasks: Topology Schema

**Input**: Design documents from `/specs/004-topology-schema/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/topology-document.md, quickstart.md

**Tests**: None. The constitution says no tests are written. Each story is checked by hand with `quickstart.md`.

**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 to US3, matching the stories in `spec.md`

## Rules for every task

- Go types are the only hand-written definition of the fields. Never edit `docs/topology.schema.json` or `web/src/types/topology.ts` by hand; regenerate them with `make generate`.
- JSON field names are camelCase. "Req" fields in `data-model.md` have no `omitempty`; all other fields use `omitempty`.
- No magic strings: every enum value and the version number is a named constant. Keep functions short.
- No privileged code. No tests.

## Phase 1: Setup

- [X] T001 In `api/`, run `go get github.com/invopop/jsonschema@v0.14.0` (updates `api/go.mod` and `api/go.sum`)
- [X] T002 [P] In `web/`, run `npm install -D json-schema-to-typescript@16.0.0`
- [X] T003 [P] Create the folders `api/cmd/genschema`, `api/cmd/topocheck`, and `web/scripts`

---

## Phase 2: Foundational

**Purpose**: The named constants every story uses.

- [X] T004 Create `api/internal/topology/constants.go` with `CurrentVersion = 1` and typed string constants, each type declared as `type X string`: `NodeType` (`NodeTypeNamespace = "namespace"`, `NodeTypeBridge = "bridge"`), `Role` (`RoleHost = "host"`, `RoleRouter = "router"`, `RoleNAT = "nat"`), `State` (`StateUp = "up"`, `StateDown = "down"`), `LinkKind` (`LinkKindVeth = "veth"`), `NatKind` (`NatKindMasquerade = "masquerade"`, `NatKindDNAT = "dnat"`), `CaptureState` (`CaptureStateRunning = "running"`, `CaptureStateStopped = "stopped"`); give each type a method `JSONSchema() *jsonschema.Schema` returning a string schema whose `Enum` lists that type's constants (so the generated schema has enums without repeating the strings)

---

## Phase 3: User Story 1 - One saved format for a lab (Priority: P1) 🎯 MVP

**Goal**: A lab document round-trips on the server side and the browser side, ids are stable, canvas positions are stored apart, and a published schema describes every field.

**Independent Test**: Quickstart sections 1, 2, 4, and 6.

### Implementation for User Story 1

- [X] T005 [US1] Create `api/internal/topology/model.go` with the core types and JSON tags (camelCase; fields marked req in data-model.md have no `omitempty`, others do): `Document` (`SchemaVersion int` as `schemaVersion`, `Lab`, `Nodes []Node`, `Interfaces []Interface`, `Links []Link`, `Layout map[string]Position` omitempty), `Lab` (`ID`, `Name`, `Description` omitempty), `Node` (`ID`, `Name`, `Type NodeType`), `Interface` (`ID`, `NodeID` as `nodeId`, `Name`, `MTU int` as `mtu`, `State State`, `Addresses []Address` omitempty), `Link` (`ID`, `EndpointA` as `endpointA`, `EndpointB` as `endpointB`, `Kind LinkKind`, `MTU`, `State`), `Address` (`CIDR` as `cidr`), `Position` (`X`, `Y float64`)
- [X] T006 [US1] Create `api/internal/topology/document.go` with `Load(path string) (Document, error)` (read file, `json.Unmarshal`) and `Save(path string, doc Document) error` (`json.MarshalIndent` with two-space indent plus trailing newline, write file); unknown fields are ignored on read and dropped on save because the struct has no place for them
- [X] T007 [US1] Create `api/cmd/topocheck/main.go`: named constant `usage`; reads the file path from the first argument, calls `topology.Load`, prints the document as indented JSON to stdout, and on error prints it to stderr and exits 1
- [X] T008 [US1] Create `api/cmd/genschema/main.go`: use `jsonschema.Reflector{}` on `topology.Document`, write the JSON to the path given as the first argument (indented, trailing newline); named constants for the default output path `../docs/topology.schema.json`
- [X] T009 [US1] Add a `generate` target to the `Makefile` (add it to `.PHONY`): `cd api && go run ./cmd/genschema ../docs/topology.schema.json` then `cd web && npx json2ts -i ../docs/topology.schema.json -o src/types/topology.ts --additionalProperties false`
- [X] T010 [P] [US1] Set `"allowImportingTsExtensions": true` in `web/tsconfig.json`, then create `web/src/types/topologyDocument.ts` with `import type { Document } from "./topology.ts"`, and `export function parseDocument(text: string): Document` that returns `JSON.parse(text) as Document` (migration is wired in by US3)
- [X] T011 [P] [US1] Create `web/scripts/roundtrip.ts`: reads the file path from `process.argv[2]`, `parseDocument(fs.readFileSync(path, "utf8"))`, prints `JSON.stringify(doc, null, 2)`; imports use `.ts` extensions so it runs with `node --experimental-strip-types`
- [X] T012 [US1] Create `examples/bridge-lab.json` with `schemaVersion` 1, lab `{ "id": "lab-bridge", "name": "Bridge lab" }`, nodes `ns1` and `ns2` (type `namespace`) and `br0` (type `bridge`) each with a stable id (`node-ns1`, `node-ns2`, `node-br0`), interfaces `eth0` on each namespace with addresses `10.0.0.1/24` and `10.0.0.2/24`, two bridge port interfaces on `br0` (`port-ns1`, `port-ns2`), two links of kind `veth` (`ns1.eth0`↔`br0.port-ns1`, `ns2.eth0`↔`br0.port-ns2`) with `mtu` 1500 and `state` `up`, and a `layout` with x/y for each node
- [X] T013 [US1] Run `make generate`; confirm `docs/topology.schema.json` and `web/src/types/topology.ts` exist and a second `make generate` changes nothing (`git diff --stat`); run `make lint` and fix any issues (add generated files to `web/.prettierignore` and `web/eslint.config.js` ignores if they fail the format or lint check)
- [X] T014 [US1] Run quickstart sections 1, 2, 4, and 6 and fix the code until every check matches the expected output

**Checkpoint**: The core document round-trips on both sides.

---

## Phase 4: User Story 2 - Interfaces and links are separate, explicit objects (Priority: P1)

**Goal**: Namespace roles, router and NAT settings, routes, and bridge settings exist in the format, and the example shows roles and bridge ports.

**Independent Test**: Quickstart section 3.

### Implementation for User Story 2

- [X] T015 [P] [US2] Create `api/internal/topology/settings.go` with `RouterSettings` (`Forwarding bool` as `forwarding`, req), `NatRule` (`ID` req, `Kind NatKind` req, `InterfaceID` as `interfaceId` req, `Protocol string`, `Port int`, `ToAddress string` as `toAddress`, `ToPort int` as `toPort`; last four omitempty), `Route` (`Destination` req, `Gateway`, `InterfaceID` as `interfaceId`, `Metric int`; last three omitempty), `BridgeSettings` (`STP bool` as `stp` req, `STPPriority int` as `stpPriority` omitempty, `VLAN *VlanSettings` as `vlan` omitempty), `VlanSettings` (`Filtering bool` as `filtering` req, `DefaultVlanID int` as `defaultVlanId` omitempty)
- [X] T016 [P] [US2] Create `api/internal/topology/runtime.go` with `CaptureSession` (`ID`, `InterfaceID` as `interfaceId`, `Filter` omitempty, `MaxPackets int` as `maxPackets` omitempty, `MaxSeconds int` as `maxSeconds` omitempty, `State CaptureState`) and a one-line comment saying it is a runtime record and never part of `Document`
- [X] T017 [US2] In `api/internal/topology/model.go` extend `Node` with `Role Role` (`role`, omitempty, namespace only), `Router *RouterSettings` (`router`), `NatRules []NatRule` (`natRules`), `Routes []Route` (`routes`), `Bridge *BridgeSettings` (`bridge`) — all omitempty
- [X] T018 [US2] In `api/cmd/genschema/main.go` also add `CaptureSession` to the schema output as its own definition (not referenced from `Document`) so the published schema describes it per "It MUST also define the capture session shape, but the saved lab document MUST NOT contain capture sessions"
- [X] T019 [US2] Update `examples/bridge-lab.json`: set `"role": "host"` on `ns1` and `ns2`, add `"bridge": { "stp": false }` on `br0`
- [X] T020 [US2] Run `make generate` and confirm `docs/topology.schema.json` lists the roles `host`, `router`, `nat`, the node types, the states, and `CaptureSession` outside the `Document` tree; run quickstart section 3 and fix until it matches

**Checkpoint**: Roles, settings, and explicit ports are in the format, and the capture session stays runtime-only.

---

## Phase 5: User Story 3 - Old documents keep working as the format changes (Priority: P2)

**Goal**: A migration step accepts version 1, rejects unknown or missing versions with a clear message, and both sides use it on load.

**Independent Test**: Quickstart section 5.

### Implementation for User Story 3

- [X] T021 [US3] Create `api/internal/topology/migrate.go` with `Migrate(raw []byte) (Document, error)`: decode only `schemaVersion` first; missing (zero) returns the error `schemaVersion is missing`; a value other than `CurrentVersion` returns `fmt.Errorf("unsupported schemaVersion %d", version)`; otherwise decode the full `Document` and return it unchanged; define the two messages as named constants
- [X] T022 [US3] In `api/internal/topology/document.go` change `Load` to call `Migrate` on the file bytes instead of decoding directly
- [X] T023 [P] [US3] In `web/src/types/topologyDocument.ts` add `CURRENT_VERSION = 1` and `export function migrate(raw: unknown): Document` with the same rules and messages as the Go side (`schemaVersion is missing`, `unsupported schemaVersion N`) as named constants; change `parseDocument` to `migrate(JSON.parse(text))`
- [X] T024 [US3] Run quickstart section 5: both sides must refuse version 99 with `unsupported schemaVersion 99` and exit non-zero, `topocheck` must report `schemaVersion is missing` for a document without the field, and the example still round-trips (rerun quickstart section 2)

**Checkpoint**: The version handling works on both sides.

---

## Final Phase: Polish

- [X] T025 Run all six quickstart sections in order and report which passed; run `make lint` and `make build` and fix any failure
- [X] T026 [P] Remove temporary files created by the quickstart (`/tmp/orig.json`, `/tmp/go.json`, `/tmp/ts.json`, `/tmp/future.json`, `/tmp/noversion.json`) and confirm `git status` shows only intended files

---

## Dependencies & Execution Order

- Phase 1 first. T002 and T003 run together after T001 is started (different folders).
- T004 blocks everything in the user stories.
- US1 (T005 to T014): T005 first; T006 to T008 follow (T007 and T008 need T005, T006); T010 and T011 run together and in parallel with the Go tasks; T009 needs T008; T013 needs T009 and T012; T014 last.
- US2 needs US1. T015 and T016 run together; T017 needs T015; T018 needs T016; T019 to T020 last.
- US3 needs US1 (T021 first; T023 is independent of the Go side).
- Polish after all stories.

## Parallel Example

After T005: T006, T010, T011 in parallel. In US2: T015 and T016 together. In US3: T021 and T023 together.

## Implementation Strategy

- **MVP**: Phase 1, Phase 2, and User Story 1 (T001 to T014): a core document that round-trips on both sides with a generated schema and types.
- Then US2 (roles, settings, capture shape) and US3 (version handling), then Polish.

---

## Phase 6: Convergence

- [X] T027 In `api/internal/topology/migrate.go` after decoding, replace nil `Nodes`, `Interfaces`, and `Links` with empty slices (`[]Node{}`, `[]Interface{}`, `[]Link{}`) so a document without those lists saves as `[]` and not `null`; in `web/src/types/topologyDocument.ts` make `migrate` default missing `nodes`, `interfaces`, and `links` to `[]` the same way per Edge Cases: empty lab and FR-001 (partial)
- [X] T028 In `api/internal/topology/document.go` add an exported `Marshal(doc Document) ([]byte, error)` (indented JSON with trailing newline) and use it from `Save` and from `api/cmd/topocheck/main.go`; export the shared `JSONIndent` constant from the `topology` package and use it in `api/cmd/genschema/main.go` instead of its own copy per Constitution III (contradicts)
- [X] T029 [P] Delete `web/src/types/.gitkeep` (the folder now holds `topology.ts` and `topologyDocument.ts`) per plan: structure (unrequested)
