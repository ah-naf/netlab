# NL-017: Properties panel for namespaces

- Milestone: 1
- Depends on: NL-014
- Size: M

## Scope
Form for a selected namespace node: name, role (host or router), interface list (name, MTU, state, addresses), default gateway, static routes table (destination, gateway, output interface, metric). Inline validation errors from the frontend validator (NL-019) shown next to the field. A read-only "Observed" column is present but shows "Not deployed" until M3.

## Acceptance
- Editing a field updates the store and the node on the canvas.
- Invalid CIDR shows an error and does not mark the document valid.
- Vitest tests for add/remove address, add/remove route.
