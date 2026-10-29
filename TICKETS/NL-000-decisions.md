# NL-000: Decisions record

- Milestone: Foundations
- Depends on: none
- Size: S

## Goal
Settle the open choices in DRAFT.md so later tickets do not stall. Output is `docs/decisions.md`, one short entry per decision.

## Decisions to record
1. Auth for v1: one static bearer token from `NETLAB_TOKEN`, checked by the API and by the worker. Lab ownership is keyed by token owner id.
2. Persistence: SQLite (pure Go driver `modernc.org/sqlite`, no cgo) for labs, jobs, captures metadata, audit log. Topology documents are also exportable as JSON files.
3. veth is an edge in the data model (two interface endpoints). The palette entry "veth pair" is a shortcut that creates a link between two chosen interfaces, not a node.
4. Host, Router, NAT gateway are roles of a namespace-backed node (`role` field plus role settings), not separate kernel object types. The UI may render them with different icons.
5. Resource naming: all lab resources use the prefix `nl` plus a short lab id, for example namespace `nl-a1b2-ns1`, bridge `nl-a1b2-br0`. Linux interface names are limited to 15 characters, so the plan builder derives them with a deterministic short hash and keeps the user-facing name in the topology only. Namespaces inside a lab keep the user-facing interface name (`eth0`).
6. Netlink approach: use `vishvananda/netlink` and `netns` for link, address, route, bridge operations; shell out (fixed path, separate args) only for `nft`, `tc`, `tcpdump` where no good library exists or the library is not worth it. Namespace operations run on a locked OS thread.
7. Capture: tcpdump is not installed on this machine. Decide between (a) install tcpdump and read `tcpdump -w -` pcap output decoded with gopacket, or (b) capture in-process with AF_PACKET via gopacket (no external binary). Recommendation: (a) to follow the spec, with an interface so (b) can replace it.
8. Sandbox: see NL-001. The worker runs only inside the sandbox in development.
9. Frontend state: Zustand. Topology desired state is the single source for the canvas; observed state is a separate store.
10. API versioning `/api/v1`, error format `{ "error": { "code", "message", "resource", "details" } }`.

## Acceptance
`docs/decisions.md` exists, each decision has one paragraph of rationale, and the other tickets' stated assumptions match it. Review by the project owner.
