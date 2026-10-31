# Feature Specification: Save, Load, and Example Labs

**Feature Branch**: `014-save-load` (directory name; work stays on the current git branch)

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "@TICKETS/NL-020-save-load.md"

## Clarifications

### Session 2026-10-31

- Q: Should a new lab or a loaded example get a fresh lab id, or keep the stored id? → A: A new lab and each loaded example get a fresh random id. A user's own saved file keeps its stored id, so save then open stays identical.
- Q: Should a lab replaced after the user confirms be kept anywhere? → A: No. It is lost once confirmed; the draft follows the opened lab from the next edit.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save a lab to a file and open it again (Priority: P1)

The user builds a lab and presses Save. The browser downloads a file named after the lab with the `.netlab.json` ending. Later the user presses Open, picks that file, and the same lab appears on the canvas, exactly as saved: nodes, interfaces, addresses, routes, links, lab name, and node positions. The user can also drag a file from the desktop and drop it on the canvas to open it.

**Why this priority**: Without save and open, every lab is lost when the page closes. This is the core value and the base for the other stories.

**Independent Test**: Build a lab with two namespaces, a bridge, two links, an address, and a route. Press Save. Clear the lab (or reload). Press Open and pick the file. The lab looks the same and a second Save produces a file with the same content.

**Acceptance Scenarios**:

1. **Given** a lab on the canvas, **When** the user presses Save, **Then** a `.netlab.json` file downloads, named from the lab name.
2. **Given** a saved file, **When** the user opens it through the file picker, **Then** the canvas shows the saved lab with the same nodes, links, names, addresses, routes, and positions.
3. **Given** a saved file, **When** the user drops it on the canvas, **Then** it opens the same way as through the picker.
4. **Given** a lab that was saved then opened, **When** it is saved again, **Then** the new file has the same content as the first (round trip is lossless).
5. **Given** an empty lab, **When** the user presses Save, **Then** a valid file with the empty lab downloads.
6. **Given** a lab is open, **When** the user opens a file, **Then** the opened lab replaces it, keeps the id stored in the file, and the undo history starts fresh.
7. **Given** the app starts with no draft, **When** the empty lab shows, **Then** it already has its own fresh random lab id, so a first Save never writes an empty id.

---

### User Story 2 - A bad file never destroys the current lab (Priority: P1)

The user opens a file that is not valid JSON, is not a NetLab file, or has a schema version this app does not know. The app shows a clear error that says what is wrong, and the lab on the canvas stays exactly as it was.

**Why this priority**: Losing work to a mistaken or damaged file is the worst failure of a load feature. It is part of the ticket's acceptance.

**Independent Test**: Build a lab. Open a text file with broken JSON: an error shows and the lab is unchanged. Open a file with `"schemaVersion": 99`: an error names the unknown version and the lab is unchanged.

**Acceptance Scenarios**:

1. **Given** a lab on the canvas, **When** the user opens a file with malformed JSON, **Then** an error says the file is not valid JSON and the lab is unchanged.
2. **Given** a lab on the canvas, **When** the user opens a file with a schema version the app does not support, **Then** an error names that version and the lab is unchanged.
3. **Given** a lab on the canvas, **When** the user opens a file with no schema version or the wrong shape, **Then** an error says it is not a NetLab file and the lab is unchanged.
4. **Given** an error is shown, **When** the user dismisses it or opens a good file, **Then** the app works normally.
5. **Given** a file that loads but has problems the validator finds (for example a duplicate name), **When** it is opened, **Then** the lab loads and the issues are shown in the issues list so the user can fix them.

---

### User Story 3 - Autosaved draft and restore prompt (Priority: P2)

While the user edits, the app keeps a draft copy in the browser. If the page is closed or reloaded with unsaved work, the next visit shows a prompt: restore the draft or start with an empty lab. If the browser blocks storage, the app keeps working without autosave.

**Why this priority**: It protects against accidental tab closes. It is secondary to explicit save.

**Independent Test**: Add a node, reload the page. A prompt offers to restore. Choose restore: the node is back. Reload again and choose discard: the lab is empty and the draft is gone.

**Acceptance Scenarios**:

