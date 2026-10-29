# NL-032: Worker skeleton and IPC

- Milestone: 2
- Depends on: NL-001, NL-012
- Size: L

## Scope
`cmd/worker`: separate process, separate binary. It serves a Unix domain socket (default `.sandbox/worker.sock`, mode 0600, directory 0700). Protocol: length-prefixed JSON frames over the socket, each request `{ id, token, op, labId, params }`, each response `{ id, ok, result, error }`; streaming responses for captures (NL-062).
- Fixed set of op names. Unknown ops are rejected. No generic exec op, no free-form arguments, no paths from clients.
- Verifies the shared token (NL-042 refines) and checks peer credentials via `SO_PEERCRED`.
- At startup, refuses to run outside the sandbox unless `NETLAB_ALLOW_HOST=1` (NL-001).
- API side `internal/worker/client` with timeouts, reconnect, and a `Ping` op that feeds `workerReachable` in health.
- Graceful shutdown cancels in-flight ops.

## Acceptance
- `make sandbox-worker` starts it; a Go test in the sandbox starts the worker, connects, and gets a Ping reply.
- Test: connecting with a wrong token fails; an unknown op fails; starting on the host without the override exits with an error.
