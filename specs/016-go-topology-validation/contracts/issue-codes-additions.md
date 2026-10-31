# Contract: Additions to the shared issue codes

These extend `specs/013-frontend-validator/contracts/issue-codes.md` (one task edits that file to add them). The 20 existing codes and their meanings do not change.

| Code | Severity | Resource | Fires when | Produced by |
|---|---|---|---|---|
| `UNSUPPORTED_NODE_TYPE` | error | node | `type` is not `namespace` or `bridge` | backend only |
| `NAME_CONFLICT_EXISTING` | error | node | the node's derived Linux name equals an existing lab-owned name whose owner lab id is not this lab's id; names without the `nl-` prefix are ignored; no existing names given means skipped | backend only |

Sort order: after the existing 20 codes, in the order above.

## Byte rule (amends two existing definitions)
- `INTERFACE_NAME_LENGTH`: the name is not 1 to 15 **bytes** in UTF-8 (was: characters). ASCII names behave as before.
- Linux name derivation: the lab id part of the base is the longest whole-character prefix of the lab id that fits in 4 bytes (so the base is at most 8 bytes); all lengths are UTF-8 bytes; when the name must be shortened, keep the longest prefix of whole characters that fits in `15 - len(base) - 5` bytes, then `-` and the 4 hex digits. ASCII names behave as before. FNV-1a runs over the UTF-8 bytes.

Both sides MUST implement this exactly; shared vectors with non-ASCII names prove it.

## Known differences (not covered by shared vectors)
- IPv4 parts with leading zeros (`10.0.0.01`): invalid in Go (`netip`), accepted by the editor.
- Whitespace at U+0085 and U+FEFF: whitespace for exactly one side (Go for U+0085, JavaScript for U+FEFF). No shared vector may contain either character.
- CIDR prefix length with leading zeros (`10.0.0.1/024`): invalid in Go (`netip`), accepted by the editor.
- A lab that has both an invalid CIDR address and a route with a gateway on that interface can give different `ROUTE_GATEWAY_UNREACHABLE` results: Go ignores the invalid address, the editor's containment check is not defined for it.
