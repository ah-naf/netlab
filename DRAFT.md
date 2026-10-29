# Project: NetLab — Visual Linux Networking Lab

Act as a senior software engineer specializing in React, TypeScript, Go, Linux networking, network namespaces, and secure systems programming.

Build a working application named **NetLab**: a visual Linux networking laboratory where users design network topologies using a node-based editor, deploy those topologies to a real Linux VM, inspect actual kernel networking state, and capture and visualize network packets.

Do not build a static mockup or a simulated-only networking application. The final goal is to create and manage real Linux networking resources.

Work incrementally. Inspect the repository before making changes, establish a clear implementation plan, and then implement and test each milestone. Do not stop after generating a plan.

---

## 1. Technology stack

### Frontend
- React
- TypeScript
- Vite
- `@xyflow/react` (React Flow)
- Tailwind CSS for styling
- A reusable component library where appropriate
- Zustand for shared application state, if useful
- A WebSocket client for live events

### Backend
- Go
- Go standard library HTTP server or a lightweight router
- REST API for topology management and inspection
- WebSockets for deployment progress, kernel events, and packet streams
- Structured JSON messages and errors

### Linux networking
- A real Linux VM running a systemd-based distribution
- `iproute2` tools: `ip`, `bridge`, and related utilities
- Linux network namespaces
- Virtual Ethernet pairs
- Linux bridges
- Routing and IP forwarding
- `nftables` as the preferred firewall/NAT implementation
- `tcpdump` and libpcap-compatible packet capture
- Optional Scapy for offline packet analysis during development

Do not require Docker or Kubernetes for the initial implementation.

---

## 2. Application goals

The user must be able to:

1. Draw a network topology visually.
2. Add, configure, connect, rename, and delete nodes.
3. Assign IP addresses and configure interfaces.
4. Validate the topology before deployment.
5. Deploy it to the real Linux VM.
6. Inspect actual Linux networking state.
7. Start and stop packet captures on individual interfaces.
8. View captured packets in real time.
9. Select a packet and inspect its decoded headers.
10. Highlight observed packet activity on the topology.
11. Reset or delete a lab without deleting unrelated host resources.
12. Save and reopen topology documents.

The frontend's topology is the desired state. The Linux kernel is the source of truth for observed state. Never report that a topology is deployed merely because it exists in React state.

---

## 3. Visual design

Build a professional desktop-first network engineering application.

### Main layout

Use a layout similar to network diagramming tools and infrastructure editors:

**Top toolbar**
- Application name: NetLab
- Current project name
- Save
- Validate
- Deploy
- Stop lab
- Reset lab
- Connection and deployment status

**Left sidebar: Component palette**

Draggable components:
- Namespace
- Host
- veth pair
- Linux bridge
- Router
- NAT gateway

Include icons, short descriptions, and a search/filter field.

**Center: React Flow canvas**

- Grid background
- Zoom and pan controls
- Mini-map
- Custom nodes
- Explicit interface handles
- Labeled connections
- Selection and context menus
- Multi-node selection
- Delete and duplicate operations
- Automatic layout as an optional feature
- Clear visual differences between desired, deployed, and failed resources

**Right sidebar: Properties and inspector**

Show context-dependent properties for the selected node, interface, or connection.

For namespaces:
- Namespace name
- Role: host or router
- Interfaces
- IP addresses
- MTU
- Interface state
- Routes
- Default gateway

For bridges:
- Bridge name
- Bridge ports
- STP configuration
- VLAN configuration, if implemented

For veth links:
- Endpoint A and endpoint B
- Interface names
- MTU
- Link state

For routes:
- Destination prefix
- Gateway
- Output interface
- Metric

Display observed kernel values alongside desired configuration.

**Bottom drawer: Terminal and observability**

Tabs:
- Deployment logs
- Interface state
- Addresses
- Routes
- Neighbors
- Bridge state
- Firewall/NAT
- Packet capture
- Diagnostics

