# NL-041: Frontend deploy wiring

- Milestone: 2
- Depends on: NL-040, NL-037
- Size: M

## Scope
Validate calls the server validator and merges issues with local ones. Deploy saves the topology then starts the job and follows progress. Stop and Reset work with confirmation dialogs that name the resources affected. Node and link status styles (desired, deploying, deployed, failed) come from job and observed data only. Failure shows the failed operation and rollback outcome in the logs tab with an actionable message. Never show "deployed" from local state alone.

## Acceptance
End-to-end manual run in the sandbox: draw the bridge lab, Deploy, watch operations complete, Reset, Deploy again. Playwright test against API plus sandboxed worker (opt-in task `make e2e-sandbox`).
