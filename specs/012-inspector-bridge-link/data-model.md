# Data Model: Properties Panel for Bridges and Links

No schema change. Uses existing `Node.bridge` (`stp`, `stpPriority`), `Link` (`mtu`, `state`), `Interface` (`name`, `mtu`), and `Lab.name`.

## Field rules (`store/fieldRules.ts`)

Each returns an error text, or `null` when valid. Texts and limits are constants.

| Field | Valid when | Error key |
|---|---|---|
| Bridge name | trimmed, not empty, not used by another node | `EMPTY`, `TAKEN` (existing `validateNodeName`) |
| Port name, link endpoint interface name | 1 to 15 chars, no `/`, no whitespace, not `.` or `..`, unique on its node | existing `validateInterfaceName` |
| Link MTU | whole number, 68 to 65535 | existing `MTU_RANGE` |
| STP priority | whole number, 0 to 65535 | `STP_PRIORITY_RANGE` (new) |
| Lab name | trimmed, not empty | existing |

## Document operations (`store/bridgeLinkOps.ts`)

All pure: take a `Document`, return a new `Document` (or a value).

| Function | Effect |
|---|---|
| `setStp(document, nodeId, stp)` | Sets `bridge.stp`; keeps `stpPriority` and `vlan`. Creates `bridge` first if the node has none. |
| `setStpPriority(document, nodeId, priority)` | Sets `bridge.stpPriority`. Creates `bridge` first if the node has none. |
| `setLinkMtu(document, linkId, mtu)` | Sets `mtu` on the link and on both endpoint interfaces. |
| `setLinkState(document, linkId, state)` | Sets the link `state` to up or down. |
| `peerOf(document, interfaceId)` | The other endpoint of the link that uses the interface: `{ nodeName, interfaceName }`, or `null`. |
| `summarize(document)` | `{ namespaces, bridges, interfaces, links }` counts. |

Bridge and port renames use the existing `renameNode` and `renameInterface`.

## Constants (`constants/inspectorBridgeLink.ts`)

`STP_PRIORITY_MIN = 0`, `STP_PRIORITY_MAX = 65535`, `STP_PRIORITY_DEFAULT = 32768`, group titles (Bridge, Ports, Spanning tree, VLAN, Link, Endpoint A, Endpoint B, Lab, Summary), field labels (Bridge name, STP, STP priority, Link MTU, Link state, Node, Interface name; named `BRIDGE_LINK_GROUP_TITLE` and `BRIDGE_LINK_FIELD_LABEL` to avoid clashing with the existing `GROUP_TITLE` and `FIELD_LABEL`), `NOT_LINKED_TEXT = "Not linked"`, `LEADS_TO_LABEL = "Leads to"`, `VLAN_NOTE = "VLAN settings are not supported yet."`, `REMOVE_TEXT.PORT = "Remove port"`, summary labels, and the STP error text.

## UI state

None new. Drafts and error flags use the existing `useFieldDraft` and `fieldErrorStore`.
