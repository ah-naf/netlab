# NL-031: Deployment plan builder

- Milestone: 2
- Depends on: NL-030
- Size: L

## Scope
`internal/engine`: convert a validated topology into an ordered `Plan` of typed operations with explicit dependencies: ReserveNames, CreateNamespace, CreateBridge, SetInterfaceUp (bridge), CreateVethPair, MoveInterfaceToNamespace, AttachBridgePort, SetInterfaceUp (both ends), AssignAddress, AddRoute, EnableForwarding (M5), ApplyFirewallPolicy (M5), VerifyPostconditions, ConnectivityCheck.
- Each operation has an id, kind, typed parameters, the resource it creates, and a compensating action (used by rollback in NL-036).
- Topological ordering with a deterministic tie-break. Cycles are an error.
- Derive short Linux names (NL-000 decision 5) and tag every created resource with the lab id.
- Also produce a teardown plan from a deployed lab record.

## Acceptance
Unit tests: the bridge lab plan has the exact expected order, the plan is deterministic across runs, and a topology with a router and a route produces AddRoute after both addresses. Golden file test `testdata/plans/bridge-lab.json`.
