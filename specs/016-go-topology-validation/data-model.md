# Data Model: Backend Lab Validation

> **Trimmed by spec 017.** The shared vector files, `vectorcheck`, the existing-name option (`NAME_CONFLICT_EXISTING`, `Options`), `UNSUPPORTED_NODE_TYPE`, `INTERFACE_NAME_RESERVED`, `NAMESPACE_HAS_BRIDGE_FIELDS`, and the byte counting described below were removed. Names are ASCII only and `NODE_NAME_CHARS` was added. See `specs/017-remove-unused-features/contracts/issue-codes.md`. The text below is the record of what spec 016 first built.

No change to the lab document model. New types only, all in `api/internal/topology`.

## Issue (JSON-shaped like the editor's)
| Field | Type | Notes |
|---|---|---|
| severity | `error` or `warning` | Fixed per code |
| code | `Code` (string) | Values equal the shared contract |
| resourceId | string | Node, interface, or link id; the node id for route and NAT issues |
| resourceName | string | Display name; falls back to the id |
| message | string | Human text from a constant table; not part of cross-side agreement |
| relatedIds | []string | Other resources; empty slice, never null in JSON |

JSON names: `severity`, `code`, `resourceId`, `resourceName`, `message`, `relatedIds`.

## Code
The 20 shared codes plus `UNSUPPORTED_NODE_TYPE` (error) and `NAME_CONFLICT_EXISTING` (error). Order for sorting: the contract's table order, then the two new codes.

## Options
| Field | Type | Notes |
|---|---|---|
| ExistingNames | []ExistingName | Lab-owned names already on the machine; nil or empty skips the check |

## ExistingName
| Field | Type | Notes |
|---|---|---|
| Name | string | A Linux name |
| LabID | string | Owner lab id; empty is treated as foreign |

## Derived Linux name
`LinuxName(labID, name) string`: base `nl-` + the longest whole-character prefix of the lab id that fits in 4 bytes + `-` (at most 8 bytes); if the byte length of `base + name` is at most 15, `base + name`; else `base` + the longest whole-character prefix of `name` that fits in `15 - len(base) - 5` bytes + `-` + 4 hex digits of the low 16 bits of FNV-1a 32 over the UTF-8 bytes of `name`. Always at most 15 bytes.

## Backend vector file
`{ "description": string, "document": Document, "expectedCodes": []string, "existingNames": [{ "name": string, "labId": string }]? }`.

## State and flow
`Validate(doc, opts)`: run rules in fixed order, collect, sort, return. Pure: same input, same output, input untouched.
