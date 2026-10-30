# Quickstart: Verify the Route Fix and the Layout

No tests, per the constitution. Run the app (`web/`: `npm run dev`) with the browser console open.

## The crash

1. Drop a Host on the canvas and select it.
2. Click "+ Add route". A "New route" block opens. The console shows no "Maximum update depth exceeded".
3. Fill destination `192.168.5.0/24`, gateway `10.0.0.254`, Confirm. A "Route to 192.168.5.0/24" block shows with no error.
4. Repeat with a namespace that has no interfaces, and with three interfaces and three routes. No error in any case.
5. Click "+ Add route" several times fast: only one "New route" block opens.
6. Open a "New route", then select another node: the block is gone, no error.

## The layout (check with someone who has not seen the panel)

| Ask | Expect |
|---|---|
| Which group holds the node name and role? | "Namespace" |
| Which button deletes an address? Which deletes the interface? | "Remove address" in the address row; "Remove interface eth0" in the interface header |
| Which text is a real value and which is an example? | Saved values are normal text; hints start with "e.g." and are lighter |
| How do I add an address? | "Add address" field with "Press Enter to add" |
| What is "Observed state"? | Muted line "Observed state: Not deployed" with an explanatory tooltip, the same on every block |
| Is the role of a NAT gateway editable? | No: shown as plain text "NAT gateway" |

## Containment

1. Temporarily make one group throw (for example by a deliberate edit in the dev build). The other groups stay usable and the failed group shows "This section could not be shown" and "Try again". Revert the edit.

## Final

- Use every control once with the console open: no errors.
- `npm run build && npm run lint && npm run format:check` pass.
