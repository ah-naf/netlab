# NL-051: Worker read-only inspection ops

- Milestone: 3
- Depends on: NL-033, NL-050
- Size: M

## Scope
Worker ops `InspectLinks`, `InspectAddresses`, `InspectRoutes`, `InspectNeighbors`, `InspectBridges` that take a lab id and an optional node id, resolve it to a lab-owned namespace, and run the allowlisted command inside that namespace (netns entry on a locked thread or `ip -n`). Output limits apply. Read-only: these ops never modify state. Requests for namespaces not owned by the lab are rejected. Output is filtered to lab-owned resources and does not leak unrelated host information.

## Acceptance
Sandbox integration test: deploy the bridge lab, inspect each namespace, the result contains `eth0` with the configured address; inspecting a foreign namespace is refused.