1. **Given** the user edits a lab, **When** edits are made, **Then** a draft is kept in the browser within a few seconds.
2. **Given** a stored draft with content, **When** the app starts, **Then** a prompt offers Restore and Discard.
3. **Given** the prompt, **When** the user chooses Restore, **Then** the draft lab appears; **When** the user chooses Discard, **Then** the lab is empty and the draft is removed.
4. **Given** the lab is empty and has never been edited, **When** the app starts, **Then** no prompt shows.
5. **Given** the browser blocks storage or the draft is damaged, **When** the app starts or the user edits, **Then** the app works, shows no crash, and does not offer a restore.
6. **Given** the user just saved a file, **When** the app next starts with no edits since, **Then** no draft is offered (saving removes the draft); **Given** edits after a save, **Then** a new draft follows them and is offered as before.

---

### User Story 4 - Start from an example lab (Priority: P2)

The user opens an example library in the toolbar and picks one of three labs: a bridge lab, a direct link between two namespaces, or a router between two subnets. The router example is marked "needs M5" until the router features exist, and the user can still see it but is told it will not work yet. Picking an example loads it like an opened file.

**Why this priority**: Examples give new users a working start. They depend on load working (stories 1 and 2).

**Independent Test**: Open the library, pick the bridge lab: the canvas shows it. Pick the router lab: it is marked "needs M5" and loading it shows that note.

**Acceptance Scenarios**:

1. **Given** the toolbar, **When** the user opens the example library, **Then** it lists the bridge lab, the two-namespace direct link, and the router between two subnets, each with a short description.
2. **Given** the library, **When** the user picks an example, **Then** it loads on the canvas like an opened file, with a fresh lab id so two loads never share an id.
3. **Given** the router example, **When** it is listed, **Then** it is marked "needs M5".
4. **Given** each example, **When** it is validated, **Then** it has no validator errors (the router example may have a warning only if it is marked as not ready).
5. **Given** examples are plain files in the repository, **When** another tool reads them, **Then** they follow the same file format as a saved lab.

---

### User Story 5 - Edit the project name from the toolbar (Priority: P2)

The project name shows in the toolbar. The user clicks it, types a new name, and presses Enter. The name is saved in the document and is used for the saved file name.

**Why this priority**: The ticket's naming rule requires it, and it ties the saved file to a name the user chose. It does not block save and open.

**Independent Test**: Click the project name, type `office-net`, press Enter. Save: the file is `office-net.netlab.json`. Reload the file: the toolbar shows `office-net`.

**Acceptance Scenarios**:

1. **Given** the toolbar, **When** the user clicks the project name, **Then** it becomes editable.
2. **Given** an edit, **When** the user presses Enter or leaves the field, **Then** the new name is stored in the lab and shown; Escape cancels.
3. **Given** an empty or only-spaces name, **When** the user confirms, **Then** an error shows and the name is not changed (same rule as the lab name field).
4. **Given** a saved and reopened file, **When** it loads, **Then** the toolbar shows the saved name.
5. **Given** the name is changed here, **When** the user looks at the lab name field in the properties panel, **Then** both show the same name.
6. **Given** a name with characters not allowed in file names, **When** the user saves, **Then** the download file name is made safe and the stored name is not changed.

---

### Edge Cases

