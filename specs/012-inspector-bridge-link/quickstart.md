# Quickstart: Verify the Bridge, Link, and Lab Panels

No tests, per the constitution. Run the app (`web/`: `npm run dev`) with the browser console open.

## Build the example

1. Drop two namespaces (ns1, ns2) and one bridge (br0). Add an interface to each namespace. Link ns1 eth0 and ns2 eth0 to br0 through its "New port" handle.

## Bridge

1. Select br0. The Bridge form shows name, two ports, STP, and the VLAN note.
2. Each port row shows where it leads ("ns1 eth0", "ns2 eth0"). Add a port with "+ Add port": its row shows "Not linked".
3. Rename the bridge `core`: the canvas card shows `core`. Ctrl+Z restores `br0`.
4. Rename `port1` to `uplink`: the canvas card and the link label update.
5. STP is off and the priority field is disabled. Turn STP on, enter priority `4096`, press Enter: stored. Enter `70000` or `abc`: the error appears under the field while you type, with no delay, nothing is written, and the banner counts it. Escape restores the value.
6. The VLAN section shows only the note, with no inputs.
7. "Remove port" on a linked port removes the link; the namespace interface stays.

## Link

1. Click the edge between ns1 and br0. The Link form shows MTU, state, and both endpoints (node name as text, interface name editable).
2. Rename the ns1 end `eth1`: canvas card and link label show `eth1`. Undo restores it.
3. Set MTU `1400`: the label shows `MTU 1400`. Select ns1 and br0: both endpoint interfaces now show 1400. One Ctrl+Z reverts the link and both endpoints together.
4. MTU `50` or `abc`: error, nothing written.
5. Set state Down, then Up: stored each time.
6. A name another interface on the node uses, `a b`, `a/b`, `..`, or 16 characters: each shows its error.
7. Delete the selected link (Delete key): the panel returns to the nothing-selected view.

## Nothing selected

1. Click empty canvas. Lab name field and counts show (2 namespaces, 1 bridge, 5 interfaces, 2 links if you added a port).
2. Add a node, delete a link, undo: the counts follow each change without reselecting.
3. Empty lab name: error; lab keeps the old name.

## Edge checks

- Select another item with a bad draft open: draft and banner count are gone.
- A bridge with no ports shows an empty list and "+ Add port".
- Use every control once with the console open: no errors (no "Maximum update depth").
- `npm run build && npm run lint && npm run format:check` pass.
