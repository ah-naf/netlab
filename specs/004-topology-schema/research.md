# Research: Topology Schema

No open unknowns. Versions were read on 2026-10-29 (`go list -m -versions`, `npm view`).

## Single source of truth

- **Decision**: Go structs are the source. `github.com/invopop/jsonschema` (v0.14.0) generates `docs/topology.schema.json` from them. `json-schema-to-typescript` (16.0.0, frontend dev dependency) generates `web/src/types/topology.ts` from the schema.
- **Rationale**: The server validates and deploys, so its model must be exact. One hand-written definition means the field names cannot drift (SC-003), and the schema file is a free by-product (SC-005). Two small generator dependencies replace a hand-kept TypeScript copy and a contract test.
- **Alternatives considered**: Hand-written JSON Schema as the source (then Go and TS both generated, more tooling); TypeScript as the source with Go generated (weaker fit, the server owns the truth); hand-written copies on both sides plus a test (tests are not allowed, and copies drift).

## Fixed document shape

- **Decision**: Document fields use camelCase JSON names. Optional parts use `omitempty`, so empty routes, VLAN, and layout do not appear. The generator marks only the required fields as required.
- **Rationale**: Matches the spec: missing optional parts are valid and empty. Unknown fields are ignored on read (standard `encoding/json` behavior) and are dropped on save because the struct has no place for them.

## Enums as constants

- **Decision**: Enum values live in `constants.go` as typed string constants (`NodeTypeNamespace = "namespace"`, and so on). Fields use the typed values, and the schema generator lists them as `enum` through a small `JSONSchema` hook or struct tags.
- **Rationale**: Satisfies constitution IV on the Go side and gives TypeScript string-literal unions through generation.
- **Alternatives considered**: Plain strings validated later (magic strings).

## Layout stored apart

- **Decision**: `layout` is a map from node id to `{x, y}`.
- **Rationale**: Moving a node changes only the layout, never ids or network data (SC-002).

## Version and migration

- **Decision**: `schemaVersion` is an integer. Current version is a named constant (`CurrentVersion = 1`). `Migrate(raw)` returns the document unchanged for version 1 and returns an error naming the version for anything else, including a missing version. The TypeScript `migrate` mirrors it.
- **Rationale**: Only version 1 exists. The step is a skeleton that future versions extend with a version-to-version chain.

## Round-trip comparison

- **Decision**: Normalize both outputs with `python3 -m json.tool --sort-keys` and compare with `diff`. (`jq` is not installed here.)
- **Rationale**: Key order differs between serializers, so compare sorted. No new tool needed.

## Runtime TypeScript check

- **Decision**: `web/scripts/roundtrip.ts` runs with `node --experimental-strip-types` (Node 22).
- **Rationale**: No extra runner dependency. The script only parses, migrates, and prints.

## Capture session

- **Decision**: `CaptureSession` is defined in `runtime.go` and is not a field of `Document`, so it is absent from the schema's document tree. It still has a JSON shape for the API (later features).
- **Rationale**: Clarification 2026-10-29: runtime record only.
