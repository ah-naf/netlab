# NL-064: Packet detail tree and hex view

- Milestone: 4
- Depends on: NL-063
- Size: M

## Scope
Selecting a row opens a detail pane: collapsible layer tree (fields per layer from the decoder) and a hex dump with ASCII, and selection of a field highlights its byte range. Truncated or undecodable packets show their status clearly. Copy as hex.

## Acceptance
Component tests with fixture events; the byte range highlight matches the decoder offsets for ICMP and TCP samples.
