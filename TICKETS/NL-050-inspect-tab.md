# NL-050: Inspect tab (raw output)

- Milestone: Use the lab
- Depends on: NL-041
- Size: S

## Scope
Show what the draft shows after each step: the real kernel state of one namespace as plain text.
- Worker op `Inspect` with a fixed view list: `link` (`ip link`), `addr` (`ip addr`), `route` (`ip route`), `neigh` (`ip neigh`), `fdb` (`bridge fdb show`, bridge nodes only), `nft` (`nft list ruleset`).
- `GET /inspect?node=<id>&view=<view>` returns the text. The node comes from the last deployed lab. A `host` node inspects the root namespace.
- UI: an "Inspect" tab with a node picker, six view buttons, a Refresh button, and the text in a monospace box.
- No parsing, no normalized types, no drift engine, no polling.

## Acceptance
In the sandbox, deploy `bridge-lab`: `addr` for one namespace shows its address, `route` shows the default route, `fdb` for the bridge lists the ports after a ping.
