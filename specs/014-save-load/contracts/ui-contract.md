# Contract: Toolbar, notices, and prompts

Design follows the existing toolbar and canvas look (theme tokens, `rule` borders, `signal` accent). Use the frontend-design skill for the new components.

## Toolbar (left to right)
`NetLab` | project name (click to edit) | **Save** **Open** **Examples ▾** **Validate** | **Deploy** **Stop lab** **Reset lab** (still disabled) | theme, connection.

- Save, Open, Examples, Validate are enabled buttons.
- **Project name**: shows the name, or "Untitled lab" in a muted style when empty. Click or focus makes it an input; Enter or blur commits; Escape cancels; an invalid (empty) name shows the error text under the field and is not stored.
- **Examples ▾**: a button that toggles a small menu (`role="menu"`). Each item: label, one-line description, and a "needs M5" badge for the router example. Escape, a click outside, or a pick closes it. Items are real buttons reachable by keyboard.

## Notice banner (over the top of the canvas)
- Error (red border, `role="alert"`): one sentence from the error table plus a Dismiss button. Stays until dismissed or replaced.
- Info (neutral border, `role="status"`): used for "N issues found; see the Issues tab" and for "needs M5; you can view and edit it". Dismissible.
- Never covers the toolbar; never blocks the canvas.

## Replace confirmation
Native `confirm`: "This will replace the current lab. Unsaved changes will be lost. Continue?" Shown only when the lab is dirty.

## Restore prompt
Modal over the app (focus trapped, `role="dialog"`, labelled): title "Restore your unsaved lab?", text naming the lab and how many nodes it has, buttons **Restore** (primary) and **Discard**. No Escape shortcut (the choice is explicit).

## Drag and drop
A file dragged over the canvas is accepted anywhere; a palette part still creates a node as before.
