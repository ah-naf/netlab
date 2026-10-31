# Contract: Issue codes and Linux name derivation

Single source of truth for rule meaning. The frontend constant `ISSUE_CODE` and the Go validator (NL-030) MUST use these exact strings. A code has one meaning; a rule has one code.

| Code | Severity | Resource | Fires when |
|---|---|---|---|
| `DUPLICATE_ID` | error | the later duplicate | two nodes, two interfaces, or two links share an `id` |
| `NODE_NAME_EMPTY` | error | node | name is empty or only spaces |
| `DUPLICATE_NODE_NAME` | error | the later node | two nodes (namespace or bridge) share a name |
| `NODE_NAME_CHARS` | error | node | name has a character outside ASCII letters, digits, `-`, `_` |
| `DUPLICATE_INTERFACE_NAME` | error | the later interface | two interfaces of one node share a name |
| `INTERFACE_NAME_LENGTH` | error | interface | name is not 1 to 15 characters |
| `INTERFACE_NAME_CHARS` | error | interface | name has a character outside ASCII letters, digits, `-`, `_` |
| `LINUX_NAME_COLLISION` | error | the later node | derived Linux names of two nodes are equal; `relatedIds` has the other node |
| `INVALID_CIDR` | error | interface | an address is not a valid IPv4 or IPv6 CIDR |
| `INTERFACE_NODE_MISSING` | error | interface | `nodeId` matches no node |
| `DANGLING_ENDPOINT` | error | link | an endpoint matches no interface |
| `LINK_SAME_INTERFACE` | error | link | both endpoints are the same interface |
| `INTERFACE_IN_TWO_LINKS` | error | interface | used by more than one link; `relatedIds` has the links |
| `LINK_ENDPOINT_KIND` | error | link | an endpoint interface belongs to a node that is not a namespace or bridge, or the link kind is not `veth` |
| `BRIDGE_HAS_NAMESPACE_FIELDS` | error | node | a bridge has `role`, `router`, `natRules`, or `routes` |
| `NAT_INTERFACE_NOT_ON_NODE` | error | node | a NAT rule `interfaceId` is not an interface of that node |
| `ROUTE_INTERFACE_MISSING` | error | node | a route `interfaceId` is not an interface of that node |

Sort order of the table is the tie-break order in the issue list.

## Linux name derivation (decision 5)
Names are ASCII only, so lengths are characters.
```text
idPart  = first 4 characters of labId
base    = "nl-" + idPart + "-"                         // at most 8 characters
derived = len(base + name) <= 15
        ? base + name
        : base + keep(name, 15 - len(base) - 5) + "-" + hex4(fnv1a32(name))
```
`keep(text, n)` is the first `n` characters of `text`. `hex4` is the low 16 bits of the 32-bit FNV-1a hash over the bytes of `name`, as 4 lowercase hex digits. The result is always at most 15 characters. The editor and the Go validator MUST use this exact rule.

## Known differences
- IPv4 parts with leading zeros (`10.0.0.01`): invalid in Go (`netip`), accepted by the editor.
- Whitespace at U+0085 and U+FEFF: whitespace for exactly one side (Go for U+0085, JavaScript for U+FEFF).
