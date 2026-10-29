# NL-063: Packet table and filters

- Milestone: 4
- Depends on: NL-062
- Size: M

## Scope
Packet capture tab: start/stop controls with interface selector (interfaces from the topology), filter input, packet table (time, source, destination, protocol, length, summary) with virtualized rows, pause/resume (pausing stops table updates but keeps counting), client-side filters for protocol, address, port, interface, and a ring buffer with configurable size (default 5000) so browser memory stays bounded. Display the drop counter when the server reports drops.

## Acceptance
Vitest: filter logic, ring buffer eviction, pause semantics. Playwright test in the sandbox stack: start capture, generate ping, rows appear.