- Opening a file replaces the current lab; if the current lab has unsaved changes since the last save or open, the app asks the user to confirm first.
- A very large file (over a set size) is refused with a clear message instead of freezing the page.
- A file with the wrong extension but valid content opens (picker and drop); the check is on content, not the name.
- Dropping several files opens none and says only one file can be opened; dropping a non-file item does nothing.
- Dropping a file anywhere on the canvas works; dropping a palette part still creates a node as before.
- A file saved by a newer app version with an unknown schema version is refused with the version named.
- Missing optional parts (no layout, no routes) load with sensible empty defaults and are saved back unchanged in meaning.
- A lab loaded from an example is a copy: its id is new, so saving it twice from two loads gives two labs that never share deploy-time names.
- The draft does not overwrite a lab the user just opened from a file until the user edits again; the replaced lab is not kept as a draft.
- Two tabs open at once each keep their own state; the draft is shared, so the last write wins.
- Saving does not change the lab or its undo history.
- Selecting Save with errors in the lab still saves; the issues are not a reason to block it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The user MUST be able to save the current lab as a downloaded file with the ending `.netlab.json`, named from the lab name.
- **FR-002**: The user MUST be able to open a lab from a file chosen in a file picker, and by dropping one file onto the canvas.
- **FR-003**: Save then open MUST give a lab identical to the saved one in every stored field, including node positions and the lab name.
- **FR-004**: Opening a file MUST convert older supported schema versions to the current one before use, and MUST run the validator on the result.
- **FR-005**: A file with malformed JSON, an unknown or missing schema version, or the wrong shape MUST be refused with a clear error naming the cause, and the current lab and its undo history MUST stay unchanged.
- **FR-006**: A file that loads but has validator issues MUST load, and the issues MUST be shown in the issues list.
- **FR-007**: Opening a file MUST replace the current lab, clear selection, and start a fresh undo history.
- **FR-008**: If the current lab has changes since the last save, open, or example load, the app MUST ask for confirmation before replacing it. The confirmation MUST say the current lab will be lost; once confirmed, the replaced lab is not kept anywhere.
- **FR-009**: The app MUST keep an autosaved draft of the lab in the browser while the user edits; all browser storage access MUST tolerate failure without crashing or losing the lab on screen.
- **FR-010a**: Saving a file MUST remove the stored draft, since no unsaved work remains; the first edit after a save MUST start a new draft.
- **FR-010**: On start, if a non-empty draft exists, the app MUST offer Restore and Discard; Discard MUST delete the draft; an empty or never-edited lab MUST NOT trigger a prompt.
- **FR-011**: A damaged or unreadable draft MUST be ignored without a crash, without a restore offer, and without blocking the app.
- **FR-012**: The toolbar MUST provide an example library listing the bridge lab, the two-namespace direct link, and the router between two subnets, each with a name and short description.
- **FR-013**: Picking an example MUST load it the same way as opening a file, including the confirmation in FR-008, except that the loaded lab MUST get a fresh random lab id.
- **FR-013a**: A new empty lab MUST get a fresh random lab id when it is created (short, so a clash between two labs is rare but possible; the deploy-time ownership check catches it); opening a user's own file MUST keep the id stored in it.
- **FR-014**: The router example MUST be marked "needs M5" in the library and in the loaded lab's notice until the needed features exist.
- **FR-015**: Example labs MUST be plain files in the repository's `examples/` folder, in the same format as a saved lab, and each non-router example MUST validate with no errors.
- **FR-016**: The toolbar MUST show the project name and let the user edit it in place; the name MUST be stored in the lab, MUST use the same rules as the lab name field, and MUST stay in step with that field.
- **FR-017**: The downloaded file name MUST be derived from the lab name with characters unsafe for file names removed or replaced; an empty name MUST fall back to a default name; the stored name MUST NOT change.
- **FR-018**: Files larger than a stated limit MUST be refused with a clear message.
- **FR-019**: Only one file at a time MUST open; extra files in a drop MUST be refused with a message.
- **FR-020**: Save MUST NOT alter the lab, selection, or undo history, and MUST NOT be blocked by validator issues.
- **FR-021**: Per the project constitution, no automated test files are written; the round trip and the corrupted-file behavior MUST be verified by hand in the running app.

### Key Entities

- **Lab file**: A text file with a `.netlab.json` ending holding one lab document: schema version, lab id and name, nodes, interfaces, links, and layout.
- **Draft**: A copy of the lab kept in the browser while editing, offered back after a reload.
- **Example lab**: A ready-made lab file shipped in `examples/`, with a name, a short description, and a readiness note.
- **Load result**: Either a loaded lab (with any validator issues) or an error with a clear cause; never a partial change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can save a lab and open it again in under 30 seconds with no help.
- **SC-002**: In 100% of checks, save then open gives a lab identical to the original, and saving again gives the same file content.
- **SC-003**: In 100% of checks, opening a malformed, unsupported, or wrong-shape file shows an error within 1 second and leaves the current lab unchanged.
- **SC-004**: After a reload with unsaved work, the user can get the lab back in under 10 seconds with one choice.
- **SC-005**: A new user can start from an example lab in under 15 seconds.
- **SC-006**: A lab of 200 resources saves and opens in under 2 seconds.
- **SC-007**: The browser blocking storage never causes a crash or a lost on-screen lab in any check.

## Assumptions

- The lab format, its version conversion, the validator, undo history, and the lab name field from earlier features exist and are reused; the file format is the current lab document with no new fields.
- A file with validator issues still opens; the issues are for the user to fix, so the ticket's "runs the validator" is met by showing the issues, not by blocking.
- Autosave runs on every edit after a short pause (about 1 second); the draft holds one lab for the whole browser.
- "needs M5" refers to the milestone in which routers deploy; until then the router example is for viewing and editing only.
- The size limit for files is 5 MB, far above a normal lab.
- Backend saves arrive with a later ticket (NL-038) and replace the download flow; they are out of scope here.
- Browser support is desktop browsers with file download, file picker, and drag and drop.
- Per the project constitution, no test files are written; the ticket's round-trip and corrupted-file checks are done by hand.
