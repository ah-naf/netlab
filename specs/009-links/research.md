# Research: Links Between Interface Handles

## Finding: handles are per interface, not per node

Decision: keep the existing model. Every interface row already renders a handle whose id is the interface id. Namespace ends connect existing free interfaces. Only bridge ports are auto-created.
Rationale: avoids a second connection model; matches the ticket ("auto-create the bridge port on the bridge side"). The spec was updated to match.
Alternatives: node-level handle on every node that creates interfaces on demand (rejected: duplicates the add-interface control and silently creates namespace interfaces holding addresses).

## How a bridge end is auto-created

Decision: each bridge renders one extra handle with the constant id `NEW_PORT_HANDLE_ID`. Using it as an endpoint means "make a port". `createLink` creates the port and the link in one document change.
Rationale: no new library feature; works in both drag directions with loose connection mode.
Alternatives: drop on the bridge body and detect the node (rejected: the library only reports handle hits for validity feedback, so green/red would not show).

## Green/red feedback

Decision: `isValidConnection` calls `checkConnection`. The library marks handles under the pointer with `valid` or `invalid` classes while connecting; style them in `index.css` with existing theme tokens.
Rationale: library-native, no custom hit testing.

## Rejection message

Decision: `onConnectEnd` receives the final connection state. When a target handle was hit and `isValid` is false, show `reason` from `checkConnection` in `LinkNotice`, auto-dismiss after a constant timeout. Empty-canvas release shows nothing.
Alternatives: a modal (rejected: interrupts dragging).

## Bridge-to-bridge

Decision: allowed. It is a veth whose two ends are bridge ports (no new link kind). Documented in `docs/links.md`.

## Edge label

Decision: edge `label` text `eth0 ↔ port1 · MTU 1500` built in `toFlowEdges`; updates with the document.
Alternatives: custom edge component (rejected: nothing needs it yet).

## Selecting and deleting a link

Decision: store keeps `selectedLinkId`, mutually exclusive with node selection. Delete removes the link plus bridge ports it used, namespace interfaces stay (clarification). The inspector content is NL-018; until then selection only highlights the edge.

## One undo step

Decision: `connect` and link delete each go through the existing `withHistory`. Port plus link are one document change.
