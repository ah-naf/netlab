# UI Contract: App Shell

## Regions (DOM landmarks)

| Region | Element | Label |
|---|---|---|
| Toolbar | `<header>` | text "NetLab", project name "Untitled lab" |
| Left column | `<aside aria-label="Components">` | "Components" + "Not available yet" |
| Center | `<main aria-label="Canvas">` | "Canvas" + "Not available yet" |
| Right column | `<aside aria-label="Inspector">` | "Inspector" + "Not available yet" |
| Drawer | `<section aria-label="Bottom drawer">` | tab bar + active panel |

## Toolbar buttons (order)

Save, Validate, Deploy, Stop lab, Reset lab. All `disabled`; wrapper `title="Not available yet"`. Connection indicator sits at the right end.

## Drag edges

`role="separator"`, `tabIndex=0`, `aria-orientation`, `aria-valuenow/min/max`.

| Edge | Orientation | Keys |
|---|---|---|
| left / center | vertical | Left, Right |
| center / right | vertical | Left, Right |
| center / drawer | horizontal | Up, Down |

Keyboard step: `RESIZE_STEP` (16 px).

## Drawer

Header row: tab bar plus a collapse toggle (`aria-expanded`). Collapsed: only this row shows. Tabs: `role="tab"`, `aria-selected`, `aria-controls`; panel: `role="tabpanel"`. Left/Right arrows move between tabs.

## Persistence

Key `netlab.layout` (constant `LAYOUT_STORAGE_KEY`), JSON of the five layout-state fields.

## Theme tokens

Defined once in `web/src/index.css`; light in `:root`, dark in `@media (prefers-color-scheme: dark)`.
