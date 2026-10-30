# Design Direction: Palette

Subject: the parts bin of a network lab bench. Audience: network engineers who think in devices (host, router, switch) and cables. Skill used: frontend-design. Continues [006 design direction](../../006-app-shell/contracts/design-direction.md): cool equipment greys, named tokens, Schibsted Grotesk, sentence case, no all-caps labels, no eyebrows.

## Memorable element

**The part you drag is the node you get.** Each palette entry has an inset icon tile like a labeled module in a parts drawer. The same icon sits in the header of the node on the canvas. Icons are drawn as the object, not as an abstract symbol, so a first-time user can read them without the label.

## Icons (24 px grid, 1.5 px stroke, `currentColor`, round caps)

| Part | Drawing | Why it reads |
|---|---|---|
| Namespace | Dashed rounded square with a small solid node and two short stubs inside | Dashed wall means "isolated space", node inside means "network stack in it" |
| Host | Monitor on a stand with a small keyboard below | Everyone knows a computer |
| veth pair | Two plug ends facing each other, joined by a cable with a slight sag | Plugs and a cable say "virtual cable" |
| Linux bridge | A horizontal bar with four short ports dropping from it | Looks like a switch or a bus; ports are visible |
| Router | A small box with four arrows pointing out of its sides | The classic router symbol |
| NAT gateway | Two small boxes side by side with a wall between them and a two-way arrow crossing it | "Translate across a boundary" |

Palette size 28 px inside a 40 px tile. Canvas size 16 px. Icons use `ink` in the palette and `signal` on canvas headers (as today). At 16 px the shapes keep at most six strokes so they stay clear.

## Layout (180 to 400 px wide column)

```text
+-----------------------------+
| Components                  |
| [ Search parts          ]   |
| [icon] Namespace            |
|        Isolated network     |
|        stack for one device |
| ---------------------------- |
| [icon] Host                 |
|        A computer on the lab|
| ...                         |
| [icon] veth pair   (dim)    |
+-----------------------------+
```

- Flat rows separated by `rule` lines, no cards, no shadows, no gradients. Radius 4 px on the icon tile only.
- Row: tile left, name (14 px, weight 600) and description (12 px, `ink-muted`, up to 2 lines) right. Left-aligned.
- Hover: tile border and name take `signal`; cursor `grab`, `grabbing` while dragging.
- Disabled (veth pair): `ink-muted` at reduced contrast, dark `led-off` dot beside the name, cursor `not-allowed`, tooltip "Not available yet".
- Search: single line input at the top, magnifier glyph inside, placeholder "Search parts", clear on Escape. Empty result: "No matching parts" in muted text.
- Focus: 2 px `signal` outline, same as the rest of the app. Rows are focusable; Enter on a focused available row does nothing (drag only), so no false affordance.

## Copy (plain, sentence case)

Namespace: "Isolated network stack with its own interfaces and routes". Host: "A computer on the lab network". veth pair: "A virtual cable between two interfaces". Linux bridge: "Connects interfaces like a switch". Router: "Forwards traffic between networks". NAT gateway: "Translates addresses between inside and outside".

## Motion

None except response to action: drop places the node with no animation, drag ghost is native. Hover color 100 ms; disabled under `prefers-reduced-motion`.

## Plan review against the brief

First draft used icon-library style glyphs (generic circles and arrows). Revised to drawn objects (monitor, plugs, port bar) because the request is "self explanatory icons". Also dropped any card styling for the entries in favor of flat rows, keeping the bench-equipment look from the shell.
