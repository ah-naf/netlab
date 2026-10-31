# Data Model: Lab Validator

No change to the lab document format. New types only.

## Issue
| Field | Type | Notes |
|---|---|---|
| severity | `error` or `warning` | From the code's fixed severity |
| code | `IssueCode` | One constant per rule; see [contracts/issue-codes.md](contracts/issue-codes.md) |
| resourceId | string | Id of the node, interface, or link; for a route, the node id |
| resourceName | string | Display name (node name, interface name, link label); falls back to the id |
| message | string | Plain text from the message table |
| relatedIds | string[] | Other resources involved (second interface, second link); may be empty |

Order: errors before warnings; within a severity, by code order in the contract, then by resource id. Same document gives the same list.

## IssueTarget
Derived from an Issue and the document: `{ nodeIds: string[]; linkId: string | null }`. Interface, address, route, and NAT issues map to the owning node; link issues map to the link; relatedIds add their targets for highlighting. Missing resources give an empty target (no jump).

## Validation UI state
`{ open: boolean }`. Not stored in the document or in local storage.

## Shared example (vector)
See [contracts/vector-format.md](contracts/vector-format.md).

## Layer-2 segment (internal)
Set of interface ids joined by links, plus all interfaces of one bridge node. Used only inside the duplicate-address rule.
