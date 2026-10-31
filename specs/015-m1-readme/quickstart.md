# Quickstart: Verify the README (hand check)

Do this on a clean checkout, or have a second person do it, following only `README.md`.

## 1. Clean checkout
```bash
git clone . /tmp/netlab-clean && cd /tmp/netlab-clean   # run the clone from the repo root
cp ../path/to/working/README.md README.md                # a clone has only committed files: copy the new README in unless it is committed
```
Use a machine or shell where `web/node_modules` and Go caches are not already warm if you can; at least do not rely on files outside the clone.

## 2. Follow the README top to bottom
1. Check each prerequisite with its check command; record the versions.
2. Run the quick start commands exactly as written, from the folders stated.
3. Open the URL. Confirm: empty canvas, indicator text matches what the README says. Drag two namespaces and a bridge onto the canvas, link them, press **Validate**, press **Save**: a `.netlab.json` file downloads.
4. Stop the API and reload: the indicator reads **API offline** and the canvas still works (frontend alone).
5. Start a second dev server on port 5173 to confirm the busy-port message; stop it.

## 3. Run every check in the README's table
Run each command from the root; confirm the stated pass result and exit code 0: `make build`, `make lint`, `node web/scripts/checkVectors.ts`, `node web/scripts/checkExamples.ts`, `scripts/check-env.sh`, `make sandbox-test`.

## 4. Scan for rule breaks
```bash
grep -n "sudo" README.md          # expect only the sentence that says no command uses sudo
grep -no "make [a-z-]*" README.md | sort -u   # every target must exist in the Makefile
grep -n "scripts/" README.md      # every script must exist
```
Open the README on the hosting site and confirm the Mermaid diagram renders; confirm the plain list under it says the same thing.

## 5. Second reader (SC-001, SC-004, SC-005)
Give the README to one person who has not seen the project. Time them from clone to the canvas (under 10 minutes). Ask them to name the five architecture parts after reading the first screen (at least four) and whether following it needs root (no). Note any question they had to ask.

## 6. Record
Write the versions, times, and any README change you had to make into the pull request description. Done when every step matches.

Contract: [readme-contract](contracts/readme-contract.md).
