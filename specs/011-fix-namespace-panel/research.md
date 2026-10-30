# Research: Fix Namespace Panel Route Crash and Unclear Layout

## Cause of "Maximum update depth exceeded"

Finding: `RouteRow.tsx` and `NewRouteRow.tsx` call `useTopologyStore((s) => interfacesOf(s.document, nodeId))`. `interfacesOf` filters the interface list, so it returns a new array on every read. Zustand 5 compares the selector result by reference, sees a "change" on every read, and React re-renders until it aborts. "Add route" mounts `NewRouteRow` first, so the crash shows there; any node with a saved route mounts `RouteRow` and fails the same way.

Decision: read the list with `useShallow` (already used for the same data in `NodeInspector.tsx` and `NamespaceForm.tsx`). The interface objects keep their identity in the store, so a shallow comparison is stable.
Alternatives: return interface ids and look each up (rejected: more code for the same result); memoize in the store (rejected: adds store state for a view detail).

## Keeping one failing part from breaking the rest (FR-003)

Decision: wrap each of the four groups in a small error boundary with a short fallback line ("This section could not be shown") and a "Try again" button that remounts it.
Rationale: the report shows one bad row can blank the whole panel; the spec asks that a failure in one part not leave the rest unusable. A boundary is the standard way to contain a render failure.
Alternatives: rely on the crash fix only (rejected: the next bug would repeat the problem); one boundary around the whole panel (rejected: loses the unaffected groups).

## Grouping and titles (FR-004, FR-005)

Decision: a `Section` component renders a heading and its content, so every group has the same title style and its own boundary. Groups: Namespace (name and role), Interfaces, Default gateway, Static routes. Each interface and each route is a bordered block whose header row holds its title (the interface name, or "Route to <destination>") and its own remove control.
Rationale: grouping by border and heading reads without color; the remove control sits in the header next to the thing it deletes.
Alternatives: tabs (rejected: hides content in a narrow panel); accordion (rejected: extra clicks for a form used all the time).

## Remove buttons (FR-007)

Decision: a shared `RemoveAction` with visible text that names its target: "Remove address", "Remove interface", "Remove route", each carrying the full target in its accessible label (for example "Remove address 10.0.0.1/24"). Interface and route removal use a bordered, fault-colored button in the block header; address removal stays a plain text button in the address row.
Rationale: visible text plus position tells which is which; the fault color is backed by the word "Remove" and the border, so color alone is not the signal.

## Hints versus values (FR-008)

Decision: placeholders read "e.g. 10.0.0.5/24" and are styled italic and lighter. The add-address field also gets a line "Press Enter to add", because the field saves on Enter or when it loses focus and that was not visible.
Alternatives: an explicit Add button (rejected for now: the other fields already save on Enter or blur and one pattern is easier to learn).

## Labels and the Observed line (FR-009, FR-010, FR-011)

Decision: "Namespace name" for the node field; "Interface name" stays; the gateway field is "Gateway address" under the "Default gateway" title. The Observed line reads "Observed state: Not deployed" everywhere, muted, with a tooltip "Shows the live state once the lab is deployed". A read-only role shows its full name ("NAT gateway", or "Namespace (no role)") as plain text with no input border.
Rationale: one wording on every row; the fixed role cannot be mistaken for a field.
