# Data Model: Fix Namespace Panel Route Crash and Unclear Layout

No data change. The lab document, field rules, and document operations from `010-inspector-namespace` are untouched.

## Constants added (`constants/inspector.ts`)

| Name | Purpose |
|---|---|
| `GROUP_TITLE` | `NAMESPACE`, `INTERFACES`, `GATEWAY`, `ROUTES` titles |
| `FIELD_LABEL.NODE_NAME` | now "Namespace name" |
| `FIELD_LABEL.GATEWAY_ADDRESS` | "Gateway address" |
| `ADDRESSES_LABEL` | "Addresses" |
| `REMOVE_TEXT` | `ADDRESS` "Remove address", `INTERFACE` "Remove interface", `ROUTE` "Remove route" |
| `removeLabel(kind, target)` | accessible label such as "Remove address 10.0.0.1/24" |
| `PLACEHOLDER` | values now start with "e.g. " |
| `ADD_ADDRESS_HINT` | "Press Enter to add" |
| `ROLE_NAME` | host "Host", router "Router", nat "NAT gateway"; `NO_ROLE_TEXT` "Namespace (no role)" |
| `OBSERVED_LABEL` | "Observed state" |
| `OBSERVED_HELP` | "Shows the live state once the lab is deployed" |
| `ROUTE_TITLE` | `routeTitle(destination)` "Route to <destination>"; `NEW_ROUTE_TITLE` "New route" |
| `SECTION_ERROR` | `TEXT` "This section could not be shown", `RETRY` "Try again" |

## UI state

No new state. A group's error boundary holds one flag (failed or not), reset by "Try again".
