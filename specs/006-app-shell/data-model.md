# Data Model: App Shell Layout

## Layout state (remembered, one local storage key)

| Field | Type | Default | Limits |
|---|---|---|---|
| `leftWidth` | number (px) | 240 | 180 to 400 |
| `rightWidth` | number (px) | 300 | 240 to 480 |
| `drawerHeight` | number (px) | 240 | 120 to 480 |
| `drawerCollapsed` | boolean | false | n/a |
| `activeTab` | `DrawerTabId` | `deploymentLogs` | must be one of the nine ids |

Rules:
- Every number is clamped to its limits on load and on set. Non-numbers fall back to the default.
- Unknown `activeTab` falls back to the default.
- The center area keeps a minimum width (`CENTER_MIN_WIDTH` 400): a column drag stops when the center would go below it.
- Unreadable or unwritable storage means defaults, no error.
- Actions: `setLeftWidth`, `setRightWidth`, `setDrawerHeight`, `toggleDrawer`, `setActiveTab`.

## Drawer tab

`{ id: DrawerTabId, label: string, hint: string }`. The hint is one plain sentence about what the tab will show. Nine entries, fixed order (FR-008): Deployment logs, Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT, Packet capture, Diagnostics. Panel body is always the name plus "Not available yet".

## Toolbar action

`{ id, label, enabled: boolean, disabledReason: string }`. Five entries: Save, Validate, Deploy, Stop lab, Reset lab. All disabled now, reason "Not available yet".

## Theme

No stored state. Light or dark comes from the system. Named colors: `surface`, `surface-raised`, `fg`, `fg-muted`, `line`, `accent`, `status-ok`, `status-warn`, `status-error`, `status-idle`.
