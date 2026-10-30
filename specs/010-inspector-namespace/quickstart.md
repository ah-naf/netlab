# Quickstart: Verify the Namespace Panel

No tests, per the constitution. Run the app (`web/`: `npm run dev`) and check by hand.

## Edit a namespace

1. Drag Namespace onto the canvas and select it. The panel shows the form.
2. Rename it to `web` (Enter). The card shows `web`. Press Ctrl+Z; the old name returns.
3. Press the add-interface control. Rename the interface `eth1`, set MTU `1400`, set state down. Card and panel agree.
4. Add address `10.0.0.5/24`. It shows on the card. Remove it. Only it goes.

## Invalid values

| Type in | Expect |
|---|---|
| address `10.0.0.5/99` | error under the field, lab unchanged, banner "This lab has errors (1)" |
| address `abc` | error under the field |
| address already on the interface | duplicate error |
| node name of another node | "taken" error |
| interface name `a b`, `a/b`, `..`, 16 characters | each shows its error |
| MTU `50`, `70000`, `abc` | range error |
| gateway `300.1.1.1` | error |
| route destination `300.1.1.0/24` | error |
| route metric `-1` | error |

Fix each value and press Enter: the error and banner clear, the value is written. Press Escape on a bad draft: the old value returns.

## Role, gateway, routes

1. Set role to Router: the card icon changes. Undo restores it.
2. Set default gateway `10.0.0.1`. It is stored as a default route (see the document). Clear it: the route goes.
3. Add route `192.168.5.0/24`, gateway `10.0.0.254`, output `eth0`, metric `100`. Stored on Enter.
4. Remove an interface used by a route: the route goes with it.
5. A NAT gateway shows its role as text, not a select.

## Observed and lab name

- Every interface and route shows "Not deployed" with no way to edit it.
- Deselect everything: edit the lab name; clearing it shows an error.

## Edge checks

- Select another node with a bad draft open: the draft and banner count are gone.
- Select a bridge: no namespace form.
- Type quickly in one field: other fields do not flicker.
- `npm run build && npm run lint && npm run format:check` pass.
