# Data Model: Links Between Interface Handles

No schema change. Links, interfaces, and bridge nodes already exist.

## Types (`types/links.ts`)

| Type | Shape | Notes |
|---|---|---|
| `LinkEnd` | `{ nodeId, interfaceId? }` | `interfaceId` is absent for the bridge new-port handle. |
| `ConnectionCheck` | `{ ok: true } or { ok: false, reason }` | `reason` is one of the `LINK_REASON` texts. |

## Rules (`checkConnection`)

Evaluated in order; first failure wins.

| # | Condition | Result |
|---|---|---|
| 1 | Both ends are the same node | reject `SELF_LINK` |
| 2 | Either end names an interface already in a link | reject `ALREADY_LINKED` |
| 3 | A namespace end uses the new-port handle (only bridges have it) | reject `UNSUPPORTED` |
| 4 | Node pair is namespace-namespace, namespace-bridge, or bridge-bridge | allow |
| 5 | Anything else | reject `UNSUPPORTED` |

## Operations (`documentOps`)

| Function | Effect |
|---|---|
| `createLink(document, from, to)` | Adds a bridge port for each end without an interface (name from `nextFreeName`, `port` from 1, default MTU and state), then adds a link: `kind: veth`, `endpointA`, `endpointB`, default MTU, state up, id prefix `link-`. |
| `removeLink(document, linkId)` | Removes the link and every endpoint interface owned by a bridge. Namespace interfaces stay. Route or NAT references to removed ports are cleaned as in `removeInterfaces`. |

## Store additions (`topologyStore`)

| Field or action | Notes |
|---|---|
| `selectedLinkId` | `string or null`. Setting a node selection clears it; selecting a link clears node selection. Not part of history. |
| `connect(from, to)` | Runs `checkConnection`; on ok, one history step with `createLink`; returns the check. |
| `deleteSelected()` | Existing; now also removes a selected link via `removeLink`. |
| `setLinkSelection(id)` | Selection only. |

## Defaults

Link MTU and port MTU: `DEFAULT_INTERFACE_MTU` (1500). State: `DEFAULT_INTERFACE_STATE` (up). Reuse existing constants.
