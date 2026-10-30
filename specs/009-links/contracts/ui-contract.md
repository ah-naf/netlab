# UI Contract: Links

## Handles

| Handle | Where | Id |
|---|---|---|
| Interface handle | right edge of each interface row (existing) | interface id |
| New-port handle | bridge card, below the port rows, label "New port" | `NEW_PORT_HANDLE_ID` |

Nodes are connectable. A drag may start on any handle and end on any handle (loose mode).

## Connection matrix

| From / To | Namespace interface | Bridge port | Bridge new-port |
|---|---|---|---|
| Namespace interface | allow if free and different node | allow if free | allow |
| Bridge port | allow if free | allow if free and different node | allow |
| Bridge new-port | allow | allow | allow if different node |

Same node always rejected. A handle whose interface is already linked is always rejected.

## Feedback while dragging

| Target state | Handle look |
|---|---|
| Allowed | green ring |
| Rejected | red ring |
| Not a handle | no change |

## Rejection notice

Releasing on a rejected handle shows a banner above the canvas with the reason, role `alert`, dismissed after `LINK_NOTICE_MS` or by the next successful connect. Reasons (constants):

| Key | Text |
|---|---|
| `SELF_LINK` | A node cannot link to itself. |
| `ALREADY_LINKED` | That interface is already in a link. |
| `UNSUPPORTED` | These two node types cannot be linked. |

## Edge

| Part | Behavior |
|---|---|
| Label | `<nameA> ↔ <nameB> · MTU <n>` |
| Click | selects the link (`selectedLinkId`); inspector content arrives with NL-018 |
| Delete key | removes the selected link and its bridge ports |
| Undo | one press reverses a create or delete |
