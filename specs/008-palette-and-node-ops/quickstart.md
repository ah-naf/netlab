# Quickstart: Palette and Node Operations (manual checks)

Prerequisite: `cd web && npm install`. No tests exist (constitution), so all checks are by hand.

```bash
cd web && npm run dev      # open the printed URL
npm run build && npm run lint && npm run format:check
```

Tip: to inspect the document, temporarily add `window.topologyStore = useTopologyStore` in `web/src/main.tsx` (do not commit it) and run `topologyStore.getState().document` in the browser console. Check that ids are unique and every link endpoint exists.

## Checks

1. **Palette (US1, FR-001)**: Left column lists Namespace, Host, veth pair, Linux bridge, Router, NAT gateway, each with an icon, name, and description. Icons read without the label.
2. **Drag each (US1, SC-001)**: Drag Namespace, Host, Router, NAT gateway, Linux bridge onto the canvas. Each node appears under the drop point with the matching icon and role. Names are unique (`ns1`.. skipped if taken, `r1`, `nat1`, `br1` because `br0` exists).
3. **Drop outside (US1)**: Release a drag over the toolbar: nothing is created.
4. **Unique names (SC-002)**: Create 30 nodes in a row: all names and ids unique.
5. **Search (US2, SC-005)**: Type "bridge": only Linux bridge (and any whose text matches). "NAT": NAT gateway. "zzz": "No matching parts". Clear: all six. Uppercase works.
6. **veth pair (US6)**: Entry is dim with a dark dot. Hover: "Not available yet". Dragging it creates nothing.
7. **Select (US3)**: Click one node; shift-click another; drag a box over several; click empty canvas to clear. Inspector shows "N nodes selected" for several.
8. **Delete (US3, SC-003)**: Select ns1 and br0, press Delete: both nodes, their interfaces, and links go; ns2 stays and has no dangling link. In the field, press Delete or Backspace while typing: no node is deleted.
9. **Rename (US3)**: Double-click a name, type "web", Enter: card shows "web". Escape cancels. Empty name or another node's name: message shown, old name stays.
10. **Duplicate (US4)**: Select ns1 and br0, Ctrl+D: two offset copies, selected, linked to each other, not linked to ns2, new names and ids, interfaces copied with same names and addresses. Select only ns1, Ctrl+D: the copy has no links. Nothing selected: nothing happens.
11. **Undo and redo (US5, SC-006)**: Delete a node, Ctrl+Z: it returns with its links and ids. Ctrl+Shift+Z (and Ctrl+Y): gone again. Drag a node, Ctrl+Z: one step back to the old place. New change after undo: redo no longer works. Ctrl+Z while typing in the search box: the field's own undo, not the lab.
12. **Many (SC-007)**: With about 20 nodes selected, Delete and Ctrl+D respond with no lag.
13. **Themes**: Light and dark: icons, tiles, text, and disabled entry readable.
14. **Keyboard**: Tab reaches the search box and entries (visible focus); rename and shortcuts work without a mouse.

Contracts: [ui-contract.md](contracts/ui-contract.md), [design-direction.md](contracts/design-direction.md). State: [data-model.md](data-model.md).
