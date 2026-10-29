# NL-054: Drift engine

- Milestone: 3
- Depends on: NL-050, NL-031
- Size: M

## Scope
`internal/observer/drift`: compare desired topology with observed state per resource. Kinds: missing, unexpected (lab-owned but not in topology), different (address, MTU, state, master, route), unknown (inspection failed, which is not the same as matching). Output is a list of `Drift{resourceId, kind, field, desired, observed}`. Deterministic ordering. Lab status becomes `deployed`, `drifted`, `degraded`, or `unknown` from this result.

## Acceptance
Unit tests for each kind, including "inspection error yields unknown, not ok". Sandbox test: deploy, change an address by hand inside the sandbox, drift reports exactly that difference.
