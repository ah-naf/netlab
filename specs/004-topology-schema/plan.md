# Implementation Plan: Topology Schema

**Branch**: `004-topology-schema` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-topology-schema/spec.md`

## Summary

Define the lab document once, in Go, and generate everything else from it. Go structs in `api/internal/topology` are the single source of truth. A small generator writes `docs/topology.schema.json` from them, and a second step writes the TypeScript types in `web/src/types/topology.ts` from that schema. Add load, save, and migrate functions on both sides, an example document `examples/bridge-lab.json`, and manual check commands. No validation rules across objects (NL-019, NL-030) and no tests (constitution).

## Technical Context

**Language/Version**: Go 1.26 (source of truth, generator, load/save/migrate); TypeScript 6 on Node 22 (generated types, load/migrate)

**Primary Dependencies**: Go: `github.com/invopop/jsonschema` v0.14.0 (generator only). Frontend dev dependency: `json-schema-to-typescript` 16.0.0. Everything else is the standard library.

**Storage**: JSON files (`examples/bridge-lab.json`, saved labs). No database in this feature.

**Testing**: None, per the constitution. Verified by manual commands (see [quickstart.md](quickstart.md)).

**Target Platform**: Linux dev machine; browser for the TypeScript side

**Project Type**: Web application (shared data format between `api/` and `web/`)

**Performance Goals**: Loading and saving a 500-node document in under 100 ms (no fixed limit on counts, per the spec).

**Constraints**: Unknown fields are ignored on read and dropped on save. No cross-object validation here. No magic strings: every enum value is a named constant on the Go side and a generated union type on the TypeScript side.

**Scale/Scope**: About 12 Go types, 1 schema file, 1 generated TypeScript file, 1 example, 1 generator command, 1 check command.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Go owns the model, TypeScript is generated. |
| II. Simple, concise code | Pass. Plain structs with JSON tags. One generator, no hand-written duplicates. |
| III. Small, reusable functions | Pass. `Load`, `Save`, `Migrate` are each short. Types are split across a few small files. |
| IV. No magic strings | Pass. Enum values (`namespace`, `bridge`, `host`, `veth`, `up`, and so on) and the current version number are named Go constants. The schema generator emits them as enums. |
| V. Readable names, minimal comments | Pass. Field names are plain. Comments only on enum constants and on why unknown fields are dropped. |
| VI. Proper folder structure | Pass. Go in `api/internal/topology/`, generated types in `web/src/types/`, schema in `docs/`, example in `examples/`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |
| No tests | Pass. None written. |

Post-design re-check: no change. No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/004-topology-schema/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── topology-document.md
└── tasks.md             # created later by /speckit-tasks
```

### Source Code (repository root)

```text
api/
├── cmd/
│   ├── genschema/main.go      # writes docs/topology.schema.json from the Go types
│   └── topocheck/main.go      # loads a document and prints it back (manual round-trip check)
└── internal/topology/
    ├── doc.go                 # exists
    ├── constants.go           # enum values and current version
    ├── model.go               # Document, Lab, Node, Interface, Link, Address, Route, ...
    ├── runtime.go             # CaptureSession (runtime only, not in Document)
    ├── document.go            # Load, Save
    └── migrate.go             # Migrate
web/
├── scripts/roundtrip.ts       # manual round-trip check (run with node)
└── src/types/
    ├── topology.ts            # GENERATED, do not edit
    └── topologyDocument.ts    # parseDocument, migrate (hand-written)
docs/
└── topology.schema.json       # GENERATED
examples/
└── bridge-lab.json
Makefile                       # adds `generate`
```

**Structure Decision**: Go types are the only hand-written definition of the fields. `make generate` regenerates the schema and the TypeScript types, and a clean `git diff` afterwards proves they agree (SC-003).

## Complexity Tracking

No constitution violations to justify.