Make the interface polished, consistent, responsive, and usable without requiring users to type commands for common tasks.

---

## 4. Network object model

Design a typed topology schema before implementing deployment.

Represent:
- Labs
- Nodes
- Interfaces
- Links
- IP addresses
- Routes
- Bridge configuration
- Router settings
- NAT rules
- Capture sessions

Use stable IDs independent of Linux interface names and React Flow positions.

A node must not be equivalent to an entire Linux interface. Model interfaces as separate logical entities associated with nodes.

A veth connection must have two explicit endpoints. A Linux bridge must have explicit ports. Connections must reference valid interface IDs.

Treat Host and Router as roles of namespace-backed network environments where practical, rather than inventing unnecessary kernel object types.

Example desired topology:

- Namespace `ns1`, interface `eth0`, address `10.0.0.1/24`
- Namespace `ns2`, interface `eth0`, address `10.0.0.2/24`
- Linux bridge `br0`
- One veth pair connecting `ns1` to `br0`
- One veth pair connecting `ns2` to `br0`

Both namespaces should be able to communicate through the bridge after successful deployment.

Use JSON for the persisted topology schema. Add schema versioning so future versions can migrate old documents.

Validate:
- Unique IDs and resource names
- Valid Linux interface names
- Valid IP addresses and CIDRs
- No dangling endpoint references
- No duplicate or contradictory interface assignments
- Valid link endpoint types
- Valid routes and gateways
- Valid namespace and bridge relationships
- Supported topology types
- Resource ownership and name conflicts

Reject invalid topologies before making kernel changes.

---

## 5. Architecture

Separate the application into these logical components:

### Frontend
Responsible for graph editing, forms, visualization, topology persistence, and displaying observed state.

### Go API
Responsible for HTTP endpoints, authentication, authorization, validation, lab management, WebSocket connections, and job orchestration.

### Topology engine
Responsible for graph validation, resource dependency analysis, and conversion of desired state into a deployment plan.

### Linux networking worker
Responsible for approved privileged operations on the Linux VM.

### Observer
Responsible for reading real kernel state and comparing it with desired state.

### Packet capture manager
Responsible for starting, stopping, and supervising capture processes and producing structured packet events.

Keep these responsibilities separate in the codebase, even if the first implementation runs on a single VM.

---

## 6. Real Linux deployment engine

Implement a deployment engine that translates validated topology JSON into explicit, ordered operations.

Example operation sequence for a bridge lab:

1. Reserve lab-owned resource names.
2. Create the bridge.
3. Bring the bridge up.
4. Create the first veth pair.
5. Move the appropriate endpoint into `ns1`.
6. Attach the host-side endpoint to the bridge.
7. Configure `ns1`'s interface.
8. Assign the IP address.
9. Repeat for `ns2`.
10. Read back actual kernel state.
11. Run connectivity checks.
12. Report success or a detailed failure.

Use structured operations such as:

- CreateNamespace
- CreateBridge
- CreateVethPair
- MoveInterfaceToNamespace
- AttachBridgePort
- SetInterfaceUp
- AssignAddress
- AddRoute
- EnableForwarding
- ApplyFirewallPolicy
- StartCapture
- DeleteLabResource

Every operation must validate its inputs and return a structured result.

Do not execute shell strings generated from topology input.

Use Go's `exec.CommandContext` with fixed executable paths and separate arguments. Never use `sh -c`, `bash -c`, or equivalent shell execution for graph-generated operations.

Where suitable, consider Go networking libraries such as `github.com/vishvananda/netlink` and `github.com/vishvananda/netns`. Evaluate their suitability for namespace and netlink operations, and prefer direct netlink APIs over shelling out when that materially improves correctness.

Use a controlled command runner for operations that still require external executables.

### Deployment behavior

