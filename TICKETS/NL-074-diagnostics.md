# NL-074: Connectivity diagnostics

- Milestone: 5
- Depends on: NL-044, NL-062
- Size: M

## Scope
`POST /labs/{id}/diagnostics` with typed requests: ping between two interfaces or nodes of the lab (count and timeout limits), traceroute-style hop check, and an "expected reachability" matrix computed from the topology and compared with results. Runs through allowlisted commands inside lab namespaces only. `DiagnosticCompleted` events. Diagnostics tab shows results and mismatches with a suggested cause (down interface, missing route, forwarding disabled).

## Acceptance
Sandbox tests: reachable and unreachable pairs reported correctly; target addresses outside the lab are refused.
