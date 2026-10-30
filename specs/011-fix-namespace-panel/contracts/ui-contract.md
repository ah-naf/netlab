# UI Contract: Namespace Panel Layout

Inspector column, one selected namespace. Same fields and rules as `010-inspector-namespace`; only grouping, labels, and wording change.

## Layout

```text
[ error banner, only when a field has an error ]

Namespace
  Namespace name  [ ns1            ]
  Role            [ Host         v ]       (read-only roles: plain text "Role: NAT gateway")

Interfaces
  +--------------------------------------------------+
  | eth0                       [ Remove interface ]  |
  | Interface name [ eth0 ]                          |
  | MTU [ 1500 ]   State [ Up v ]                    |
  | Addresses                                        |
  |   10.0.0.1/24                 Remove address     |
  |   Add address [ e.g. 10.0.0.5/24 ]               |
  |   Press Enter to add                             |
  | Observed state: Not deployed                     |
  +--------------------------------------------------+
  + Add interface

Default gateway
  Gateway address [ e.g. 10.0.0.1 ]

Static routes
  +--------------------------------------------------+
  | Route to 192.168.5.0/24      [ Remove route ]    |
  | Destination / Gateway / Output interface / Metric|
  | Observed state: Not deployed                     |
  +--------------------------------------------------+
  + Add route
```

## Rules

| Element | Contract |
|---|---|
| Group | A heading plus its content; each group has its own error boundary with fallback "This section could not be shown" and "Try again" |
| Interface block | Bordered; title is the interface name; its remove control is in the header; every field inside belongs to it |
| Route block | Bordered; title is "Route to <destination>" or "New route"; remove (or Confirm and Cancel for a new route) is in the header area |
| Remove control | Visible text names the target; accessible label carries the full target; interface and route removal use the fault color plus a border; address removal is a plain text button |
| Hint | Starts with "e.g.", italic, lighter than a value; never looks like saved text |
| Observed line | "Observed state: Not deployed", muted, same on every interface and route block, tooltip explains it |
| Read-only role | Plain text with the role's full name; no input border |
| Errors | Message text under the field plus the field border; never color alone |

## Behavior fixed

Opening "Add route", and showing any saved route, causes no render error for any number of interfaces or routes.