- Give every lab a unique ID.
- Track which resources belong to that lab.
- Persist operation progress.
- Enforce operation timeouts.
- Support cancellation.
- Verify postconditions after operations.
- Handle partial failures.
- Perform best-effort rollback of resources created during a failed deployment.
- Never delete unrelated interfaces, namespaces, routes, or firewall rules.
- Implement idempotent deploy/reset behavior.
- Provide actionable error messages.
- Detect external changes and show desired-versus-observed drift.

Do not promise fully transactional Linux networking. Implement compensating actions and explicit recovery for partial failure.

---

## 7. Secure privileged execution

Security is a core requirement.

Do not run the entire HTTP server as root.

Use an unprivileged API process and a separate privileged networking worker.

The worker must expose only a narrow set of typed, validated operations. It must not accept arbitrary command names, shell commands, unrestricted arguments, or arbitrary filesystem paths.

Implement:
- Request authentication
- Authorization for lab operations
- Per-lab resource ownership
- Input validation at both API and worker boundaries
- Executable allowlists and argument validation
- Process timeouts and output size limits
- Concurrency limits
- Audit logs for privileged operations
- Restricted worker IPC permissions
- Capture session ownership
- Cleanup of processes when a lab is deleted
- Protection against resource-name collisions
- Isolation from the VM's management network where practical

Use a Unix domain socket with restrictive filesystem permissions for API-to-worker communication, or another well-defined local IPC mechanism. Authenticate and validate messages even when the transport is local.

For the initial single-user VM, provide a practical development mode, but do not make arbitrary root execution available through the browser.

Use a dedicated lab resource namespace/prefix where possible. Avoid modifying the VM's default route, host management interface, or global firewall policy during ordinary lab operations.

Document the capabilities the worker requires and how to run it safely.

---

## 8. Live kernel-state inspector

Implement read-only inspection endpoints that return structured JSON.

Support at minimum:

### Links and addresses
- `ip -j link show`
- `ip -j addr show`
- Interface state, MTU, MAC address, and addresses

### Routing
- `ip -j route show`
- `ip -j -6 route show`
- `ip -j rule show`
- Routes scoped to a specific namespace

### Neighbors
- `ip -j neigh show`

### Bridges
- `bridge -j link show`
- `bridge -j fdb show`

### Firewall and NAT
- Read-only inspection of `nftables` rules and tables
- Display the actual NAT and filtering rules used by the lab
- Clearly distinguish lab-owned rules from host-wide rules

Use JSON output when the underlying tool supports it. Decode it into typed Go structures where practical, and normalize it into an API response schema for the frontend.

Run namespace-scoped inspections using the appropriate namespace execution mechanism.

Implement a refresh button and optional periodic polling.

The UI must distinguish:
- Desired configuration
- Observed kernel configuration
- Drift or mismatch
- Inspection errors

Never fabricate state when an inspection fails.

Use structured API errors with the failed resource or command identified. Avoid returning sensitive host information unrelated to the lab.

---

## 9. Packet capture and live visualization

Implement packet capture as an independent subsystem.

### Capture lifecycle

Support:
- Start capture on a selected interface
- Stop capture
- Capture status
- Capture filters
- Capture duration and resource limits
- Live packet streaming
- Capture error reporting
- Cleanup on application shutdown and lab deletion

Initially, support interface-level captures using `tcpdump`.

A capture command may use options similar to:

`tcpdump -i eth0 -nn -l -c 1000`

This is an illustrative command only. Production capture execution must construct arguments from validated configuration, enforce time and packet limits, and prevent access to interfaces outside the selected lab.

Use a dedicated capture manager. Do not expose arbitrary `tcpdump` arguments to the browser.

For the initial version, parse a stable, documented machine-readable output format or use libpcap to produce structured packet records. Avoid relying on fragile parsing of human-readable terminal output.

### Packet event schema

Include fields such as:

- Event ID
- Capture ID
- Lab ID
- Timestamp
- Interface ID
- Linux interface name
- Direction, if reliably known
- Capture sequence number
- Source and destination MAC addresses, when present
- Source and destination IP addresses, when present
- Source and destination ports, when present
- Protocol
- Packet length
- TCP flags
- ICMP type and code
- Decode status
- Truncation indicator

