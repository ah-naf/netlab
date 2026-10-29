# NL-034: Worker ops: namespace, bridge, link state, delete

- Milestone: 2
- Depends on: NL-033, NL-031
- Size: M

## Scope
Implement CreateNamespace, CreateBridge, SetInterfaceUp, DeleteLabResource with input validation and structured results. Use netlink/netns libraries for correctness (NL-000 decision 6). Every operation:
- validates that the target name carries the lab prefix and belongs to the request's lab (ownership enforcement, NL-042 adds the store check);
- is idempotent (creating an existing owned resource succeeds with `alreadyExisted: true`; a conflicting foreign resource with the same name fails with `NameConflict` and is never touched);
- verifies the postcondition by reading back state.
- DeleteLabResource only removes resources whose names carry the lab prefix.

## Acceptance
Sandbox integration tests (tag `integration`): create then delete namespace and bridge; second create is idempotent; deleting a resource without the prefix is refused; a pre-existing foreign namespace with a colliding name is not modified.
