# Research: Save, Load, and Example Labs

## 1. Save and download
**Decision**: `serializeLab(document)` returns `JSON.stringify(document, null, 2)` plus a trailing newline. `saveLab` makes a `Blob` (`application/json`), an object URL, clicks a temporary anchor with `download` set, then revokes the URL. Save does not touch the document, selection, or history; it only sets the baseline.
**Rationale**: No dependency, works in every desktop browser, plain readable text that diffs well. A fixed indent gives the same text for the same lab, so saving twice is identical (SC-002).
**Alternatives**: File System Access API (not in Firefox; the ticket says a download); minified JSON (hard to read and review).

## 2. File name
**Decision**: `downloadName(labName)`: replace characters unsafe in file names (`\ / : * ? " < >`, `|`, control characters) with `_`, trim spaces and leading dots, then add `.netlab.json`; an empty result becomes `untitled-lab`. The stored name never changes.
**Rationale**: FR-017. One pure function a script can check.
**Alternatives**: Slug to lowercase hyphens (changes names the user chose more than needed).

## 3. Parse and the three errors
**Decision**: `parseLabFile(text)` returns `{ ok: true, document }` or `{ ok: false, error }`:
1. `JSON.parse` fails → "not valid JSON".
2. Parsed value is not an object, has no numeric `schemaVersion`, or `lab` is not an object with string `id` and `name`, or `nodes`, `interfaces`, `links` exist but are not arrays, or any element has the wrong shape (node: string `id`, `name`, `type`; interface: string `id`, `nodeId`, `name`; link: string `id`, `endpointA`, `endpointB`) → "not a NetLab lab file". The element guard runs before anything is replaced, so garbage elements can never reach the canvas.
3. `migrate()` throws (unsupported version) → "unsupported version N" (N read from the file).
On success the result comes from `migrate()`, so older versions are converted once, in one place (FR-004).
**Rationale**: One entry for the file picker, the drop, the examples, and the draft, so all four get the same safety. The current lab is never touched on failure (FR-005).
**Alternatives**: Validate with the JSON schema file (needs a validator dependency); trust `migrate()` alone (it only checks the version, so a wrong shape would crash later).

## 4. Validator on load
**Decision**: After a good parse, run `validate()`. If there are issues, load anyway, open the Issues tab with the existing `showIssues`, and show an info notice with the count. Errors never block loading.
**Rationale**: Spec assumption and FR-006: the user must be able to open a broken lab to fix it. `showIssues` is moved out of `Toolbar.tsx` into `store/showIssues.ts` so both call it.
**Alternatives**: Refuse labs with errors (user cannot repair a file in the app).

## 5. Unsaved-change tracking and the replace question
**Decision**: `fileStore.baseline` holds the document object from the last save, open, example load, or empty start. `dirty = document !== baseline` (reference check; undo back to the baseline object counts as clean). `replaceLab` asks `window.confirm` when dirty. `confirm` text says the current lab will be lost. After a confirmed replace, `loadDocument` clears history, the baseline is set to the new document, and the draft key is removed (the replaced lab is not kept, clarification).
**Rationale**: FR-008 with almost no code; no shared mutable "modified" flag to forget to set. Native `confirm` is accessible and needs no component.
**Alternatives**: A custom modal (more code for the same choice); a `modified` boolean flipped in every edit (easy to miss one path).

## 6. Lab id
**Decision**: `newLabId()` returns `LAB_ID_LENGTH` random hex characters, where `LAB_ID_LENGTH` is `LINUX_NAME.LAB_ID_CHARS` (4). `emptyLab()` builds an empty document with that id and is the store's initial document and the result of Discard. `openExample` replaces `lab.id` with a fresh id. `openFile` keeps the stored id.
**Rationale**: The derived Linux name uses only the first 4 characters of the id (research 013 §4), so a longer id would add no uniqueness. 4 hex characters is 65 536 values; a clash between two labs is possible but rare, and the deploy-time ownership check (NL-030) must still catch it.
**Alternatives**: UUID ids (the extra characters are ignored by the name derivation, and every example file ships a long id anyway).
**Open item**: The backend ticket should confirm the 4-character id length.