Preserve enough raw packet data for deeper inspection, but enforce size limits and avoid unnecessarily persisting payloads.

Use WebSockets to stream packet events to the frontend.

### Packet viewer UI

Build a Wireshark-inspired packet viewer with:

1. A packet table with timestamp, source, destination, protocol, length, and summary.
2. Filters for protocols, addresses, ports, and interfaces.
3. A packet detail tree for decoded headers.
4. A hexadecimal view of packet bytes.
5. Pause/resume controls.
6. Capture start/stop controls.
7. A configurable packet buffer to avoid unbounded browser memory growth.

### Packet animation

Map captured interface IDs to topology nodes and links.

When a packet is observed, highlight the corresponding interface or connection and show an animated indicator.

Do not assume one capture reveals the complete end-to-end packet path. A packet may be observed at several interfaces, and NAT, bridge forwarding, routing, offloading, and capture placement affect what is visible.

For advanced path visualization, correlate observations across capture points using timestamps and packet attributes. Label inferred paths separately from directly observed events.

---

## 10. WebSocket events

Define typed events for:

- DeploymentStarted
- OperationStarted
- OperationCompleted
- DeploymentFailed
- DeploymentCompleted
- KernelStateUpdated
- StateDriftDetected
- CaptureStarted
- CaptureStopped
- PacketObserved
- DiagnosticCompleted

Each event should include:
- Event ID
- Lab ID
- Event type
- Timestamp
- Relevant resource ID
- Typed event payload

Implement connection lifecycle handling, bounded queues, cancellation, and backpressure. Avoid blocking the networking worker if the browser disconnects.

Use sequence numbers or another strategy to detect dropped events. The frontend should display a reconnecting state and allow a fresh kernel-state snapshot after reconnecting.

Do not broadcast one user's lab data to other users.

---

## 11. API endpoints

Implement and document a versioned REST API, preferably under `/api/v1`.

At minimum:

- `GET /api/v1/health`
- `POST /api/v1/labs`
- `GET /api/v1/labs`
- `GET /api/v1/labs/{id}`
- `PUT /api/v1/labs/{id}/topology`
- `POST /api/v1/labs/{id}/validate`
- `POST /api/v1/labs/{id}/deploy`
- `GET /api/v1/labs/{id}/jobs/{jobId}`
- `POST /api/v1/labs/{id}/stop`
- `DELETE /api/v1/labs/{id}`
- `GET /api/v1/labs/{id}/state`
- `GET /api/v1/labs/{id}/links`
- `GET /api/v1/labs/{id}/addresses`
- `GET /api/v1/labs/{id}/routes`
- `GET /api/v1/labs/{id}/neighbors`
- `GET /api/v1/labs/{id}/bridges`
- `GET /api/v1/labs/{id}/firewall`
- `POST /api/v1/labs/{id}/captures`
- `GET /api/v1/labs/{id}/captures`
- `DELETE /api/v1/labs/{id}/captures/{captureId}`
- WebSocket endpoint for lab events

Use typed request and response structures, consistent error formats, validation, and appropriate HTTP status codes.

Deployment should return a job identifier rather than blocking the HTTP request until the whole topology is created.

---

## 12. Testing requirements

Do not test only the frontend or mock the backend.

### Frontend tests
- Node creation and deletion
- Interface configuration
- Connection validation
- Topology serialization and deserialization
- API error handling
- WebSocket reconnect behavior
- Packet list filtering

### Go unit tests
- Topology schema validation
- Interface and CIDR validation
- Duplicate resource detection
- Invalid endpoint rejection
- Deployment plan ordering
- Ownership enforcement
- Argument validation
- Error handling
- Packet event parsing
- Drift detection

### Linux integration tests

Run in a disposable Linux VM or isolated lab environment.

