# NetLab Decisions Record

Written: 2026-10-29
Reviewed: 2026-10-29

## 1. Authentication for version 1
**Status**: Approved
**Decision**: Use one static bearer token read from the `NETLAB_TOKEN` environment variable. Both the API and the worker check it. Lab ownership is keyed by the token owner id.
**Rationale**: Version 1 targets a single user on one VM, so a full login system adds code without adding safety. A shared token still blocks unauthenticated access to the API and the privileged worker, and the owner id keeps ownership checks in place for a later move to real accounts.

## 2. Data persistence
**Status**: Approved
**Decision**: Store labs, jobs, capture metadata, and the audit log in SQLite through the pure Go driver `modernc.org/sqlite` (no cgo). Topology documents can also be exported as JSON files.
**Rationale**: SQLite needs no separate server and survives restarts, which the job progress and recovery work depend on. The pure Go driver keeps builds simple. JSON export keeps topologies portable and easy to share.

## 3. veth link model
**Status**: Approved
**Decision**: A veth pair is an edge with two interface endpoints. The palette entry "veth pair" is a shortcut that creates a link between two chosen interfaces. It is not a node.
**Rationale**: A veth pair is two connected interfaces, not a device on its own. Modeling it as an edge keeps interfaces as separate entities and makes dangling endpoints easy to validate.

## 4. Host, router, and NAT roles
**Status**: Approved
**Decision**: Host, router, and NAT gateway are roles of a namespace-backed node, set with a `role` field plus role settings. They are not separate kernel object types. The UI may show them with different icons.
**Rationale**: In Linux these are all network namespaces with different settings, such as forwarding and firewall rules. One node type with a role avoids inventing kernel concepts that do not exist.

## 5. Resource naming and ownership
**Status**: Approved
**Decision**: Every lab resource name uses the prefix `nl` plus a short lab id, for example `nl-a1b2-ns1` and `nl-a1b2-br0`. Linux interface names are limited to 15 characters, so the plan builder shortens names with a deterministic short hash. The user-facing name lives only in the topology. Interfaces inside a namespace keep the user-facing name, such as `eth0`.
Every name is editable from the frontend: lab, namespace, bridge, interface, and link names. The editor checks each name as the user types (length, allowed characters, uniqueness) and the Linux names are derived again on the next deploy. Renaming a name on a deployed lab shows as drift until the lab is redeployed.
**Rationale**: A fixed prefix tells lab-owned resources apart from everything else on the machine, so reset and cleanup can never touch unrelated resources. The hash keeps names inside the length limit while staying the same on every deploy.

## 6. Kernel control approach
**Status**: Approved
**Decision**: Use `vishvananda/netlink` and `netns` for links, addresses, routes, and bridges. Run external programs (`nft`, `tc`, `tcpdump`) only with a fixed absolute path and separate arguments, never through a shell. Namespace operations run on a locked OS thread.
**Rationale**: Direct netlink calls are more correct and easier to check than parsing command output. The external programs have no good library or are not worth replacing. A locked thread is required because a namespace switch applies to the current thread only.

## 7. Packet capture
**Status**: Approved
**Decision**: Capture with the external `tcpdump` program and decode its pcap output in Go. The capture code sits behind an interface so it can be replaced later. `tcpdump` is not installed on the development machine and must be installed before capture work starts.
**Rationale**: This follows the product draft and uses a well-known tool with proven filter handling.
**Alternative considered**: Capture in-process in Go with no external program. It needs no install, but it means more code to write and own and a different privilege surface. It was rejected for version 1. The owner confirmed this choice on 2026-10-29.

## 8. Sandboxed development of privileged code
**Status**: Approved
**Decision**: Privileged Go code runs only inside the sandbox, `scripts/sandbox.sh`, which is a throwaway user, network, and mount namespace (see `TICKETS/NL-001-sandbox-harness.md`). Only the worker runs there. The API stays on the host and talks to the worker over a Unix socket. No lab operation uses `sudo`.
**Rationale**: Lab operations must never change the developer's real network setup. The sandbox was tested on this machine and supports bridges, veth pairs, namespaces, and nftables. Everything disappears when it exits.

## 9. Frontend state
**Status**: Approved
**Decision**: Use Zustand. The desired topology is the single source for the canvas. Observed kernel state is kept in a separate store.
**Rationale**: The desired state and the real kernel state can differ, and the interface must show both. Keeping them in separate stores prevents one from silently overwriting the other.

## 10. API versioning and error format
**Status**: Approved
**Decision**: All routes live under `/api/v1`. Errors use the shape `{ "error": { "code", "message", "resource", "details" } }`.
**Rationale**: A version prefix allows later changes without breaking clients. One error shape lets the frontend show failures the same way everywhere and name the failed resource.

## Known mismatches
- NL-012, NL-021, NL-030, NL-031, NL-032, NL-033, NL-034, NL-035, NL-036, NL-044, NL-050, NL-061, NL-066: list tests as acceptance, which disagrees with the constitution's rule that no tests are written. The tickets are not edited yet.
- NL-060 and NL-000 mentioned an in-process capture fallback. Both were fixed to match decision 7.
