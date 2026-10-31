# Implementation Plan: Backend Lab Validation

**Branch**: `016-go-topology-validation` (directory name; work stays on the current git branch) | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/016-go-topology-validation/spec.md`

## Summary

Add `topology.Validate(doc, opts) []Issue` to `api/internal/topology`: the Go twin of the editor's validator. It implements the same 20 rules with the same code strings from `specs/013-frontend-validator/contracts/issue-codes.md`, plus two backend-only codes (`UNSUPPORTED_NODE_TYPE`, `NAME_CONFLICT_EXISTING`). The rules are small functions in one file per topic, like the editor's `store/validation/`. Names are derived with the same FNV-1a rule. A new command, `api/cmd/vectorcheck`, runs every file in `testdata/validation/` (shared with the editor) and `testdata/validation/backend/` (backend only) and exits non-zero on any mismatch; this is the hand-run stand-in for `go test`, per the constitution. Planning found one real disagreement between the two sides: the editor counts name length in UTF-16 units while Linux limits names in bytes, so the plan also aligns the editor's name rules to UTF-8 bytes and adds shared vectors for non-ASCII names. The API refusal shape is documented here; the endpoint itself arrives with NL-037. Backend only plus two small editor files; no new dependencies; no test files.

## Technical Context

**Language/Version**: Go 1.26 (standard library only: `net/netip`, `hash/fnv`, `encoding/json`, `sort`, `strings`, `unicode/utf8`); TypeScript 6 for the editor alignment

**Primary Dependencies**: None new. Reuses `topology.Document`, `Migrate`, and the model types

**Storage**: None. The existing-names set is passed in by the caller

**Testing**: None, per the constitution. `go run ./cmd/vectorcheck` (hand run) plus the editor's `node web/scripts/checkVectors.ts`

**Target Platform**: Linux server (the API); no privileges; pure functions

**Project Type**: Web application (Go side, plus two editor files)

**Performance Goals**: 200 resources in under 1 s (SC-004); every rule is linear or near-linear, duplicate-address uses a union-find

**Constraints**: No magic strings (codes, messages, limits are constants); functions under 100 lines; no input mutation; deterministic order; no map iteration order leaking into results; identical code strings to the editor

**Scale/Scope**: about 10 new Go files in `internal/topology`, 1 command, about 12 new vector files, 2 edited editor files, 1 Makefile target, 1 contract edit

## Constitution Check

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Backend work in Go; the editor change stays in TypeScript. |
| II. Simple, concise code | Pass. Standard library only; `net/netip` replaces hand parsing. ponytail skill applies at implementation. |
| III. Small, reusable functions | Pass. One small function per rule; shared helpers (`issueFor`, `LinuxName`). |
| IV. No magic strings | Pass. Issue codes are typed constants; limits and the `nl-` prefix are constants shared with `LinuxName`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. `api/{cmd,internal/topology}`; examples under `testdata/`. |
| VII. Sandboxed privileged execution | Pass. No privileged code; pure functions; the command needs no privileges. |

Tests: none, by constitution; the vector command and the editor's script are the hand checks ([quickstart.md](quickstart.md)). Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/016-go-topology-validation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── issue-codes-additions.md
│   ├── backend-vector-format.md
│   └── refusal-response.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
api/
├── cmd/vectorcheck/main.go          # new: run all vectors, coverage check, exit code
└── internal/topology/
    ├── issue.go                     # Issue, Severity, Code constants, severity map, message map, HasErrors
    ├── options.go                   # Options { ExistingNames []string }
    ├── linuxname.go                 # LinuxName(labID, name), fnv1a
    ├── validate.go                  # Validate: run rules, sort errors first
    ├── id_rules.go                  # DUPLICATE_ID
    ├── name_rules.go                # node and interface names, LINUX_NAME_COLLISION
    ├── link_rules.go                # dangling, same interface, two links, endpoint kind
    ├── node_rules.go                # interface node missing, bridge/namespace fields, NAT and route refs
    ├── address_rules.go             # INVALID_CIDR, ROUTE_GATEWAY_UNREACHABLE, DUPLICATE_IP_ON_SEGMENT
    └── backend_rules.go             # UNSUPPORTED_NODE_TYPE, NAME_CONFLICT_EXISTING

testdata/validation/                 # shared, read by both checks (existing 46 files + new non-ASCII ones)
testdata/validation/backend/         # new: backend-only vectors (with existingNames)

web/src/store/validation/linuxName.ts   # edit: bytes, whole characters
web/src/store/validation/nameRules.ts   # edit: interface length in UTF-8 bytes
specs/013-frontend-validator/contracts/issue-codes.md   # edit: two backend-only codes, byte rule
Makefile                              # new target: check-vectors
```

**Structure Decision**: Mirrors the editor: one rule file per topic, one aggregator, one derivation file. The command lives beside the other small commands (`topocheck`, `genschema`). No new package.
