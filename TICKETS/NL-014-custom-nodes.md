# NL-014: Custom nodes and interface handles

- Milestone: 1
- Depends on: NL-011, NL-013
- Size: M

## Scope
- React Flow custom node types: `NamespaceNode` (shows name, role icon, list of interfaces with IPs), `BridgeNode` (shows name, ports).
- Each interface renders its own handle with a stable handle id equal to the interface id. A node is not an interface.
- Add/remove interface on a node from the node itself or the inspector.
- Visual status styles for desired, deployed, failed, drifted (driven by a `status` prop that is `desired` for now).
- Zustand store `topologyStore` holds the canonical document; React Flow nodes/edges are derived from it.

## Acceptance
- Load `examples/bridge-lab.json` into the store and the canvas shows 3 nodes with correct handles.
- Test: adding an interface to a namespace creates a new handle and a store entry with a unique id.
