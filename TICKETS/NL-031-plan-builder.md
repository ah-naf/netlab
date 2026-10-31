# NL-031: Deployment plan builder

- Milestone: Deploy
- Depends on: NL-cleanup
- Size: M

## Scope
`internal/engine`: turn a validated topology into an ordered list of typed operations. Pure function, no kernel access.
- Operations: CreateNamespace, CreateBridge, CreateVethPair, MoveToNamespace, AttachBridgePort, AssignAddress, SetUp, AddRoute. NL-070 adds EnableForwarding and AddMasquerade.
- Each operation has `kind` and typed parameters. No dependency graph and no compensating actions: order is fixed (namespaces and bridges, then veth pairs, then moves and ports, then addresses, then up, then routes).
- A node with role `host` stands for the sandbox root namespace. It is never created or deleted. Its interfaces and bridges live in the root namespace.
- Names: every created namespace, bridge, and root-side interface uses `topology.LinuxName(labID, name)` (`nl-` + lab id + name, shortened with a hash when too long). Interfaces inside a namespace keep the lab name (`eth0`). A veth pair is created in the root namespace under temporary names, then moved into place and renamed in one `ip link set ... netns ... name ...` step.
- Also produce the reset list: every resource name the plan would create.

## Acceptance
Run `go run ./cmd/plancheck examples/bridge-lab.json` (small command that prints the plan as JSON). The output has the expected order, is identical on a second run, and a lab with a `host` node never contains CreateNamespace for it.
