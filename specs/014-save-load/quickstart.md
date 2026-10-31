# Quickstart: Save, Load, and Example Labs (hand checks)

Prerequisites: `cd web && npm install && npm run dev`; open the app; hard-reload. Clear the site's local storage once for a clean start.

## 1. Scripts (FR-015, SC-002)
From the repo root: `node web/scripts/checkExamples.ts`. Expect one `ok` line per example, the router example marked "needs M5", and exit code 0. Also run `node web/scripts/checkVectors.ts` (unchanged) to confirm the validator still passes.

## 2. Save and open (US1)
1. Start: the canvas is empty; no restore prompt.
2. Add two namespaces and a bridge, link them, add an address and a route, name the project `office-net`.
3. Press **Save**. A file `office-net.netlab.json` downloads.
4. Reload the page; at the restore prompt choose **Discard**. The lab is empty.
5. Press **Open** and pick the file. The lab appears with the same nodes, links, addresses, route, positions, and the name `office-net` in the toolbar.
6. Press **Save** again. Compare the two files: identical text (`diff` or `cmp`).
7. Drag the file onto the canvas: it opens the same way (confirm prompt if the lab is dirty).

## 3. Bad files (US2, SC-003)
With a lab on the canvas, open each of these (create them with a text editor) and confirm an error banner and an unchanged lab:
- a file containing `{ not json`;
- `{"hello": 1}` (not a lab);
- a saved file edited to `"schemaVersion": 99` (names version 99).
Then open a saved file edited to have two nodes with the same name: it loads and the Issues tab shows the duplicate.

## 4. Draft (US3, SC-004, SC-007)
1. Add a node. Wait 2 seconds. Reload: the restore prompt appears. Choose **Restore**: the node is back.
2. Reload again, choose **Discard**: the lab is empty and the next reload shows no prompt.
   Then add a node, wait 2 seconds, press **Save**, reload: no prompt (saving removes the draft). Add another node, wait 2 seconds, reload: the prompt appears again.
3. In DevTools set `localStorage.setItem` to throw (or block site data) and edit: no crash, no prompt on reload.
4. Put `not json` under the key `netlab.draft` and reload: no crash, no prompt.

## 5. Examples (US4, SC-005)
Open **Examples**: three entries, the router marked "needs M5". Pick the bridge lab: it loads (confirm if dirty). Pick the router lab: it loads with the "needs M5" notice. Load the bridge lab twice, save each, and compare `lab.id` in the two files: different.

## 6. Project name (US5)
Click the project name, type `   ` and press Enter: error, name unchanged. Type `a/b:c` and Save: the file name is `a_b_c.netlab.json`, the stored name is still `a/b:c`. Change the name in the properties panel Lab name field: the toolbar follows.

## 7. Speed (SC-006)
`checkExamples.ts` times save and parse of a generated 200-resource lab and fails at 2000 ms or more; expect a few milliseconds.

Contracts: [file-format](contracts/file-format.md), [ui-contract](contracts/ui-contract.md).
