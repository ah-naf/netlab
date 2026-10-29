# NL-043: Orphan sweep, reset, recovery

- Milestone: 2
- Depends on: NL-036, NL-038
- Size: M

## Scope
- Reset: tears down only resources recorded as owned by the lab (plus a prefix scan for resources with that lab's prefix that the store forgot), then optionally redeploys. Idempotent, safe to run twice.
- Startup sweep: compare owned-resource records with kernel state, mark missing resources, offer cleanup of prefix-matching resources that have no live lab record ("orphans"). Orphan removal needs an explicit API call or CLI flag, never automatic deletion at startup.
- Admin CLI `netlab-worker cleanup --lab <id> [--dry-run]` (sandbox only unless override) listing what would be removed.
- Resources never touched: anything without the `nl` prefix, the default route, host interfaces, global firewall policy.
- Document the recovery steps (feeds NL-077).

## Acceptance
Sandbox tests: create unrelated namespace `foo` and bridge `bar`, deploy and reset the lab, confirm `foo` and `bar` still exist; kill the worker mid-deploy, restart, orphan list shows the leftovers, cleanup removes only those; dry run changes nothing.
