# Data Model: Save, Load, and Example Labs

The lab file is the existing `Document` (schema version 1) serialized as JSON. No new field is added to the document.

## Lab file
| Part | Rule |
|---|---|
| Text | `JSON.stringify(document, null, 2)` plus one trailing newline |
| Name | `<safe lab name>.netlab.json`; empty name gives `untitled-lab.netlab.json` |
| Content | Whole document: `schemaVersion`, `lab { id, name, description? }`, `nodes`, `interfaces`, `links`, `layout?` |

## LoadResult
`{ ok: true; document: Document }` or `{ ok: false; error: string }`. Never partial. Errors: not valid JSON, not a NetLab lab file, unsupported version N, file too large, only one file can be opened.

## fileStore (UI state, not persisted)
| Field | Type | Notes |
|---|---|---|
| baseline | Document | Document object at the last save, open, example load, or empty start; `dirty` is `document !== baseline` |
| notice | `{ kind: "error" or "info"; text: string }` or null | Banner over the canvas; dismissed by the user or replaced by the next load |
| pendingDraft | Document or null | Draft found at start, waiting for Restore or Discard |
| draftReady | boolean | True once the prompt is answered or no draft exists; autosave waits for it |

## Draft
One browser key `netlab.draft` holding the lab file text. Offered only if it parses and is not empty (a node, interface, link, or non-empty lab name).

## Example (LabExample)
`{ id, label, description, needsM5, text }`. `text` is the raw example file. `needsM5` is list metadata only.

## Lab id
`LAB_ID_LENGTH` (4) random hex characters. New lab and each loaded example get a fresh id; a user's own file keeps its stored id.

## State flow
- start → empty lab (fresh id), baseline = that document; draft read; if offered → `pendingDraft`
- Restore → replace without confirm; baseline = empty lab (so the restored lab is dirty)
- Discard → remove key; `draftReady = true`
- edit → dirty → debounce → write draft
- save → baseline = current document; draft key removed (the next edit starts a new draft)
- open or example → confirm if dirty → replace → baseline = loaded document → remove draft key → issues check → notice
