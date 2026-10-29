# NL-016: Links between interface handles

- Milestone: 1
- Depends on: NL-014
- Size: M

## Scope
- Creating a connection between two handles creates a `Link` with two interface endpoints. Connection rules: an interface can be in at most one link; no self-links; namespace-to-namespace is a veth with both ends inside namespaces; namespace-to-bridge is a veth with the namespace end inside the namespace and the host end as a bridge port; bridge-to-bridge is allowed only through a veth pair (document it); reject everything else with a visible reason.
- `isValidConnection` shows green/red feedback while dragging.
- Edge labels show the two interface names and MTU. Edge selection opens the link inspector (NL-018).
- When creating a link to a bridge, auto-create the bridge port interface on the bridge side.

## Acceptance
- Vitest tests for each allowed and rejected combination.
- Manual: build ns1, ns2, br0 and connect them as in the example; the result matches `examples/bridge-lab.json` structurally.