Test that:
1. Two namespaces can be created.
2. A veth pair can connect them.
3. A Linux bridge can connect multiple namespaces.
4. IP addresses and routes are configured correctly.
5. `ping` works where the topology permits it.
6. Kernel inspection returns actual addresses and routes.
7. Packet capture observes ICMP traffic.
8. The UI receives packet events.
9. Invalid topologies are rejected.
10. Partial deployment failures are reported and cleaned up safely.
11. Reset removes only resources owned by the lab.
12. Repeated deploy and cleanup operations behave predictably.

Use unprivileged unit tests wherever possible. Make privileged integration tests explicitly opt-in.

Provide a documented command for running each test suite.

---

## 13. Implementation milestones

Implement the project in the following order.

### Milestone 1: Working topology editor
- Create the repository structure.
- Set up React, TypeScript, Vite, and React Flow.
- Implement custom namespace, bridge, and veth node components.
- Implement interface handles and explicit endpoint connections.
- Add properties panels.
- Save and load topology JSON.
- Validate topology in the frontend.
- Add Go API health endpoint and API client.

Deliver a working canvas that can be used without root privileges.

### Milestone 2: Real namespace and bridge deployment
- Implement the canonical topology schema in Go.
- Add graph validation and deployment planning.
- Implement the privileged worker.
- Create namespaces, veth pairs, and bridges.
- Configure addresses and bring interfaces up.
- Implement deploy progress, cleanup, and error reporting.
- Test real connectivity in the Linux VM.

### Milestone 3: Kernel-state inspector
- Implement actual link, address, route, neighbor, and bridge inspection.
- Add the inspector UI.
- Compare observed state with desired state.
- Implement drift detection and manual refresh.

### Milestone 4: Packet capture
- Add capture lifecycle management.
- Stream packet events over WebSockets.
- Build the packet table and packet detail viewer.
- Animate observations on the topology.
- Add bounded buffers and robust capture cleanup.

### Milestone 5: Router, NAT, and advanced features
- Add router roles and IP forwarding.
- Add route management.
- Add `nftables` firewall/NAT configuration.
- Add traffic shaping using `tc`.
- Add connectivity diagnostics and richer packet correlation.

Do not implement all advanced features before the bridge-based network works end to end.

---

## 14. Developer experience and documentation

Provide:

- A root README with architecture and setup instructions
- Frontend and backend development commands
- Linux VM prerequisites
- Required packages and capabilities
- Environment variable documentation
- API documentation
- Example topology JSON files
- A bridge-lab tutorial
- A troubleshooting guide
- A cleanup and recovery guide
- A security model explaining privileged operations
- A deployment guide for a single-user Linux VM

Include `.env.example` where appropriate. Do not commit credentials or secrets.

Use clear error messages. Prefer small, focused packages and interfaces over a monolithic implementation.

---

## 15. Coding-agent workflow

Follow these instructions while working:

1. Inspect the existing repository and available tools first.
2. Identify the current OS, project structure, and existing implementation.
3. Present a concise implementation plan and any important assumptions.
4. Implement Milestone 1 completely.
5. Run the frontend and backend tests, and fix failures.
6. Add a README explaining how to run the project.
7. Continue with the next milestone if the environment supports it.
8. For privileged Linux operations, inspect the environment and clearly identify which steps require a real Linux VM and elevated privileges.
9. Never claim that a real Linux networking integration test passed unless it was actually run.
10. If a dependency, capability, or environment limitation blocks a milestone, implement what can be tested safely and document the remaining work.
11. Do not leave core features as empty placeholders while claiming they are complete.
12. Keep the application runnable at the end of each milestone.

Begin by inspecting the repository. Then implement the first working milestone, with a clear path to real Linux deployment and packet inspection.

The ultimate acceptance criterion is this: a user can visually construct two Linux namespaces connected through a Linux bridge, deploy the network to a real Linux VM, verify the actual interface and IP state, ping between namespaces, and see the corresponding captured ICMP packets in the frontend.