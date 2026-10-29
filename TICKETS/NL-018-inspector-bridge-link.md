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

## Naming (decision 5)
Bridge name, link label, and both link interface names are editable here with the same live validation. Names are stored as user-facing names only; Linux names are derived at deploy time.
