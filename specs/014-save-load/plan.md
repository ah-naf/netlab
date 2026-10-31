# Implementation Plan: Save, Load, and Example Labs

**Branch**: `014-save-load` (directory name; work stays on the current git branch) | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/014-save-load/spec.md`

## Summary

Make the toolbar real: **Save** downloads `<lab name>.netlab.json`, **Open** picks a file, dropping a file on the canvas opens it, an **Examples** menu loads shipped labs, and the project name becomes an inline editable field stored in `lab.name`. All file reading goes through one pure function, `parseLabFile(text)`, that returns a loaded lab or a named error (malformed JSON, not a NetLab file, unknown schema version) and never touches the current lab on failure. A small `fileStore` remembers the "saved" baseline so the app knows when a replace needs the confirmation. A debounced autosave writes a draft through the existing `safeStorage`; on start a modal offers Restore or Discard. A new lab and each loaded example get a fresh lab id; a user's own file keeps its id (clarification). The hard-coded startup seed in `main.tsx` is removed so a fresh start is an empty lab and the bridge lab becomes an example. Web only; no new dependencies; no tests (constitution), checked by `web/scripts/checkExamples.ts` and by hand.

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8; Node 22 for the check script

**Primary Dependencies**: Existing only: Zustand 5, `@xyflow/react`, Tailwind CSS 4. Browser APIs: `Blob` and an anchor `download`, `<input type="file">`, `DragEvent.dataTransfer.files`, `localStorage` (through `safeStorage`)

**Storage**: One browser key for the draft (`netlab.draft`). Files are plain JSON text. No schema change: the file is the current `Document`

**Testing**: None, per the constitution. `node web/scripts/checkExamples.ts` validates every example and checks the parse and serialize round trip; the rest is by hand in [quickstart.md](quickstart.md)

**Target Platform**: Desktop browsers with file download, file picker, and drag and drop; minimum width 1024 px

**Project Type**: Web application (web side only; backend saves are NL-038)

**Performance Goals**: A 200-resource lab saves and opens in under 2 s (SC-006); error within 1 s (SC-003). All steps are a single JSON parse or stringify plus one validator run

**Constraints**: Theme tokens only; every text, key, limit, delay, and extension is a named constant; functions under 100 lines; storage access only through `safeStorage`; `parseLabFile` and the filename helper are pure (no DOM, no store) so a script can run them

**Scale/Scope**: 2 new constants files, 4 store modules, 1 hook, 5 small components, 2 example files, 1 script, edits to `Toolbar`, `Canvas`, `AppShell`, `layout` constants, `topologyStore` (empty-lab id), `main.tsx`

## Constitution Check

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only. |
| II. Simple, concise code | Pass. Native `confirm` for the replace question; dynamic file input instead of extra components; no new dependency. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. Parse, serialize, file name, load, save, open, drop, and autosave are separate small functions. |
| IV. No magic strings | Pass. Messages, storage key, delay, size limit, extension, MIME types, and default names are constants in `constants/labFile.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Logic in `store`, constants in `constants`, UI in `components`, the autosave in `hooks`, examples in `examples/`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Tests: none, by constitution; hand checks in [quickstart.md](quickstart.md). Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/014-save-load/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── file-format.md
│   └── ui-contract.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
examples/
├── bridge-lab.json              # exists
├── direct-link.json             # new: two namespaces, one link
└── router-two-subnets.json      # new: router between two subnets (needs M5)

web/
├── scripts/checkExamples.ts     # validate each example (errors), round trip, print
└── src/
    ├── constants/
    │   ├── labFile.ts           # extension, MIME, size limit, delay, storage key, texts, default names
    │   └── examples.ts          # EXAMPLES list: id, label, description, needsM5, raw text (import ?raw)
    ├── types/labFile.ts         # LoadResult, LabExample, Notice
    ├── store/
    │   ├── labFile.ts           # parseLabFile, serializeLab, downloadName, newLabId, emptyLab (pure)
    │   ├── fileStore.ts         # baseline, notice, pending draft, draftReady
    │   ├── labActions.ts        # saveLab, openFromPicker, openFile, openExample, replaceLab, restoreDraft, discardDraft
    │   ├── showIssues.ts        # moved from Toolbar: open the Issues tab
    │   └── topologyStore.ts     # edit: initial document uses emptyLab()
    ├── hooks/useAutosave.ts     # debounce document to the draft key while dirty
    └── components/
        ├── Toolbar.tsx          # edit: Save, Open, Examples, ProjectNameField
        ├── ProjectNameField.tsx # inline editable name (useFieldDraft + validateLabName)
        ├── ExampleMenu.tsx      # button + menu of examples, "needs M5" badge
        ├── FileNotice.tsx       # dismissible error or info banner over the canvas
        ├── DraftPrompt.tsx      # modal: Restore or Discard
        ├── Canvas.tsx           # edit: drop a file opens it
        └── AppShell.tsx         # edit: mount FileNotice, DraftPrompt, useAutosave
```

`main.tsx` loses the `bridge-lab.json` seed; `layout.ts` `FILE_ACTIONS` gains enabled Save and Open.

**Structure Decision**: Web application, web side only. Pure helpers in `store/labFile.ts` are importable by a plain Node script (explicit `.ts` imports, same rule as the validator). DOM and store work lives in `labActions.ts`.
