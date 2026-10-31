# NL-041: Frontend deploy wiring

- Milestone: Deploy
- Depends on: NL-037
- Size: S

## Scope
- Enable the Deploy button: send the document to `POST /deploy`. Show the issue list on 400, a clear message on 503, and the operation list (with command output) in a Logs tab.
- Add a Reset button with a confirmation that says all `nl-` resources in the sandbox will be removed.
- A banner says "deployed" only after a successful response, and clears on any edit to the lab ("changed since deploy").
- No WebSocket, no progress stream, no per-node deploy status styling.

## Acceptance
Manual, in the sandbox: draw the bridge lab, Deploy, read the operation list, Reset, Deploy again. A lab with a validation error shows the issues and creates nothing.
