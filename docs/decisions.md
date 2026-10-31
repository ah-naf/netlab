# NetLab Decisions Record

Written: 2026-10-29
Reviewed: 2026-10-31

## 1. Authentication for version 1
**Status**: Approved
**Decision**: No login and no token. The worker listens on a Unix socket with mode 0600 inside a directory with mode 0700. That is the only access control.
**Rationale**: Version 1 targets one user on one machine. The socket permissions already keep other users out of the privileged worker, and a token would add code without adding safety.

## 2. Data persistence
**Status**: Approved
**Decision**: No database. The API keeps the last deployed lab in memory. The browser saves labs as `.netlab.json` files.
**Rationale**: Reset deletes lab resources by their `nl-` name prefix, so nothing has to survive an API restart.

## 3. veth link model
**Status**: Approved
**Decision**: A veth pair is an edge with two interface endpoints. A link is drawn by dragging between two interfaces. It is not a node and has no palette entry.
**Rationale**: A veth pair is two connected interfaces, not a device on its own. Modeling it as an edge keeps interfaces as separate entities and makes dangling endpoints easy to validate.

## 4. Host and router roles
**Status**: Approved
**Decision**: Host and router are roles of a namespace-backed node, set with a `role` field plus role settings. They are not separate kernel object types. The UI may show them with different icons.
**Rationale**: In Linux these are all network namespaces with different settings, such as forwarding and NAT rules. One node type with a role avoids inventing kernel concepts that do not exist.

## 5. Resource naming and ownership
**Status**: Approved
**Decision**: Every lab resource name uses the prefix `nl` plus a short lab id, for example `nl-a1b2-ns1` and `nl-a1b2-br0`. Linux interface names are limited to 15 characters, so the plan builder shortens names with a deterministic short hash. The user-facing name lives only in the topology. Interfaces inside a namespace keep the user-facing name, such as `eth0`.
Every name is editable from the frontend: lab, namespace, bridge, interface, and link names. The editor checks each name as the user types (length, allowed characters, uniqueness) and the Linux names are derived again on the next deploy. Renaming a name on a deployed lab shows as drift until the lab is redeployed.
Names may contain only ASCII letters, digits, `-`, and `_`, so a length of 15 means 15 bytes.
**Rationale**: A fixed prefix tells lab-owned resources apart from everything else on the machine, so reset and cleanup can never touch unrelated resources. The hash keeps names inside the length limit while staying the same on every deploy.

## 6. Kernel control approach
**Status**: Approved
**Decision**: The worker runs a fixed set of programs (`ip`, `bridge`, `sysctl`, `nft`, `ping`, `curl`, `tcpdump`) by absolute path, with separate arguments and never through a shell. There is no netlink library.
**Rationale**: The draft labs are all `ip` commands. Calling the same programs keeps the worker short and easy to check against the draft.

## 7. Packet capture
**Status**: Approved
**Decision**: No capture screen. A command can run `tcpdump -c N` in a namespace and show the text output (NL-046). `tcpdump` must be installed.
**Rationale**: The draft only watches packets to explain where traffic stops. Text output is enough for that.

## 8. Sandboxed development of privileged code
**Status**: Approved
**Decision**: Privileged Go code runs only inside the sandbox, `scripts/sandbox.sh`, which is a throwaway user, network, and mount namespace (see `TICKETS/NL-001-sandbox-harness.md`). Only the worker runs there. The API stays on the host and talks to the worker over a Unix socket. No lab operation uses `sudo`.
**Rationale**: Lab operations must never change the developer's real network setup. The sandbox was tested on this machine and supports bridges, veth pairs, namespaces, and nftables. Everything disappears when it exits.

## 9. Frontend state
**Status**: Approved
**Decision**: Use Zustand. The desired topology is the single source for the canvas.
**Rationale**: The editor shows only the lab being drawn. Kernel state is read as text on request, so no second store is needed.

## 10. API versioning and error format
**Status**: Approved
**Decision**: All routes live under `/api/v1`. Errors use the shape `{ "error": { "code", "message", "resource", "details" } }`.
**Rationale**: A version prefix allows later changes without breaking clients. One error shape lets the frontend show failures the same way everywhere and name the failed resource.
