# UI Contract: Palette and Node Operations

## Palette (left column, `<aside aria-label="Components">`)

Header strip "Components", then a search input, then a list of entries (`role="list"`).

| Entry | Creates | Icon shows |
|---|---|---|
| Namespace | namespace, no role | dashed box with a small network node inside |
| Host | namespace, role host | computer: monitor and keyboard |
| veth pair | nothing (disabled) | two plugs joined by a cable |
| Linux bridge | bridge | bar with ports hanging from it |
| Router | namespace, role router | router box with four arrows pointing out of its sides |
| NAT gateway | namespace, role nat | two boxes joined by a swap arrow through a gate |

Entry: icon tile, name, one-line description. Draggable except veth pair. Search input: `type="search"`, label "Search parts", filters name and description; empty result shows "No matching parts".

## Drag and drop

- Drag data MIME type: constant `PALETTE_DRAG_TYPE`, value is the entry id.
- Drop on canvas creates one node at the pointer position (canvas coordinates). Drop elsewhere creates nothing.
- Dragged ghost is the entry row itself (browser default drag image).

## Canvas interaction

| Action | Input |
|---|---|
| Select one | Click node |
| Add to selection | Shift-click |
| Box select | Left-drag on empty canvas |
| Clear selection | Click empty canvas |
| Pan | Middle or right mouse drag, scroll |
| Delete selected | Delete key |
| Duplicate selected | Ctrl+D |
| Undo | Ctrl+Z |
| Redo | Ctrl+Shift+Z or Ctrl+Y |
| Rename | Double-click the node name; Enter commits, Escape cancels |

Shortcuts do nothing while an input, textarea, or editable element has focus.

## Rename field

Input replaces the name text, same width as the card header. Invalid name: text under the field in `led-fault` color, the field keeps focus, the name is unchanged. Accessible name "Node name".

## Inspector

- None selected: existing hint.
- One selected: existing node view.
- Several selected: "N nodes selected" with hint "Press Delete to remove or Ctrl+D to duplicate."

## Node cards

Header shows the node's icon (same `NodeIcon` as the palette) and name. Bridge cards now show the bridge icon.
