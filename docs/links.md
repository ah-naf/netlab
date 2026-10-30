# Links

A link joins two interfaces with a veth pair. You make one by dragging from one handle to another on the canvas.

## Allowed connections

- Namespace to namespace: both ends are interfaces inside namespaces.
- Namespace to bridge: the namespace end is an interface inside the namespace. The other end is a port on the bridge.
- Bridge to bridge: allowed only as a veth pair whose two ends are both bridge ports, one on each bridge. There is no direct bridge-to-bridge link kind.

An interface can be in at most one link, and a node cannot link to itself. Every other connection is rejected, and a message names the reason.

## Bridge ports

Each bridge has a "New port" handle. Connecting to it creates a bridge port for the link, so you do not need to add a port first. You can also connect to a port that already exists.

## Deleting a link

Select the link and press Delete. The bridge ports it used are removed. Namespace interfaces stay, with their addresses, and can be linked again.
