# NetLab tickets

Source spec: `../DRAFT.md`. Tickets are ordered so that finishing all of them yields the full application, ending with the acceptance test in NL-078:
two namespaces connected through a Linux bridge, deployed to real kernel state, pinged, with ICMP packets visible in the browser.

## Hard rule: sandbox all privileged Go code

No ticket may run privileged networking code against the developer's real network stack.
All code that creates namespaces, links, bridges, routes, firewall rules, or captures packets runs only inside the sandbox built in NL-001:

```
unshare --user --map-root-user --net --mount   # fake root in a throwaway user+net+mount namespace
mount -t tmpfs tmpfs /run                       # private /run so `ip netns add` works
```

Verified on this machine (WSL2, kernel 6.18): bridge, veth, `ip netns add`, moving a veth into a namespace, and `nft list ruleset` all work inside this sandbox. Everything disappears when the sandbox process exits.

Consequences for every ticket:
- Run privileged tests only through `make sandbox-test` (or `scripts/sandbox.sh <cmd>`). Never `sudo go test`, never `sudo` on the worker.
- The worker binary refuses to start outside the sandbox unless `NETLAB_ALLOW_HOST=1` is set. That variable is for a dedicated disposable VM only and is never set by any Makefile target.
- Only the worker runs in the sandbox. The API runs unprivileged on the host and talks to the worker through a Unix socket under `.sandbox/` (Unix sockets are filesystem objects, so they cross the network-namespace boundary).
- Privileged integration tests carry the build tag `integration` and are opt-in.
- If a ticket needs something the sandbox cannot do, stop and document it in that ticket instead of falling back to the host.

## Ticket conventions
- Each ticket has one runnable acceptance check (a command, test, or curl).
- Keep the app runnable after every ticket.
- Never claim an integration test passed unless it was run in the sandbox.
- Update docs in the same ticket that changes behavior.

## Index

### Foundations
- NL-000 Decisions record
- NL-001 Sandbox harness

### Milestone 1: Topology editor (no root)
- NL-010 Repo scaffold
- NL-011 Topology schema (TS and Go)
- NL-012 Health endpoint and API client
- NL-013 App shell layout
- NL-014 Custom nodes and interface handles
- NL-015 Palette, drag and drop, node operations
- NL-016 Links between interface handles
- NL-017 Properties panel: namespace
- NL-018 Properties panel: bridge and link
- NL-019 Frontend validator
- NL-020 Save, load, example topologies
- NL-021 Frontend tests
- NL-022 Milestone 1 README

### Milestone 2: Real deployment
- NL-030 Go topology validation
- NL-031 Deployment plan builder
- NL-032 Worker skeleton and IPC
- NL-033 Controlled command runner
- NL-034 Worker ops: namespace, bridge, link state, delete
- NL-035 Worker ops: veth, move, bridge port, address
- NL-036 Executor with verification and rollback
- NL-037 Lab and job API
- NL-038 Persistence
- NL-039 WebSocket hub and deployment events
- NL-040 Frontend WebSocket client with reconnect
- NL-041 Frontend deploy wiring
- NL-042 Authentication, authorization, audit log, limits
- NL-043 Orphan sweep, reset, recovery
- NL-044 Sandbox integration tests for deployment
- NL-045 Worker security documentation

### Milestone 3: Kernel-state inspector
- NL-050 Observer parsers
- NL-051 Worker read-only inspection ops
- NL-052 Inspection endpoints
- NL-053 Firewall and NAT inspection
- NL-054 Drift engine
- NL-055 Inspector UI tabs
- NL-056 Desired versus observed UI
- NL-057 Polling, drift events, snapshot on reconnect

### Milestone 4: Packet capture
- NL-060 Capture manager
- NL-061 Packet decoder
- NL-062 Capture API and packet streaming
- NL-063 Packet table and filters
- NL-064 Packet detail tree and hex view
- NL-065 Topology packet animation
- NL-066 Capture integration tests

### Milestone 5: Router, NAT, advanced
- NL-070 Router role and forwarding
- NL-071 Route management
- NL-072 nftables firewall and NAT
- NL-073 Traffic shaping with tc
- NL-074 Connectivity diagnostics
- NL-075 Packet correlation and inferred paths
- NL-076 Canvas polish: context menu, auto layout
- NL-077 Documentation set
- NL-078 End-to-end acceptance and release checklist
