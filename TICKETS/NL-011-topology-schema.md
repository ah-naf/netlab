# NL-011: Topology schema (TypeScript and Go)

- Milestone: 1
- Depends on: NL-000, NL-010
- Size: M

## Goal
One canonical, versioned JSON schema shared by frontend and backend. Stable ids are independent of Linux names and canvas positions.

## Scope
Entities: `Lab`, `Node` (type `namespace` or `bridge`, plus `role` host/router/nat for namespaces), `Interface` (id, nodeId, name, mtu, state, addresses[]), `Link` (id, endpointA interfaceId, endpointB interfaceId, kind veth, mtu, state), `Address` (cidr), `Route` (dst, via, dev interfaceId, metric), `BridgeConfig` (stp, ports derived from links, optional vlan), `RouterSettings` (forwarding), `NatRule`, `CaptureSession`.
- Document wrapper: `{ schemaVersion, lab: {...}, nodes, interfaces, links, layout }`. `layout` holds React Flow positions separately from the network model.
- Bridge ports are explicit interface entries on the bridge node.
- Go structs with JSON tags, TS types and a JSON Schema file `docs/topology.schema.json` generated from one source (pick Go as source and generate TS types, or write both and test they agree).
- `migrate(doc)` function skeleton: v1 to current, with a test that rejects unknown future versions.
- Golden example `examples/bridge-lab.json` (ns1, ns2, br0, two veth links, 10.0.0.1/24 and 10.0.0.2/24).

## Acceptance
- Go test loads `examples/bridge-lab.json`, round-trips it, and compares bytes after normalization.
- TS test loads the same file and round-trips it.
- A contract test fails if the TS and Go types disagree on field names.
