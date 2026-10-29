# NL-036: Executor with verification and rollback

- Milestone: 2
- Depends on: NL-031, NL-035
- Size: L

## Scope
`internal/engine/executor`: runs a plan through the worker client. Per-operation timeout, overall deployment timeout, cancellation through context, progress callbacks (OperationStarted, OperationCompleted, OperationFailed). After the last operation, read back kernel state and run connectivity checks (ping between the namespaces that the topology says should reach each other).
- Partial failure: stop, then run compensating actions in reverse order for resources created by this deployment only (tracked in the job record). Best effort, record each rollback step result. Do not claim transactional behavior.
- Failure result includes the failed operation, the underlying error, and the rollback outcome.
- Idempotent redeploy: deploying an already deployed identical lab becomes a no-op plus verification.

## Acceptance
Sandbox tests: successful bridge-lab deploy ends with a working ping; injected failure at operation N (fault-injection hook in the worker fake) rolls back everything created and leaves a pre-existing unrelated namespace untouched; cancel mid-deploy rolls back; redeploy twice behaves the same.
