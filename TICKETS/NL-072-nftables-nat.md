# NL-072: nftables firewall and NAT

- Milestone: 5
- Depends on: NL-053, NL-070
- Size: L

## Scope
`ApplyFirewallPolicy` and the NAT gateway role. Typed policy model (accept, drop, masquerade, DNAT rule with validated fields), compiled to nft JSON or a structured ruleset loaded with `nft -j -f -` over stdin through the runner (no shell, no temp files with user content). Rules live only in a lab-owned table `netlab_<labid>` inside lab namespaces, never in the host namespace and never touching global policy. Reset deletes only that table.
- UI form for NAT gateway and simple filter rules, with the actual ruleset shown from the firewall tab.

## Acceptance
Sandbox tests: masquerade lets a private namespace reach another namespace through the NAT gateway; a drop rule blocks ping; a foreign table in the same namespace survives reset.
