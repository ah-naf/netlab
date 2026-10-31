# NetLab tickets

Source spec: `../DRAFT_UPDATED.md`. The app only does what the draft's seven labs do: draw a lab, deploy it in the sandbox, inspect the kernel state as text, and run ping, curl, a server, and tcpdump in a namespace. NL-000 to NL-030 are done. The rest were cut down on purpose to keep the app simple.

## Hard rule: sandbox all privileged Go code

No ticket may run privileged networking code against the developer's real network stack.
All code that creates namespaces, links, bridges, routes, firewall rules, or captures packets runs only inside the sandbox built in NL-001:

```
unshare --user --map-root-user --net --mount   # fake root in a throwaway user+net+mount namespace
mount -t tmpfs tmpfs /run                       # private /run so `ip netns add` works
```

Verified on this machine (WSL2, kernel 6.18): bridge, veth, `ip netns add`, moving a veth into a namespace, and `nft list ruleset` all work inside this sandbox. Everything disappears when the sandbox process exits.

Consequences for every ticket:
- Run privileged checks only through `scripts/sandbox.sh <cmd>` or `make sandbox-worker`. Never `sudo go test`, never `sudo` on the worker.
- The worker binary refuses to start outside the sandbox unless `NETLAB_ALLOW_HOST=1` is set. That variable is for a dedicated disposable VM only and is never set by any Makefile target.
- Only the worker runs in the sandbox. The API runs unprivileged on the host and talks to the worker through a Unix socket under `.sandbox/` (Unix sockets are filesystem objects, so they cross the network-namespace boundary).
- Privileged checks are run by hand in the sandbox (`make sandbox-worker`, `workerctl`, the UI). No automated integration tests.
- If a ticket needs something the sandbox cannot do, stop and document it in that ticket instead of falling back to the host.

## Ticket conventions
- Each ticket has one runnable acceptance check (a command, test, or curl).
- Keep the app runnable after every ticket.
- Never claim a networking check passed unless it was run in the sandbox.
- Update docs in the same ticket that changes behavior.

## Index

### Done
- NL-000 Decisions record
- NL-001 Sandbox harness
- NL-010 to NL-022 Milestone 1: topology editor
- NL-030 Go topology validation

### Cleanup (do first)
- NL-cleanup Remove everything the simple lab does not need (vectors, MTU, STP, VLAN, DNAT, capture, stub packages, placeholder tabs)

### Deploy
- NL-031 Plan builder
- NL-032 Worker and command runner
- NL-033 Worker ops
- NL-036 Executor and reset
- NL-037 Deploy and reset API
- NL-041 Frontend deploy wiring

### Use the lab
- NL-046 Run commands in a namespace (ping, curl, server, tcpdump)
- NL-050 Inspect tab (raw `ip`, `bridge`, `nft` output)
- NL-070 Router, routes, and NAT
- NL-077 Example labs for the draft
- NL-078 Acceptance run and README

## Cut on purpose
Auth, audit log, limits, SQLite, orphan sweep, WebSocket, drift engine, parsers, packet capture and its UI, packet animation, correlation, traffic shaping, diagnostics, context menu and auto layout, OpenAPI, and automated tests. None of the draft labs need them. Add a ticket if one becomes needed.
