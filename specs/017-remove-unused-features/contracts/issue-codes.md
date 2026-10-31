# Contract: Issue codes after cleanup

Both validators (editor and backend) return the same codes. Changes from `specs/013-frontend-validator/contracts/issue-codes.md` and `specs/016-go-topology-validation/contracts/issue-codes-additions.md`:

## Removed

| Code | Why |
|---|---|
| `NAMESPACE_HAS_BRIDGE_FIELDS` | The `bridge` field no longer exists. |
| `UNSUPPORTED_NODE_TYPE` | No rule emitted it. |
| `NAME_CONFLICT_EXISTING` | The existing-name option is gone. A redeploy resets first. |
| `ROUTE_GATEWAY_UNREACHABLE`, `DUPLICATE_IP_ON_SEGMENT` | A later cleanup removed both rules from the editor and the backend. |
| `INTERFACE_NAME_RESERVED` | `.` and `..` are no longer allowed characters, so the character check covers them. |

## Added

| Code | Meaning |
|---|---|
| `NODE_NAME_CHARS` | A node name (namespace or bridge) has a character outside ASCII letters, digits, `-`, `_`. Error. |

## Changed

`INTERFACE_NAME_CHARS` now means: a character outside ASCII letters, digits, `-`, `_`. `INTERFACE_NAME_LENGTH` message says characters, not bytes.

## After cleanup (17, in order)

`DUPLICATE_ID`, `NODE_NAME_EMPTY`, `DUPLICATE_NODE_NAME`, `NODE_NAME_CHARS`, `DUPLICATE_INTERFACE_NAME`, `INTERFACE_NAME_LENGTH`, `INTERFACE_NAME_CHARS`, `LINUX_NAME_COLLISION`, `INVALID_CIDR`, `INTERFACE_NODE_MISSING`, `DANGLING_ENDPOINT`, `LINK_SAME_INTERFACE`, `INTERFACE_IN_TWO_LINKS`, `LINK_ENDPOINT_KIND`, `BRIDGE_HAS_NAMESPACE_FIELDS`, `NAT_INTERFACE_NOT_ON_NODE`, `ROUTE_INTERFACE_MISSING`.

## Entry point

`Validate(doc)` takes only the document. `BackendOnly` and `AllCodes` are removed with the vector checker.
