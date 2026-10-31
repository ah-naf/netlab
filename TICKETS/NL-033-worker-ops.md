# NL-033: Worker ops

- Milestone: Deploy
- Depends on: NL-032, NL-031
- Size: M

## Scope
One worker op per plan operation, each a few `ip` calls through the runner: CreateNamespace (`ip netns add`, then `lo` up), CreateBridge, CreateVethPair, MoveToNamespace (with rename), AttachBridgePort, AssignAddress, SetUp, AddRoute, and `DeleteOwned`.
- Namespace-side commands use `ip netns exec nl-<name> ip ...`. Root-side commands run without `netns exec`.
- `DeleteOwned` deletes only namespaces, bridges, and links whose names start with `nl-`. Anything else is refused. This is the reset (NL-036).
- Ops do not need to be idempotent: deploy always resets first.
- Each op returns the command output so the UI can show it.

## Acceptance
In the sandbox, with `workerctl`: create two namespaces, a veth pair between them, addresses, and `up`, then `ip netns exec nl-a ping` reaches the other side. `DeleteOwned` removes everything. A pre-created namespace named `canary` survives `DeleteOwned`, and deleting `canary` through the op is refused.
