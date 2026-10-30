# Data Model: Palette, Drag and Drop, and Node Operations

The lab document shape is the existing schema; this feature adds no schema fields.

## Palette entry (constant data)

| Field | Notes |
|---|---|
| `id` | `namespace`, `host`, `veth`, `bridge`, `router`, `nat` |
| `label` | Namespace, Host, veth pair, Linux bridge, Router, NAT gateway |
| `description` | One line, plain words |
| `icon` | Key of the matching `NodeIcon` |
| `create` | `{ type: "namespace", role? }`, `{ type: "bridge" }`, or `null` (veth) |
| `available` | `false` only for veth pair |

## Store state additions (`topologyStore`)

| Field | Type | Notes |
|---|---|---|
| `selectedNodeIds` | `string[]` | Replaces `selectedNodeId`. Not part of history. |
| `past` | `Document[]` | Older documents, newest last, at most 100. |
| `future` | `Document[]` | Undone documents, cleared by any new change. |

## Store actions

| Action | Effect |
|---|---|
| `createNode(entryId, position)` | New node (and no interfaces) from the entry. One commit. Selects it. |
| `deleteSelected()` | `deleteNodes` on the selection. One commit. Clears selection. |
| `duplicateSelected()` | `duplicateNodes` on the selection. One commit. Selects the copies. |
| `renameNode(nodeId, name)` | Returns an error text or null. One commit on success. |
| `addInterface`, `removeInterface` | Existing; now go through `commit`. |
| `beginDrag()`, `moveNode(id, pos)`, `endDrag()` | Drag batching; one commit per drag if the layout changed. |
| `undo()`, `redo()` | Swap documents between `past` and `future`. No-op when empty. |
| `setSelection(ids)` | Selection only. |
| `loadDocument(doc)` | Replace document; clear selection, `past`, and `future`. |

## Rules

- Node name: not empty after trimming, not equal to another node's name (case-sensitive). Default name = prefix plus smallest free number: `ns` from 1 (Namespace, Host), `r` from 1, `nat` from 1, `br` from 0.
- Ids: `node-`, `if-`, `link-` plus a random UUID; never reused.
- New node position = drop point in canvas coordinates. Copy position = original plus a fixed offset (constant).
- A node created from the palette has no interfaces; a bridge has `bridge.stp` false.
- After `deleteNodes`: no interface of a deleted node, no link on such an interface, no route or NAT reference to such an interface.
- After `duplicateNodes`: every copied link has both endpoints among the copied interfaces; no link points to an original interface from a copy.
- History holds at most 100 documents; the oldest is dropped first.
