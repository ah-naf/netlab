# Quickstart: Custom Nodes (manual checks)

Prerequisite: `cd web && npm install`. No tests exist (constitution), so all checks are by hand.

```bash
cd web && npm run dev      # open the printed URL
npm run build && npm run lint && npm run format:check
```

## Checks

1. **Example loads (US1, SC-001)**: On first load the canvas shows 3 cards: ns1, ns2, br0 at the saved positions, 2 links drawn. ns1 and ns2 list `eth0` with `10.0.0.1/24` and `10.0.0.2/24`; br0 lists `port1`, `port2`. React Flow devtools or the DOM show 4 handles whose `data-handleid` match `if-ns1-eth0`, `if-ns2-eth0`, `if-br0-port1`, `if-br0-port2`.
2. **Add on card (US2, SC-002)**: Click "Add interface" on ns1: a row `eth1` and a handle appear. In the browser console, `useTopologyStore.getState().document.interfaces` has a new entry with a new id (expose the store on `window` only in dev if needed).
3. **Add on inspector (US2)**: Select br0; inspector lists its ports; add one: `port3` appears on the card and in the inspector.
4. **Unique ids (SC-003)**: Add 20 interfaces across nodes; all ids unique.
5. **Remove with link (US2, SC-004)**: Remove `eth0` on ns1: row, handle, and the ns1–br0 link disappear; the document has 1 link left.
6. **Remove without link (US2)**: Remove the new `eth1`: only that row goes.
7. **Re-add (edge)**: Remove `eth1`, add again: name `eth1` is reused, id is a new one.
8. **Drag (US3, SC-005)**: Drag a node; document `layout[nodeId]` updates; links follow handles.
9. **Status (US4, SC-006)**: All cards show Desired. Temporarily pass each status to a card: four distinct looks in light and dark (devtools `prefers-color-scheme`).
10. **Edge cases (FR-013)**: Load a document with a namespace without interfaces, an empty document, and a link to a missing interface: no crash, dangling link not drawn.
11. **Many interfaces (edge)**: Add 12 interfaces to one node: handles stay aligned to rows, no overlap. Long name: text cut off with hover title.
12. **Keyboard (FR-012)**: Tab to Add and Remove buttons and use them with Enter/Space.
13. **Perf (SC-007)**: With about 20 nodes of 5 interfaces, drag stays smooth.

Contracts: [ui-contract.md](contracts/ui-contract.md). State: [data-model.md](data-model.md).
