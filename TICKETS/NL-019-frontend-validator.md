# NL-019: Frontend validator

- Milestone: 1
- Depends on: NL-011
- Size: M

## Scope
Pure function `validate(doc): Issue[]` with severity, code, resource id, message. Rules: unique ids and resource names, valid Linux interface names (1-15 chars, no `/` or whitespace, not `.` or `..`), valid IPv4/IPv6 CIDRs, no dangling endpoint references, no interface in two links, endpoint kinds valid, routes' gateway reachable via a directly connected prefix on the output interface, namespace and bridge relationships valid, duplicate IP on the same L2 segment warned. Validate button shows the issue list and highlights offending nodes.
- The Go validator (NL-030) implements the same rules. Share test vectors in `testdata/validation/*.json` consumed by both test suites.

## Acceptance
- Vitest runs every vector file and matches expected issue codes.
- Clicking an issue selects the offending node or link.
