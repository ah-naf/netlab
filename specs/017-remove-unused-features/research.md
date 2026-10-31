# Research: Remove Unused Features

No outside research was needed. Every question was answered by reading the repository.

## D1. Keep the deploy-name derivation, drop only its byte handling

- **Found**: `api/internal/topology/linuxname.go` and `web/src/store/validation/linuxName.ts` build deploy names as `nl-` + 4 bytes of lab id + `-` + name, shortened with a 4-digit FNV hash when over 15 bytes. The ticket text said "no lab id and no hash".
- **Decision**: Keep the derivation. Only replace the UTF-8 byte slicing (`prefixWithin`, `utf8`) with plain slicing, valid because names are now ASCII.
- **Why**: Dropping the hash would force a new "name too long" rule and a new issue code, which is more code, not less. The derivation is committed, working, and NL-031 reuses it.
- **Alternatives**: Plain `nl-` + name with a 12-character limit: simpler to read, but changes behavior and needs new rules and examples. Rejected.
- **Effect**: Decision 5 in `docs/decisions.md` stays as written, with one added line that names are ASCII. `TICKETS/NL-cleanup.md` and `NL-031` were corrected.

## D2. Remove `NAMESPACE_HAS_BRIDGE_FIELDS` and `UNSUPPORTED_NODE_TYPE`

- **Found**: `NAMESPACE_HAS_BRIDGE_FIELDS` fires when a namespace has a `bridge` settings object (`node_rules.go`). Removing `BridgeSettings` removes the field, so the rule cannot fire. `UNSUPPORTED_NODE_TYPE` is only declared in `issue.go`; no rule emits it.
- **Decision**: Delete both codes and their messages and ordering entries, on the Go and editor sides. Keep `BRIDGE_HAS_NAMESPACE_FIELDS` (role, router settings, NAT rules, routes on a bridge).
- **Alternatives**: Keep both as dead codes. Rejected: dead code is what this feature removes.

## D8. The ASCII rule needs a character check on node names

- **Found**: `INTERFACE_NAME_CHARS` only rejects `/` and whitespace. Node names have no character check at all, yet `LinuxName` derives deploy names from node names. Plain slicing of a non-ASCII node name could cut a character in half.
- **Decision**: Make `INTERFACE_NAME_CHARS` accept only `[A-Za-z0-9_-]`, and add one new code `NODE_NAME_CHARS` with the same set for node names (namespaces and bridges), on both sides. This is the one code the cleanup adds; it is what makes "names are ASCII" true.
- **Alternatives**: Keep byte slicing in `LinuxName` and allow non-ASCII node names. Rejected: keeps the byte code this feature removes.

## D9. `INTERFACE_NAME_RESERVED` becomes unreachable

- **Found**: It flags exactly `.` and `..`. Under the ASCII rule `.` is not an allowed character, so the character check already flags both.
- **Decision**: Delete `INTERFACE_NAME_RESERVED`, its message, `isReserved`, and `reservedNames`, on both sides.

## D3. Two search false positives

- `setPointerCapture` in `web/src/hooks/useResizeDrag.ts` is the browser API for dragging panel edges. It matches "capture".
- `\bstp` avoids matching words that merely contain the letters. The check must use a word boundary.
- **Decision**: The repository search in the spec and ticket allows the `tcpdump` text in decision 7 and `setPointerCapture`, and uses `\bstp`.

## D4. Old files with removed fields

- **Found**: Go `json.Unmarshal` ignores unknown fields. The editor's `parseLabFile` only checks the shape of ids and names, and `migrate` copies the document through, so unknown fields such as `mtu` or `bridge` survive in memory and would be written back on save.
- **Decision**: `migrate` in `web/src/types/topologyDocument.ts` strips removed fields on read: `mtu` from interfaces and links, `bridge` from nodes, `role: "nat"`, and DNAT rule fields. Saving then writes a clean file (spec FR-009, edge cases). The Go `Migrate` needs no change: removed struct fields are dropped when it decodes, and a `nat` role string is harmless there because no Go rule reads it.
- **Alternatives**: Leave removed fields in memory until save. Rejected: the spec says saving writes a clean file and removed fields are not shown.

## D5. Command-line check after `vectorcheck` is gone

- **Found**: `vectorcheck` also served as the only command that runs `Validate` on a file. `topocheck` loads and prints a lab but does not validate.
- **Decision**: `topocheck` also prints the issues from `Validate`. About 5 lines. Keeps a hand check for the backend (spec User Story 3).

## D6. Order of work

Backend and frontend changes meet at the lab schema, so: (1) model changes in Go, (2) `make generate` for schema and TS types, (3) frontend edits to compile against the new types, (4) deletions and docs. Within each step the work is mechanical. Details belong in `tasks.md`.

## D7. Kept on purpose (spec FR-013)

Deploy and Reset buttons (disabled), Deployment logs tab, bridge port list (`PortRow.tsx`), interface and link `state`, routes and the routes table, `router` and `host` roles, `genschema`, `topocheck`, `checkExamples.ts`, `roundtrip.ts`, `DisabledButton.tsx`. The examples use role `host` for ordinary namespaces; NL-031 later decides what `host` means for deploy, so cleanup does not touch the role.
