# NL-077: Example labs for the draft

- Milestone: Use the lab
- Depends on: NL-070, NL-046, NL-050
- Size: S

## Scope
One example per draft lab in the Examples menu and in `examples/`. Use the names from the draft (`red`, `blue`, `ns0`, `br0`, `veth-red`, `veth-host`, and so on).
- `single-namespace`: one namespace (the inspect lab).
- `namespace-to-host`: `red` linked to a `host` node, addresses 192.168.1.1/24 and 192.168.1.2/24, plus the route.
- `namespace-to-bridge`: `ns0` linked to bridge `br0` in the host, default gateway 192.168.0.1.
- `egress-nat`: the same, plus masquerade on the host and an `outside` namespace that stands in for the internet. The sandbox has no real network, so 8.8.8.8 is not reachable there.
- `direct-link`: update to `blue` and `lemon` with 192.168.0.1 and 192.168.0.2 (also used for the server and curl lab).
- `bridge-lab`: three namespaces on bridge `v-net` (10.0.0.1/24; namespaces .11, .21, .31).
- `router-two-subnets`: `red` and `blue` joined by a `router` namespace (10.11.0.0/24 and 10.12.0.0/24).
- Every example passes the validator and has a one-line description in the menu.

## Acceptance
`node web/scripts/checkExamples.ts` prints `ok` for all seven.
