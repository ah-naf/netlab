# NL-018: Properties panel for bridges and links

- Milestone: 1
- Depends on: NL-016, NL-017
- Size: S

## Scope
- Bridge: name, ports list (read from links), STP toggle and priority, VLAN section hidden behind a "not supported yet" note unless implemented.
- Link: endpoint A and B (node and interface), interface names, MTU, link state.
- Panel for nothing selected shows lab name and summary counts.

## Acceptance
- Renaming a bridge updates the label on canvas.
- Changing a link MTU updates both endpoints.
