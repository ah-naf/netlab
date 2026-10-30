# Quickstart: Verify Links

No tests, per the constitution. Run the app (`web/`: `npm run dev`) and check by hand.

## Build the example

1. Drag Namespace twice (ns1, ns2) and Linux bridge once (br0). In each namespace press "Add interface" once (eth0).
2. Drag from ns1 eth0 to br0 "New port". Expect a link, a new br0 port1, label `eth0 ↔ port1 · MTU 1500`.
3. Drag from ns2 eth0 to br0 "New port". Expect port2 and a second link.
4. Compare with `examples/bridge-lab.json`: two namespaces, one bridge with two ports, two veth links. Ids, positions, addresses may differ.

## Each combination

| Try | Expect |
|---|---|
| ns1 eth0 to ns2 eth0 (both free) | green, link, no new interface |
| ns to bridge port (free port) | green, link |
| bridge new-port to other bridge new-port | green, two new ports, one link |
| bridge port to bridge port, different bridges | green, link |
| any handle to a handle on the same node | red, notice "A node cannot link to itself." |
| a linked interface to anything | red, notice "That interface is already in a link." |
| release on empty canvas | nothing, no notice |
| release on a rejected handle | no link, no interface, no port created |

## Other checks

- Second link between the same two nodes with other interfaces works.
- Click an edge: it is selected. Delete removes it and its bridge port; the namespace interface and its address remain.
- Undo after create removes link and port together; redo restores both.
- Rename an interface: the label updates.
- Save and reload the document (when available): links load and match.
- `docs/links.md` states the allowed pairs and that bridge-to-bridge is a veth between two bridge ports.
