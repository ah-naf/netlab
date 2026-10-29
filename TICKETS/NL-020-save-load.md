# NL-020: Save, load, example topologies

- Milestone: 1
- Depends on: NL-011, NL-015
- Size: S

## Scope
- Save to a downloaded `.netlab.json` and open from a file picker; drag-and-drop a file onto the canvas.
- Autosave draft to localStorage (wrapped in try/catch) and restore prompt.
- Load runs `migrate()` and the validator, and shows a clear error for unknown schema versions or malformed JSON without replacing the current document.
- Example library in the UI: bridge lab, two-namespace direct link, router between two subnets (the last is marked "needs M5" until implemented). Files live in `examples/`.
- Backend persistence comes in NL-038 and replaces the download flow with server saves.

## Acceptance
- Round-trip test: save then load yields an identical document.
- Loading a corrupted file shows an error and keeps the old document.

## Naming (decision 5)
The project name is editable from the toolbar and saved in the document.
