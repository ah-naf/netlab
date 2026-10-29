# Contract: Topology Document

The only interface of this feature is the document format and the helper functions around it.

## Files

| File | Role |
|---|---|
| `api/internal/topology/*.go` | The definition (hand-written). |
| `docs/topology.schema.json` | Published JSON Schema, generated from the Go types. |
| `web/src/types/topology.ts` | Generated TypeScript types. Do not edit. |
| `examples/bridge-lab.json` | Example lab: `ns1`, `ns2`, `br0`, two veth links, 10.0.0.1/24 and 10.0.0.2/24. |

## Go API (`internal/topology`)

```go
const CurrentVersion = 1

func Load(path string) (Document, error)   // read file, Migrate, decode
func Save(path string, doc Document) error // write indented JSON
func Migrate(raw []byte) (Document, error) // version 1 only; others rejected
```

Errors: missing version → `schemaVersion is missing`; unsupported → `unsupported schemaVersion N`.

## TypeScript API (`web/src/types/topologyDocument.ts`)

```ts
export function parseDocument(text: string): Document; // JSON.parse + migrate
export function migrate(raw: unknown): Document;       // same rules as Go
```

## Commands

| Command | Action |
|---|---|
| `make generate` | Regenerates `docs/topology.schema.json` and `web/src/types/topology.ts`. |
| `go run ./cmd/topocheck <file>` (in `api/`) | Loads a document and prints it back as JSON. |
| `node --experimental-strip-types web/scripts/roundtrip.ts <file>` | Parses a document and prints it back as JSON. |

## Compatibility rule

A change to the Go types needs `make generate`. A clean `git diff` after it means the schema and the TypeScript types match the Go types.
