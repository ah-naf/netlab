# NL-070: Router, routes, and NAT

- Milestone: Use the lab
- Depends on: NL-041
- Size: M

## Scope
Add the three things the FIB and egress labs need to the plan and the worker.
- `EnableForwarding`: a node with role `router` gets `net.ipv4.ip_forward=1` set inside its own namespace through `ip netns exec ... sysctl -w`. Never in the root namespace unless the node is a `host` with the router role.
- Routes: `AddRoute` already exists for default routes (NL-033). Support static routes (`destination via gateway dev interface`) from the node's route list. The validator and the routes table in the UI already exist.
- `AddMasquerade`: a NAT rule on an interface becomes `nft` rules in a table named `nl_nat` in that node's namespace: a `postrouting` chain with `oifname <interface> masquerade`. Load the rules with `nft -f -` over stdin through the runner. The table is created at deploy and removed by reset. No forward chain: a new nft table accepts forwarded traffic by default.
- UI: the forwarding toggle and NAT rule list on the namespace panel already exist from earlier tickets; check they work end to end and fix what does not.

## Acceptance
In the sandbox, deploy `router-two-subnets` (NL-077): red pings blue through the router; with forwarding off in the lab they do not. Deploy `egress-nat`: the private namespace pings the `outside` namespace, and `tcpdump` in `outside` shows the root namespace address as the source. `Inspect nft` shows the `nl_nat` table.
