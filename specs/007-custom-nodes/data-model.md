# Data Model: Custom Nodes and Interface Handles

The lab document shape is the existing schema (`web/src/types/topology.ts`). This feature adds no schema fields.

## Store state (`topologyStore`)

| Field | Type | Notes |
|---|---|---|
| `document` | `Document` | Canonical lab. Starts as the bridge example. |
| `selectedNodeId` | `string \| null` | UI selection, not part of the document. |

## Store actions

| Action | Effect |
|---|---|
| `loadDocument(doc)` | Replace the document; clear selection. |
| `addInterface(nodeId)` | Append an `Interface` (new id, default name, `mtu` 1500, `state` up, no addresses). Returns the new id. |
| `removeInterface(interfaceId)` | Remove the interface, every link using it, and route/NAT references to it on its node. |
| `setNodePosition(nodeId, position)` | Write `document.layout[nodeId]`. |
| `selectNode(nodeId \| null)` | Set selection. |

## Rules

- Interface id: `if-` + random UUID; never reused in a document.
- Interface name: unique per node; default is prefix plus smallest free number (`eth`+0.. for namespaces, `port`+1.. for bridges).
- After `removeInterface`, no link has an endpoint equal to that id.
- Only `layout` changes on drag.

## Derived (not stored)

| Item | From | Fields |
|---|---|---|
| Flow node | `document.nodes` + `layout` | `id`, `type` (`namespace` or `bridge`), `position`, `data: { status }`. Missing layout position falls back to `{0,0}`. |
| Flow edge | `document.links` | `id`, `source` and `target` node ids (via interface `nodeId`), `sourceHandle = endpointA`, `targetHandle = endpointB`. Skipped when either interface is missing. |
| Handle | each `Interface` | `id = interface.id`. |

## Node status

`NodeStatus` = `desired` | `deployed` | `failed` | `drifted`. Passed as `data.status`; always `desired` for now.
