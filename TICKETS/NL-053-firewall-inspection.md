# NL-053: Firewall and NAT inspection

- Milestone: 3
- Depends on: NL-051
- Size: M

## Scope
Read-only `nft -j list ruleset` per lab namespace, decoded into typed structures. Tag tables and chains that belong to the lab (naming convention `netlab_<labid>`) separately from other rules in the same namespace. Endpoint `GET /labs/{id}/firewall`. Never modify rules here.

## Acceptance
Unit tests on fixtures. Sandbox test: create a table by hand in a lab namespace and confirm it is shown as "not lab-owned".
