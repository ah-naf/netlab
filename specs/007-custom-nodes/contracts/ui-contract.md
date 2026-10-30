# UI Contract: Custom Nodes

## Node types

| Key | Draws | Header | Rows |
|---|---|---|---|
| `namespace` | one per namespace node | role icon + name | one per interface: name, addresses |
| `bridge` | one per bridge node | name | one per port: name |

Every card has a status tag (text + glyph), an "Add interface" / "Add port" button, and per-row "Remove" buttons. Buttons and rows are marked `nodrag` so clicking does not start a drag.

## Handles

- One `Handle` per interface row, `id` equal to the interface id, on the card's right edge, vertically centered on its row.
- Accessible name: `<node name> <interface name>`.
- The node has no handle of its own.

## Status styles

| Status | Border | Cue |
|---|---|---|
| desired | dashed, `rule` | "Desired" |
| deployed | solid, `led-ok` | check, "Deployed" |
| failed | solid, `led-fault` | cross, "Failed" |
| drifted | dotted, `led-warn` | warning, "Drifted" |

## Inspector section (right column)

Nothing selected: hint text. Node selected: node name, type, interface list with Remove, and Add button. Same actions as the card.

## Store actions used by the UI

`addInterface`, `removeInterface`, `setNodePosition`, `selectNode`, `loadDocument`. See [data-model.md](../data-model.md).
