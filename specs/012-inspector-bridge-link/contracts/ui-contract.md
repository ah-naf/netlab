# UI Contract: Bridge, Link, and Lab Views

Inspector column. Same grouping, block, hint, and error rules as the [011 contract](../../011-fix-namespace-panel/contracts/ui-contract.md): titled groups with their own error boundary, bordered blocks with a header strip, remove text that names its target, errors under the field and in the banner.

## View chosen by selection

| Selection | View |
|---|---|
| One namespace | Namespace form (unchanged) |
| One bridge | Bridge form |
| One link | Link form |
| Several nodes | "N nodes selected" text (unchanged) |
| Nothing | Lab name and summary |

## Bridge form

```text
Bridge
  Bridge name  [ br0          ]

Ports
  +--------------------------------------------+
  | port1                      [ Remove port ] |
  | Port name [ port1 ]                        |
  | Leads to  ns1 eth0                         |
  +--------------------------------------------+
  +--------------------------------------------+
  | port2                      [ Remove port ] |
  | Port name [ port2 ]                        |
  | Leads to  Not linked                       |
  +--------------------------------------------+
  + Add port

Spanning tree
  [x] STP enabled
  STP priority [ 32768 ]          (disabled while STP is off)

VLAN
  VLAN settings are not supported yet.
```

## Link form

```text
Link
  MTU    [ 1500 ]
  State  [ Up v ]

Endpoint A
  Node            ns1            (read-only text)
  Interface name  [ eth0 ]

Endpoint B
  Node            br0            (read-only text)
  Interface name  [ port1 ]
```

The canvas label `eth0 ↔ port1 · MTU 1500` follows every accepted edit.

## Nothing selected

```text
Lab
  Lab name  [ Untitled lab ]

Summary
  Namespaces  2
  Bridges     1
  Interfaces  4
  Links       2
```

## Field behavior

Identical to the namespace panel: draft updates and the rule runs on each keystroke; Enter or blur with a valid draft writes once (one undo step); an invalid draft writes nothing and keeps its error; Escape restores the lab value. Selects and the STP switch write immediately. The STP priority field is disabled, not hidden, while STP is off.

## Counts

Read from the lab on every change; shown as plain numbers with labels, no charts.
