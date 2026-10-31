# Research: Properties Panel for Bridges and Links

## Reuse versus new code

Decision: reuse `ValidatedField`, `SelectField`, `Section`, `RemoveAction`, `ErrorBanner`, `edit`, `renameNode`/`validateNodeName`, `renameInterface`/`validateInterfaceName`, `validateMtu`, and `LabNameField` as they are. Add only what is new: STP and link operations, the STP priority rule, a peer lookup, a counts function, and the views.
Rationale: the namespace panel already solved draft, confirm, error display, grouping, and undo; the spec asks for "the same live validation".
Alternatives: a second field component for bridge fields (rejected: duplicates behavior).

## Link label without a name field

Decision: no new field. The label stays `linkLabel(nameA, nameB, mtu)` and changes when an endpoint interface is renamed or the MTU changes; the link panel edits those inputs. (Clarification A.)
Rationale: keeps the lab format and the later Go side unchanged; satisfies "names are user-facing only".

## Where a port leads

Decision: `peerOf(document, interfaceId)` finds the link that uses the port, takes its other endpoint, and returns the other node's name and interface name, or null when the port is in no link. The row shows "ns1 eth0" or "Not linked".
Rationale: ports are plain interfaces; the link is the only source of truth for the other end, so nothing is duplicated.

## Link MTU on both endpoints

Decision: `setLinkMtu(document, linkId, mtu)` sets the link `mtu` and the `mtu` of both endpoint interfaces in one document change. One `edit` call, so one undo step.
Rationale: acceptance says changing a link MTU updates both endpoints; a single pure function cannot leave them out of step.

## STP priority

Decision: whole number 0 to 65535; the field shows 32768 when the bridge has no stored priority; the field is disabled while STP is off. Turning STP on or off keeps the stored priority. A new constant holds the range and default.
Rationale: spec assumption; the common Linux bridge range. Disabled (not hidden) keeps the layout steady and shows the setting exists.
Alternatives: hide the field while off (rejected: layout jumps, setting harder to find).

## VLAN

Decision: a read-only note "VLAN settings are not supported yet." with no inputs and no store change.
Rationale: the ticket allows hiding VLAN behind a note unless implemented.

## Counts

Decision: `summarize(document)` returns namespaces, bridges, interfaces, and links counts. `LabSummary` reads it through `useShallow` (the result is an object of numbers), so it re-renders only when a count changes.
Rationale: the 011 crash came from selectors that return a new array or object each read; shallow comparison on numbers is stable.

## Removing a port

Decision: reuse the store's `removeInterface`, which already removes the attached link (and, since 009, far-side bridge ports of removed links). The panel only exposes the control: "Remove port" in the port row, with the same danger styling as "Remove interface".
Rationale: no new removal rules.

## Selection and switching

Decision: `NodeInspector.tsx` chooses the view from selection: one namespace, one bridge, one link, several nodes, or nothing. When a selected link disappears, the existing selection logic already clears it and the nothing-selected view shows.
