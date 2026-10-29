# NL-015: Palette, drag and drop, node operations

- Milestone: 1
- Depends on: NL-014
- Size: M

## Scope
- Palette with Namespace, Host, veth pair, Linux bridge, Router, NAT gateway, each with icon and description, plus search filter.
- Drag from palette to canvas creates a node with a unique default name (`ns1`, `ns2`, `br0`). Host and Router create namespaces with the matching role. Dropping "veth pair" enters link-creation mode (see NL-016) and does not create a node.
- Select, multi-select (box and shift-click), delete (Delete key, also removes attached links and interfaces), duplicate (Ctrl+D, new ids and names, links between duplicated nodes preserved, links to outside nodes dropped), rename inline.
- Undo/redo of document changes (history in the store).

## Acceptance
- Vitest: create, duplicate, delete flows produce valid documents (ids unique, no dangling link endpoints).
- Manual: drag each palette item onto the canvas.