## 7. Drop a file on the canvas
**Decision**: In `Canvas.tsx` the existing drop handler first checks `dataTransfer.files`: one file → `openFile`; more than one → refuse with the "only one file" error; none → the palette path as before. Dragover keeps `preventDefault`.
**Rationale**: FR-002, FR-019, and palette drops keep working (they carry no files).
**Alternatives**: A separate drop zone overlay (extra UI for no gain).

## 8. File picker
**Decision**: `openFromPicker` creates an `<input type="file">` in code with no `accept` filter (any file can be chosen; the check is on content, per the spec), calls `click()`, and reads the first file on `change`.
**Rationale**: No hidden element to mount or style, and the size and count checks live in `openFile` where the drop also reaches them.
**Alternatives**: A hidden input component (extra component and ref).

## 9. Size limit
**Decision**: Refuse a file over `MAX_FILE_BYTES` (5 MB) before reading it, with a clear message.
**Rationale**: FR-018; a multi-megabyte JSON would block the page.

## 10. Autosave draft
**Decision**: `useAutosave` subscribes to `useTopologyStore`'s document; while `dirty` and the prompt is resolved, a 1 s debounce writes `JSON.stringify` of the document under `netlab.draft` using `safeStorage`. It never writes while a stored draft is waiting for a Restore or Discard answer. A clean document does not write. Save removes the draft (no unsaved work remains), and the first edit after a save writes a new one; replace and Discard also remove it.
**Rationale**: Reuses the existing safe storage wrapper, so blocked or full storage never throws (FR-009). One key, one lab.
**Alternatives**: Persist the topology store with the Zustand `persist` middleware (would also persist history and selection and could restore silently); IndexedDB (overkill for one small text).

## 11. Restore prompt
**Decision**: At start `readDraft()` reads the key, runs it through `parseLabFile`, and keeps it as `fileStore.pendingDraft` only if it parses and is not empty (has a node, interface, link, or a non-empty name). A modal `DraftPrompt` blocks the app until Restore (`replaceLab` without confirmation) or Discard (remove the key, keep the empty lab). Bad or empty drafts are removed silently.
**Rationale**: FR-010 and FR-011 with the same parser as files, so a damaged draft can never crash the app.
**Alternatives**: A non-blocking banner (the user could edit and overwrite the draft before answering).

## 12. Examples
**Decision**: Example files live in `examples/` at the repo root. `constants/examples.ts` imports each with Vite's `?raw` suffix (the dev server already allows `..` in `vite.config.ts`) and lists `{ id, label, description, needsM5, text }`. `needsM5` is metadata in the list, not in the lab file, so the file format stays unchanged. Loading uses `parseLabFile(text)` and then a fresh id. The router example sets an info notice "needs M5; you can view and edit it".
**Rationale**: FR-012 to FR-015 with the file format untouched; the same files are readable by any other tool.
**Alternatives**: Fetch from a server path (needs the files copied under `public/`); put readiness inside the file (would change the format).

## 13. Remove the startup seed
**Decision**: Delete the `bridge-lab.json` import and `loadDocument(migrate(exampleLab))` call from `main.tsx`; the app starts with `emptyLab()`.
**Rationale**: A non-empty seed would make "no prompt for an empty, never-edited lab" (US3/AC4) impossible and would hide stored drafts. The bridge lab is one click away in the Examples menu.
**Alternatives**: Keep the seed only in dev (two different start states hide bugs).

## 14. Project name
**Decision**: `ProjectNameField` uses the existing `useFieldDraft` and `validateLabName`, commits through `edit(renameLab)`, shows `DEFAULT_PROJECT_NAME` as text when the name is empty, and stays in step with the inspector's `LabNameField` because both read `document.lab.name`.
**Rationale**: FR-016 with no new rule and no second source of truth.
**Alternatives**: A separate project-name state (would drift from the lab name).

## 15. Round trip and checks without tests
**Decision**: `web/scripts/checkExamples.ts` (same style as `checkVectors.ts`) parses every file in `examples/`, validates it, prints issues, fails on any error-severity issue except for files named in a `NEEDS_M5` list, and checks `parseLabFile(serializeLab(doc))` equals the parsed document and that serializing twice gives the same text.
**Rationale**: Meets the ticket's round-trip acceptance by running a script by hand (constitution), covering SC-002 and FR-015.
**Alternatives**: Vitest (forbidden by the no-tests decision).
