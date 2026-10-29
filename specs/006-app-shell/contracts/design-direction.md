# Design Direction: App Shell

Subject: a lab bench for network engineers. They build topologies, deploy them to Linux namespaces, and read device state. The UI must feel like precise equipment, not a SaaS dashboard. Skill used: frontend-design. No web research needed; the brief is specific enough.

## Memorable element (the one bold move)

The drawer tab bar is a **patch panel**. Each tab is a port with a small LED. An unavailable tab has a dark LED, an available tab (later) has a lit LED, and the active tab has a seated, recessed look. The LED is honest state: dark means "Not available yet". All nine tabs are dark now. Everything else stays quiet.

## Color (named tokens, one place in `web/src/index.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `chassis` | #DDE3E6 | #0C161C | app background, rails between panels |
| `panel` | #F3F6F7 | #13222A | panel surfaces |
| `ink` | #14232B | #D4E0E4 | main text |
| `ink-muted` | #5B6E77 | #7F959F | secondary text |
| `rule` | #B9C5CA | #253942 | borders, rail grooves |
| `signal` | #0E7C86 | #3DC4CF | focus ring, active tab, drag-handle hover |
| `led-off` | #9AA9AF | #31454E | dark LED, idle status |
| `led-ok` | #2E9A57 | #4CCB7B | online |
| `led-warn` | #C47F0A | #E3A93A | worker offline |
| `led-fault` | #C23A3A | #F06A6A | offline |

Not used: cream plus terracotta, black plus acid green, gradient washes. Light mode is cool grey equipment, dark mode is deep teal-slate, not black.

## Type

- One family: **Schibsted Grotesk** (Google Fonts, weights 400, 500, 600), loaded in `web/index.html`. Fallback `system-ui, sans-serif`.
- Scale (px): 12 panel labels, 13 tabs and buttons, 14 body, 15 project name, 18 "NetLab" wordmark. Sentence case everywhere, no all-caps labels, no eyebrow labels.
- "NetLab" is a wordmark at weight 600 with slightly tight tracking (-0.01em). The project name sits next to it in `ink-muted`, separated by a thin vertical rule.

## Layout and structure

```text
+----------------------------------------------------------+
| NetLab | Untitled lab   [Save][Validate]  [Deploy][Stop][Reset]   (o) API online |
+--------+-----------------------------+-------------------+
| Components |  Canvas (dot grid)       | Inspector         |
| left       |  center                  | right             |
+--------+---+-------------------------+-------------------+
| (o)Logs (o)Interfaces (o)Addresses ... patch-panel tabs   [v]|
|  panel: tab name + Not available yet                     |
+----------------------------------------------------------+
```

- Panels are inset into a `chassis` frame with 6 px rails. The rails are the drag handles.
- Handles: 6 px rail with a short grip of three tiny dots in the middle (like a rack ear). On hover or focus the grip and rail take `signal`. Cursor `col-resize` or `row-resize`.
- Toolbar groups: file actions (Save, Validate) and lab actions (Deploy, Stop lab, Reset lab) are two groups split by a thin rule. Buttons are flat, 28 px tall, 4 px radius. Disabled: `ink-muted` text at reduced contrast, no hover change, `cursor: not-allowed`.
- Radius: 4 px for controls, 0 for panels (they are rack units). No shadows except an inset edge on the active tab.
- Panel header strip (24 px) with the panel name left-aligned in 12 px weight 500. Body shows "Not available yet" left-aligned, 14 px, with a one-line plain sentence of what will live there (for example "Device palette arrives with the editor.").
- Center canvas shows a faint 20 px dot grid in `rule` at 60% so it reads as a working surface.
- Alignment: everything left-aligned. Connection status right-aligned in the toolbar, shown as LED dot plus text, using the same LED tokens as the tabs.

## Motion

None on load. Responses to action only: tab seats in 120 ms, drawer collapse height transition 150 ms, LED and handle color 100 ms. All disabled under `prefers-reduced-motion`. No transition on size during an active drag.

## Quality floor

Visible keyboard focus: 2 px `signal` outline with 2 px offset. Contrast of text on panels at least 4.5:1 in both themes. Works at 1024 px minimum.

## Copy

Short, plain, sentence case. Disabled hover text: "Not available yet". Placeholder body lines say what will appear and nothing is invented as data.
