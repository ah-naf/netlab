# Research: Custom Nodes and Interface Handles

## R1. Canonical document and derived canvas

- **Decision**: `topologyStore` (Zustand) holds the `Document` and the selected node id. A pure `toFlow(document)` returns React Flow nodes and edges; `Canvas` computes it with `useMemo` on the document. Node `data` carries only ids and the status, never copies of names or addresses; cards read the rest from the store by id.
- **Rationale**: One source of truth (FR-008, SC-005). Derived output cannot drift from the document.
- **Alternatives**: React Flow's own node state as source (rejected: second copy of lab data); persisting in the store with `persist` (rejected: save/load is NL-020).

## R2. One handle per interface

- **Decision**: Each `InterfaceRow` renders one `Handle` with `id = interface.id`, placed on the card's right edge, aligned to its row. Connection mode is loose so one handle type serves both link ends later.
- **Rationale**: Matches the ticket and the schema: links reference interface ids (`endpointA`, `endpointB`). Row-aligned handles stay aligned with many interfaces (edge case).
- **Alternatives**: Separate source/target handles per interface (rejected: doubles handles, no benefit for undirected veth links); handles on the node (rejected: node is not an interface).
- **Note**: React Flow must be told when handle positions change. Adding or removing a row calls `useUpdateNodeInternals` for that node.

## R3. Edges from links

- **Decision**: `toFlow` makes one edge per link with `sourceHandle = endpointA`, `targetHandle = endpointB`, and the source/target node found from the interface's `nodeId`. A link whose interface is missing is skipped (FR-013). Edges are read-only in this feature.
- **Rationale**: Shows the example's two links so handles are visibly used; creating links is NL-016.

## R4. Remove cascades to links

- **Decision**: `removeInterface(id)` filters the interface and every link with `endpointA` or `endpointB` equal to `id` in one `set`. It also clears any `natRules` or `routes` entry on its node that names that interface id.
- **Rationale**: SC-004 (no dangling links). Schema allows `interfaceId` in routes and NAT rules; leaving them would create dangling references.
- **Alternatives**: Block removal while linked (rejected: spec says cascade).

## R5. Unique ids and names

- **Decision**: Interface id = `if-` + `crypto.randomUUID()`. Default name = prefix (`eth` for namespace, `port` for bridge) + the smallest non-negative number not used on that node (`eth0`, `eth1`, ...; ports start at 1).
- **Rationale**: UUIDs never repeat, so ids are never reused after removal (edge case, SC-003). Name rule matches the spec assumption.
- **Alternatives**: Counter in the store (rejected: needs persisting to stay unique across reloads); name-based ids like the example (rejected: collide after a remove and re-add of the same name).

## R6. Layout writes

- **Decision**: On React Flow position changes, `setNodePosition(id, {x, y})` writes `document.layout[id]`. Only position changes are handled; selection and dimension changes are ignored.
- **Rationale**: FR-009; the network model is untouched.

## R7. Loading the example

- **Decision**: `main.tsx` imports `examples/bridge-lab.json` and calls `loadDocument(migrate(json))` before render. `vite.config.ts` gets `server.fs.allow` for the repo root so dev can serve a file outside `web/`. Production build inlines the JSON.
- **Rationale**: Clarified answer: load at app start. `migrate` already exists and normalizes missing arrays.
- **Alternatives**: Copy the file into `web/public` (rejected: two copies of the golden example).

## R8. Status styling

- **Decision**: `NODE_STATUS` constant (`desired`, `deployed`, `failed`, `drifted`). Each maps to a label, a glyph, and a border/tint token. Desired: dashed `rule` border, "Desired" tag. Deployed: solid `led-ok` border, check glyph. Failed: solid `led-fault` border, cross glyph. Drifted: `led-warn` border with dash pattern, warning glyph. Existing `led-*` tokens already have light and dark values.
- **Rationale**: Distinct by shape, text and color (FR-010, SC-006); no new color values needed.

## R9. Inspector scope

- **Decision**: `NodeInspector` fills the right column: shows the selected node's name, type, and an interface list with add and remove, or a hint when nothing is selected. It reuses the store actions the cards use.
- **Rationale**: Ticket says "from the node itself or the inspector". Full per-type inspectors are NL-017/018.

## R10. Icons

- **Decision**: Three tiny inline SVG components (host: monitor, router: crossed arrows, NAT: swap) in `RoleIcon.tsx`, chosen through a constant map from role.
- **Rationale**: No icon dependency in the project; constitution prefers none new.
