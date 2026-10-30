# Data Model: Properties Panel for Namespaces

No schema change. All edits use existing `Node`, `Interface`, `Address`, `Route`, and `Lab` fields.

## Field rules (`store/fieldRules.ts`)

Each returns an error text, or `null` when valid. Texts and limits are constants.

| Field | Valid when | Error key |
|---|---|---|
| Node name | trimmed, not empty, not used by another node | `EMPTY`, `TAKEN` (existing `validateNodeName`) |
| Lab name | trimmed, not empty | `EMPTY` |
| Interface name | 1 to 15 chars, no `/`, no whitespace, not `.` or `..`, unique on its node | `NAME_EMPTY`, `NAME_LONG`, `NAME_CHARS`, `NAME_DOT`, `NAME_TAKEN` |
| MTU | whole number, 68 to 65535 | `MTU_RANGE` |
| Address | valid IPv4 or IPv6 CIDR, not already on that interface | `CIDR_INVALID`, `ADDRESS_DUPLICATE` |
| Gateway | empty, or valid IPv4 or IPv6 address (no prefix) | `GATEWAY_INVALID` |
| Route destination | valid CIDR | `CIDR_INVALID` |
| Route metric | empty, or whole number 0 or more | `METRIC_INVALID` |
| Route (as a whole) | destination valid, and gateway or output interface present | `ROUTE_NEXT_HOP` |

## Document operations (`store/namespaceOps.ts`)

All pure: take a `Document`, return a new `Document`.

| Function | Effect |
|---|---|
| `setRole(document, nodeId, role)` | Sets `role` to host or router. |
| `renameInterface(document, interfaceId, name)` | Sets the trimmed name. |
| `setInterfaceMtu(document, interfaceId, mtu)` | Sets `mtu`. |
| `setInterfaceState(document, interfaceId, state)` | Sets `state` to up or down. |
| `addAddress(document, interfaceId, cidr)` | Appends `{ cidr }`. |
| `removeAddress(document, interfaceId, cidr)` | Removes that one address. |
| `setDefaultGateway(document, nodeId, gateway)` | Sets, replaces, or removes the default route of the gateway's family. |
| `addRoute(document, nodeId, route)` | Appends a route. |
| `updateRoute(document, nodeId, index, route)` | Replaces the route at that index of the node's static routes. |
| `removeRoute(document, nodeId, index)` | Removes that route. |
| `renameLab(document, name)` | Sets `lab.name`. |

Static routes shown in the table are `node.routes` without default routes; the index is into that filtered list, mapped back to the full list by the op.

## Store additions

| Item | Notes |
|---|---|
| `edit(fn)` on `topologyStore` | One history step; no-op results are skipped. |
| `fieldErrorStore` | `errors: Set<string>`; `setError(key, on)`; `hasFieldErrors`. Not in history. |

## UI state (not in the lab)

| State | Where | Notes |
|---|---|---|
| Field draft and error text | `useFieldDraft` | Reset when the stored value changes or the field unmounts. |
| New route draft row | `RoutesTable` | Fields not yet stored; discarded on selection change. |

## Constants (`constants/inspector.ts`)

`MTU_MIN = 68`, `MTU_MAX = 65535`, `INTERFACE_NAME_MAX = 15`, `DEFAULT_DESTINATION = { IPV4: "0.0.0.0/0", IPV6: "::/0" }`, `OBSERVED_TEXT = "Not deployed"`, `ROLE_CHOICES` (Host, Router), `STATE_CHOICES` (up, down), field labels, and all error texts.
