---

description: "Task list for Save, Load, and Example Labs"
---

# Tasks: Save, Load, and Example Labs

**Input**: Design documents from `/specs/014-save-load/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/file-format.md, contracts/ui-contract.md

**Tests**: None. The constitution says no tests are written. Acceptance is by hand: `node web/scripts/checkExamples.ts` (task T027) plus the steps in quickstart.md.

**Code rules** (constitution): shortest clear code, no magic strings (every text, key, limit, delay, extension, and MIME type is a named constant in `constants/labFile.ts`), functions under 100 lines, minimal comments, files in the folder that matches their job. Use the ponytail skill for coding and the frontend-design skill for UI tasks. Do not commit unless the user asks.

**Pure-module rule**: `src/store/labFile.ts` imports only types and plain constants (no React, no Zustand store, no DOM) and every relative import ends in `.ts`, so `web/scripts/checkExamples.ts` runs under plain Node. Do not use path aliases there.

**Storage rule**: browser storage is touched only through `safeStorage` (`src/store/safeStorage.ts`); never call `localStorage` directly.

**Crash rule**: any `useTopologyStore` or `useFileStore` selector that returns an array or object MUST be wrapped in `useShallow` from `zustand/react/shallow`.

**UI rule**: theme tokens only; never color alone; match the existing toolbar and canvas look; follow [contracts/ui-contract.md](contracts/ui-contract.md).

## Format: `[ID] [P?] [Story] Description`

All paths are under `web/` unless stated otherwise.

## Phase 1: Setup

**Purpose**: Names and types every later task uses.

- [X] T001 [P] Create `src/constants/labFile.ts` with: `FILE_EXTENSION = ".netlab.json"`, `FILE_MIME = "application/json"`, `MAX_FILE_BYTES = 5 * 1024 * 1024` ("Max size accepted: 5 MB"), `DRAFT_STORAGE_KEY = "netlab.draft"`, `DRAFT_DELAY_MS = 1000`, `DEFAULT_FILE_NAME = "untitled-lab"`, `LAB_ID_LENGTH = LINUX_NAME.LAB_ID_CHARS` (import `LINUX_NAME` from `./validation.ts`, 4 characters), `UNSAFE_FILE_CHARS = /[\\/:*?"<>|\u0000-\u001f]/g`, `FILE_NAME_FILLER = "_"`, `NEEDS_M5_FILES = ["router-two-subnets.json"]`; `LOAD_ERROR` texts exactly per `contracts/file-format.md`: `NOT_JSON = "This file is not valid JSON."`, `NOT_A_LAB = "This file is not a NetLab lab file."`, `unsupportedVersion(version) => "This file uses schema version ${version}, which this app does not support."`, `TOO_LARGE = "This file is too large to open (limit 5 MB)."`, `MANY_FILES = "Only one file can be opened at a time."`, `UNREADABLE = "This file could not be read."`; texts `REPLACE_CONFIRM = "This will replace the current lab. Unsaved changes will be lost. Continue?"`, `issuesLoadedText(count) => "${count} issues found; see the Issues tab."`, `NEEDS_M5_NOTICE = "This example needs M5 to deploy; you can view and edit it."`, `NEEDS_M5_BADGE = "needs M5"`, `DISMISS_LABEL = "Dismiss"`, `SAVE_LABEL = "Save"`, `OPEN_LABEL = "Open"`, `EXAMPLES_LABEL = "Examples"`, `DRAFT_TITLE = "Restore your unsaved lab?"`, `RESTORE_LABEL = "Restore"`, `DISCARD_LABEL = "Discard"`, `draftSummary(name, nodeCount)` (name or "Untitled lab", then the node count). Keep `import`s with `.ts` extensions
- [X] T002 [P] Create `src/types/labFile.ts` with `LoadResult = { ok: true; document: Document } | { ok: false; error: string }` ("Never partial"), `NoticeKind = "error" | "info"`, `Notice { kind: NoticeKind; text: string }`, and `LabExample { id: string; label: string; description: string; needsM5: boolean; text: string }`; import `Document` as a type from `./topology.ts`

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: The pure file helpers, the saved-baseline store, and the one function that replaces the lab.

**CRITICAL**: No story starts before this phase is done.

- [X] T003 Create `src/store/labFile.ts` (pure, see Pure-module rule) exporting: `newLabId()` returning `LAB_ID_LENGTH` random lowercase hex characters (`crypto.randomUUID().replaceAll("-", "").slice(0, LAB_ID_LENGTH)`); `emptyLab(): Document` (`schemaVersion: CURRENT_VERSION`, `lab: { id: newLabId(), name: "" }`, empty `nodes`, `interfaces`, `links`); `isEmptyLab(document)` true when there is no node, interface, or link and `lab.name.trim()` is empty; `serializeLab(document)` returning `JSON.stringify(document, null, 2)` plus one trailing newline ("Text: `JSON.stringify(document, null, 2)` plus one trailing newline"); `downloadName(labName)` replacing each match of `UNSAFE_FILE_CHARS` with `FILE_NAME_FILLER`, trimming spaces and leading dots, using `DEFAULT_FILE_NAME` when the result is empty, then appending `FILE_EXTENSION`; `parseLabFile(text): LoadResult` per `contracts/file-format.md`: `JSON.parse` failure gives `LOAD_ERROR.NOT_JSON`; a value that is not an object, or `schemaVersion` missing or not a number, or `lab` not an object with string `id` and string `name`, or `nodes`, `interfaces`, or `links` present and not an array, or any element of them with the wrong shape (a node without string `id`, `name`, `type`; an interface without string `id`, `nodeId`, `name`; a link without string `id`, `endpointA`, `endpointB`; any element that is not an object) gives `LOAD_ERROR.NOT_A_LAB` (a wrong-shaped element would crash the canvas after the lab was replaced, so the guard runs before anything is replaced); then call `migrate()` from `../types/topologyDocument.ts` and on a thrown error return `LOAD_ERROR.unsupportedVersion(<schemaVersion read from the parsed value>)`; on success return `{ ok: true, document }`. Depends on T001, T002
- [X] T004 Edit `src/store/topologyStore.ts`: remove the `EMPTY_DOCUMENT` constant and make the initial `document` come from `emptyLab()` (import from `./labFile`), so a new lab has its own unique id ("A new empty lab MUST get a unique lab id when it is created"). Depends on T003
- [X] T005 [P] Create `src/store/fileStore.ts` (Zustand, same style as `validationStore.ts`) with state `baseline: Document` (initial: `useTopologyStore.getState().document`), `notice: Notice | null` (null), `pendingDraft: Document | null` (null), `draftReady: boolean` (false) and actions `setBaseline(document)`, `setNotice(notice | null)`, `setPendingDraft(document | null)`, `setDraftReady(ready)`; also export `isDirty()` returning `useTopologyStore.getState().document !== useFileStore.getState().baseline` (reference check: "dirty = document !== baseline"). Depends on T002, T004
- [X] T006 [P] Create `src/store/showIssues.ts` exporting `showIssues()` with the exact body that is now in `src/components/Toolbar.tsx` (set the validation store open, expand the drawer only if `drawerCollapsed` is true by calling `toggleDrawer`, set the active tab to `DRAWER_TAB_ID.ISSUES`); edit `Toolbar.tsx` to import it and delete the local copy
- [X] T007 Create `src/store/labActions.ts` with `replaceLab(document: Document, options?: { markClean?: boolean; notice?: string; confirm?: boolean })`: when `confirm` is not false and `isDirty()`, call `window.confirm(REPLACE_CONFIRM)` and return false if the user cancels; then `useTopologyStore.getState().loadDocument(document)` (clears selection and undo history), `safeStorage.removeItem(DRAFT_STORAGE_KEY)` ("the replaced lab is not kept anywhere"), set the baseline to the loaded document unless `markClean === false`, run `validate(document)` from `./validation/validate`, and set one info notice built from `options.notice` and, when issues exist, `issuesLoadedText(issues.length)` (joined with a space; no notice if both are empty), calling `showIssues()` when issues exist; return true. Also export `loadFromText(text, options?)`: `parseLabFile(text)`; on `ok: false` set an error notice with the message and return false without touching the lab, selection, history, baseline, or draft ("On any error the current lab ... stay as they were"); on success call `replaceLab(result.document, options)`. Depends on T003, T005, T006

**Checkpoint**: `npm run build` passes; `loadFromText("{ not json")` leaves the lab unchanged and sets an error notice.

---

## Phase 3: User Story 1 - Save a lab to a file and open it again (Priority: P1)

**Goal**: Save downloads `<name>.netlab.json`; Open and drag-and-drop load a file; the lab round-trips exactly.

**Independent test**: quickstart.md section 2.

- [X] T008 [US1] In `src/store/labActions.ts` add `saveLab()`: build `new Blob([serializeLab(document)], { type: FILE_MIME })` from the current document, create an object URL, click a temporary `<a>` with `download = downloadName(document.lab.name)`, revoke the URL, then `useFileStore.getState().setBaseline(document)` and `safeStorage.removeItem(DRAFT_STORAGE_KEY)` ("Saving a file MUST remove the stored draft"). It MUST NOT change the document, selection, or undo history, and MUST NOT be blocked by validator issues ("Save MUST NOT alter the lab, selection, or undo history"). Depends on T007
- [X] T009 [US1] In `src/store/labActions.ts` add `openFile(file: File)`: if `file.size > MAX_FILE_BYTES` set an error notice `LOAD_ERROR.TOO_LARGE` and return; read with `await file.text()` inside try/catch (failure sets `LOAD_ERROR.UNREADABLE`); then `loadFromText(text)`. Add `openFiles(files: FileList | File[])`: more than one file sets an error notice `LOAD_ERROR.MANY_FILES` and opens none; exactly one calls `openFile`; none does nothing. Add `openFromPicker()`: create `<input type="file">` in code with no `accept` filter (any file may be chosen, the check is on content), on `change` call `openFiles(input.files ?? [])`, then `input.click()`. Depends on T008
- [X] T010 [US1] Edit `src/constants/layout.ts`: in `FILE_ACTIONS` make `save` enabled (`id: "save"`, label `SAVE_LABEL`, `enabled: true`, `disabledReason: ""`) and add an enabled `open` action (label `OPEN_LABEL`) between Save and Validate; add `SAVE_ACTION_ID = "save"` and `OPEN_ACTION_ID = "open"` constants next to `VALIDATE_ACTION_ID`. Edit `src/components/Toolbar.tsx` so `ACTION_HANDLERS` maps `SAVE_ACTION_ID` to `saveLab` and `OPEN_ACTION_ID` to `openFromPicker` (imports from `../store/labActions`). Depends on T009
- [X] T011 [US1] Edit `src/components/Canvas.tsx`: in `dropPart`, before the palette check, if `event.dataTransfer.files.length` is not zero call `event.preventDefault()` and `openFiles(event.dataTransfer.files)` and return; the palette path stays unchanged ("a palette part still creates a node as before"). Depends on T009
- [X] T012 [US1] Edit `src/main.tsx`: delete the `bridge-lab.json` import, the `migrate` import, and the `loadDocument(migrate(exampleLab))` call so the app starts with the empty lab ("Remove the startup seed"). Keep the `useTopologyStore` import only if still used. Depends on T004

**Checkpoint**: Save a lab, reload, Open the file: identical lab; Save again gives a file with the same text; a dropped file opens too.

---

## Phase 4: User Story 2 - A bad file never destroys the current lab (Priority: P1)

**Goal**: Every failure shows a clear, dismissible message and leaves the lab alone.

**Independent test**: quickstart.md section 3.

- [X] T013 [P] [US2] Create `src/components/FileNotice.tsx`: reads `notice` from `useFileStore`; renders nothing when null; an `error` notice uses `role="alert"` with a red (`led-fault`) border, an `info` notice uses `role="status"` with the neutral `rule` border; shows the text and a **Dismiss** button (`DISMISS_LABEL`) that calls `setNotice(null)`; positioned like `LinkNotice` (top centre of the canvas, `absolute z-10`) but it stays until dismissed ("Stays until dismissed or replaced"). Depends on T005
- [X] T014 [US2] Edit `src/components/Canvas.tsx` to render `<FileNotice />` next to `<LinkNotice … />` inside the canvas container. Depends on T013
- [X] T015 [US2] Confirm by reading `src/store/labActions.ts` that every failure path (`loadFromText` error, size, many files, unreadable) sets only the notice and calls neither `loadDocument`, `setBaseline`, nor `safeStorage.removeItem`; and that a successful load replaces any older notice; fix any path that does not. Depends on T007, T009

**Checkpoint**: malformed JSON, `{"hello":1}`, and `"schemaVersion": 99` each show their message and leave the lab unchanged; a file with a duplicate name loads and the Issues tab shows it.

---

## Phase 5: User Story 3 - Autosaved draft and restore prompt (Priority: P2)

**Goal**: A draft follows edits; a reload offers Restore or Discard; storage failure never crashes.

**Independent test**: quickstart.md section 4.

- [X] T016 [US3] In `src/store/labActions.ts` add `initDraft()`: read `safeStorage.getItem(DRAFT_STORAGE_KEY)`; if null, `setDraftReady(true)`; else `parseLabFile(text)`: on success and `!isEmptyLab(document)` call `setPendingDraft(document)` (leave `draftReady` false); otherwise remove the key and `setDraftReady(true)` (bad or empty drafts are removed silently, never an error). Add `restoreDraft()`: take `pendingDraft`, call `replaceLab(draft, { confirm: false, markClean: false })` (the restored lab stays dirty), then `setPendingDraft(null)` and `setDraftReady(true)`. Add `discardDraft()`: remove the key, `setPendingDraft(null)`, `setDraftReady(true)`. Depends on T007
- [X] T017 [US3] Edit `src/main.tsx` to call `initDraft()` once before `createRoot(...).render(...)`. Depends on T016
- [X] T018 [P] [US3] Create `src/hooks/useAutosave.ts`: select `document` from `useTopologyStore`, and `baseline` and `draftReady` from `useFileStore`; in a `useEffect` return early unless `draftReady` and `document !== baseline`; otherwise `setTimeout(() => safeStorage.setItem(DRAFT_STORAGE_KEY, serializeLab(document)), DRAFT_DELAY_MS)` and clear the timer in the cleanup ("It never writes while a stored draft is waiting for a Restore or Discard answer. A clean document does not write"). Depends on T005, T003
- [X] T019 [US3] Create `src/components/DraftPrompt.tsx`: renders nothing unless `pendingDraft` is set; a modal (`role="dialog"`, `aria-modal`, labelled by its title) over the app with a dimmed backdrop, title `DRAFT_TITLE`, text from `draftSummary(pendingDraft.lab.name, pendingDraft.nodes.length)`, and two buttons: **Restore** (primary, `signal` accent, gets initial focus) calling `restoreDraft` and **Discard** calling `discardDraft`; focus stays inside by an `onKeyDown` on the dialog that, on Tab, moves focus from the last button to the first and on Shift+Tab from the first to the last (only these two buttons are focusable); no Escape handler ("No Escape shortcut (the choice is explicit)"). Depends on T016
- [X] T020 [US3] Edit `src/components/AppShell.tsx`: call `useAutosave()` and render `<DraftPrompt />` at the end of the shell. Depends on T018, T019

**Checkpoint**: add a node, wait 2 s, reload: the prompt shows; Restore brings the node back; Discard empties the lab and the next reload shows no prompt; a throwing or blocked storage never crashes.

---

## Phase 6: User Story 4 - Start from an example lab (Priority: P2)

**Goal**: An Examples menu loads shipped labs; the router lab is marked "needs M5".

**Independent test**: quickstart.md section 5.

- [X] T021 [P] [US4] Create `examples/direct-link.json` in the current lab format (schema version 1): lab `{ "id": "lab-direct", "name": "Direct link" }`; namespaces `ns1` and `ns2` (role `host`); one interface `eth0` each with addresses `10.0.0.1/24` and `10.0.0.2/24`; one `veth` link between them (`mtu` 1500, `state` `up`); `layout` positions for both nodes. Same style and key order as `examples/bridge-lab.json`
- [X] T022 [P] [US4] Create `examples/router-two-subnets.json`: lab `{ "id": "lab-router", "name": "Router between two subnets" }`; namespaces `ns1` (host, `eth0` `10.0.1.10/24`, default route via gateway `10.0.1.1` on `eth0`), `r1` (role `router`, `router: { "forwarding": true }`, `eth0` `10.0.1.1/24` and `eth1` `10.0.2.1/24`), and `ns2` (host, `eth0` `10.0.2.10/24`, default route via `10.0.2.1`); two `veth` links `ns1`-`r1` and `r1`-`ns2`; `layout` positions. Must have no validator errors
- [X] T023 [US4] Create `src/constants/examples.ts`: import each example with Vite's raw suffix (for example `import bridgeText from "../../../examples/bridge-lab.json?raw"`; `vite.config.ts` already allows `..`), and export `EXAMPLES: readonly LabExample[]` with entries `{ id: "bridge-lab", label: "Bridge lab", description: "Two namespaces on one bridge", needsM5: false, text }`, `{ id: "direct-link", label: "Direct link", description: "Two namespaces joined by one link", needsM5: false, text }`, `{ id: "router-two-subnets", label: "Router between two subnets", description: "A router joins two subnets", needsM5: true, text }`; derive `needsM5` from `NEEDS_M5_FILES.includes("<file name>")` so the script and the app share one list; add a `declare module "*.json?raw"` type to `src/vite-env.d.ts` if `tsc` needs it. Depends on T001, T002, T021, T022
- [X] T024 [US4] In `src/store/labActions.ts` add `openExample(example: LabExample)`: `parseLabFile(example.text)`; on failure set the error notice and stop; on success `replaceLab({ ...document, lab: { ...document.lab, id: newLabId() } }, { notice: example.needsM5 ? NEEDS_M5_NOTICE : undefined })` ("a fresh lab id so two loads never share an id"). Depends on T023, T007
- [X] T025 [P] [US4] Create `src/components/ExampleMenu.tsx`: a toolbar button (`EXAMPLES_LABEL`, same style as `DisabledButton` enabled) with `aria-haspopup="menu"` and `aria-expanded`; clicking toggles a `role="menu"` list under it with one `role="menuitem"` button per `EXAMPLES` entry showing the label, the description in muted text, and a `NEEDS_M5_BADGE` pill for `needsM5`; picking an item calls `openExample` and closes; Escape and a click outside also close it; items are reachable by keyboard. Depends on T024
- [X] T026 [US4] Edit `src/components/Toolbar.tsx` to render `<ExampleMenu />` in the file group, after the Open button and before Validate. Depends on T025
- [X] T027 [US4] Create `scripts/checkExamples.ts` in the style of `scripts/checkVectors.ts` (explicit `.ts` imports, `node:fs`): read every `*.json` in `../examples/` (resolve relative to the script), `parseLabFile` it, `validate()` it, print one line per file (`ok`, or the issue codes), and exit 1 if a file fails to parse, if a file not in `NEEDS_M5_FILES` has any error-severity issue, if `parseLabFile(serializeLab(document))` is not deep-equal to the document (compare `JSON.stringify` of both), or if `serializeLab` of the reparsed document differs from the first text ("Save then open then save gives the same text"); also fail if any of the three required file names is missing. Also in this script: (a) build in memory a 200-resource lab (70 nodes, 100 interfaces, 30 links, like `checkVectors.ts`), time `serializeLab` plus `parseLabFile` on it, print the milliseconds, and fail at 2000 ms or more ("under 2 seconds", SC-006); (b) feed `parseLabFile` these bad inputs and fail unless each returns `ok: false` with the stated message: `{ not json` (`NOT_JSON`), `{"hello":1}` (`NOT_A_LAB`), `{"schemaVersion":1,"lab":{"id":"","name":""},"nodes":[1],"interfaces":[],"links":[]}` (`NOT_A_LAB`), and a valid lab with `schemaVersion` 99 (`unsupportedVersion(99)`) Depends on T003

**Checkpoint**: the menu lists three entries; the bridge lab loads; the router lab loads with the "needs M5" notice; two loads of the same example save with different `lab.id`; `node web/scripts/checkExamples.ts` exits 0.

---

## Phase 7: User Story 5 - Edit the project name from the toolbar (Priority: P2)

**Goal**: The toolbar name is editable and is the lab name.

**Independent test**: quickstart.md section 6.

- [X] T028 [P] [US5] Create `src/components/ProjectNameField.tsx`: reads `document.lab.name`; uses `useFieldDraft` with `fieldKey: "project-name"`, `rule: validateLabName` (from `../store/fieldRules`), and `onCommit: (value) => edit((d) => renameLab(d, value))` (`renameLab` is in `../store/namespaceOps`); shows the name as a button-like text (muted `DEFAULT_PROJECT_NAME` when the name is empty) that becomes an input on click or focus; Enter or blur commits through `confirm`; Escape calls `cancel` and leaves edit mode; an invalid draft shows the error text under the input in the `led-fault` color and is never stored ("an invalid (empty) name shows the error text under the field and is not stored")
- [X] T029 [US5] Edit `src/components/Toolbar.tsx`: replace the `<span …>{DEFAULT_PROJECT_NAME}</span>` with `<ProjectNameField />` and drop the now-unused `DEFAULT_PROJECT_NAME` import there (the constant stays in `constants/layout.ts`, used by the field). Depends on T028

**Checkpoint**: click the name, type `   `, Enter: error, name unchanged; type `a/b:c`, Save: file `a_b_c.netlab.json`; the properties panel Lab name field follows the toolbar.

---

## Phase 8: Polish & Cross-Cutting

- [X] T030 Run `npm run lint`, `npm run format:check`, and `npm run build` in `web/`; fix every error (functions under 100 lines, no magic strings, `.ts` imports in `store/labFile.ts`)
- [X] T031 Run `node web/scripts/checkExamples.ts` and `node web/scripts/checkVectors.ts` from the repo root; both must exit 0
- [ ] T032 Run all of quickstart.md by hand in the running app (sections 2 to 7), including the corrupt-file and blocked-storage checks; record any failure and fix it
- [X] T033 [P] Check for dead code: no leftover `EMPTY_DOCUMENT`, no unused constant in `constants/labFile.ts`, no unused import in `Toolbar.tsx` or `main.tsx`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → stories. T003 needs T001 and T002; T007 needs T003, T005, T006.
- **US1** (T008–T012) needs Phase 2; MVP is Phase 1 + 2 + US1 with US2.
- **US2** (T013–T015) needs T005 and T007; it is quick and ships with US1.
- **US3** needs T007; independent of US4 and US5.
- **US4** needs T007 and the pure helpers; independent of US3 and US5.
- **US5** needs only the existing field hooks; T028 can start any time after Phase 1, but T029 edits `Toolbar.tsx`.
- **Toolbar order**: T006, T010, T026, and T029 all edit `src/components/Toolbar.tsx`, so they run one after another in that order, never in parallel.
- Polish last.

### Parallel opportunities

- Setup: T001, T002.
- Foundational: T005 and T006 together after T004.
- US2: T013 any time after T005.
- US3: T018 with T016.
- US4: T021, T022, and T025 together (T025 after T024).
- US5: T028 any time (T029 follows the Toolbar order above).

## Implementation Strategy

1. **MVP**: Phases 1–2, then US1 and US2 (save, open, drop, error notice).
2. Add US3 (draft and restore), then US4 (examples).
3. Add US5 (project name).
4. Finish with Polish: scripts exit 0 and quickstart checked by hand.
