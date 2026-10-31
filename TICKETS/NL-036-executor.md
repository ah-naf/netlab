# NL-036: Executor and reset

- Milestone: Deploy
- Depends on: NL-031, NL-033
- Size: S

## Scope
`internal/engine/executor`: run a plan through the worker client, one operation after another.
- Before the first operation, run `DeleteOwned` so a redeploy starts clean.
- On the first failure, stop, run `DeleteOwned`, and return the failed operation with its error. No partial-state tracking and no claim of transactions.
- Return the result of every operation (kind, ok, output) in order.
- `Reset` is `DeleteOwned` alone.

## Acceptance
In the sandbox: the bridge lab deploys and the namespaces ping each other. Deploying twice gives the same result. A lab with an address on a missing interface fails on that operation and leaves no `nl-` resources behind.
