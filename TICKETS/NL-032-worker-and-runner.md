# NL-032: Worker and command runner

- Milestone: Deploy
- Depends on: NL-001, NL-012
- Size: M

## Scope
`cmd/worker`: a separate binary that runs only inside the sandbox.
- Listens on a Unix socket (default `.sandbox/worker.sock`, mode 0600, directory 0700). One JSON request per connection: `{ op, params }`, one JSON reply: `{ ok, result, error }`. There is no token. The socket mode is the access control.
- Fixed list of op names. An unknown op is rejected. There is no generic exec op and no free-form arguments from clients.
- Refuses to start outside the sandbox unless `NETLAB_ALLOW_HOST=1` (NL-001).
- `internal/worker/runner` is the only place that starts programs: `ip`, `bridge`, `sysctl`, `nft`, `ping`, `curl`, `tcpdump`, by absolute path found at startup, `exec.CommandContext`, separate arguments, no shell, timeout, output size cap. Every value that comes from a client is checked against a strict pattern (names `^[A-Za-z0-9_-]{1,15}$`, IPs and CIDRs through `net/netip`, numbers within a range) before it reaches an argument list.
- `Ping` op. The API client in `internal/worker/client` calls it so `workerReachable` in the health check becomes true.
- `cmd/workerctl`: a 30-line command that sends one op JSON to the socket. It is for manual checks.

## Acceptance
`make sandbox-worker` starts the worker. `workerctl` with `Ping` returns `ok`, with an unknown op returns an error, and `curl localhost:8080/api/v1/health` shows the worker online. Starting the worker on the host without the override exits with an error.
