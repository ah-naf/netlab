# NL-035: Worker ops: veth, move, bridge port, address

- Milestone: 2
- Depends on: NL-034
- Size: M

## Scope
CreateVethPair, MoveInterfaceToNamespace, AttachBridgePort, AssignAddress (IPv4 and IPv6), plus SetMTU and SetInterfaceUp inside a namespace. Same rules as NL-034: validated input, idempotent, postcondition read-back, prefix ownership. Address assignment is idempotent (same address already present is success; a conflicting address on the interface is reported, not silently replaced). Bring up `lo` inside new namespaces.

## Acceptance
Sandbox integration tests: veth between two namespaces and a ping between them; veth with one end on a bridge; address read-back matches; repeating each op is a no-op; invalid CIDR rejected at the worker boundary even if the API validation is bypassed.
