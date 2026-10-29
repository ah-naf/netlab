# NL-055: Inspector UI tabs

- Milestone: 3
- Depends on: NL-052, NL-013
- Size: L

## Scope
Implement bottom drawer tabs Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT: tables with node filter, sort, search, manual refresh button, loading and error states per node. Inspection errors render as visible error rows with the failed resource, not as empty tables. Lab-owned versus host-wide rules are visually distinct in the firewall tab.

## Acceptance
Vitest component tests with mocked API responses for success, partial failure, and empty results. Manual sandbox run shows real values.
