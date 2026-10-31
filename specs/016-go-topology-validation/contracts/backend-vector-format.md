# Contract: Backend-only vectors

Folder `testdata/validation/backend/`. Read only by `api/cmd/vectorcheck`; the editor's script reads only the top-level folder and never sees these.

```json
{
  "description": "a derived name is already owned by another lab",
  "document": { "schemaVersion": 1, "lab": { "id": "a1b2", "name": "t" }, "nodes": [], "interfaces": [], "links": [] },
  "existingNames": [ { "name": "nl-a1b2-ns1", "labId": "zzzz-other" } ],
  "expectedCodes": ["NAME_CONFLICT_EXISTING"]
}
```

- `existingNames` is optional; missing or empty skips the existing-name check.
- `expectedCodes` is compared as a sorted multiset, like the shared vectors.
- File names: `<code-lowercase-kebab>-fail.json` and `-ok.json`. Required: both for `UNSUPPORTED_NODE_TYPE` and `NAME_CONFLICT_EXISTING`, plus `name-conflict-existing-ok-own-lab.json` (same lab owns the name), `name-conflict-existing-ok-no-prefix.json` (name without `nl-` is ignored), and `name-conflict-existing-ok-empty-set.json` (check skipped).
- A conflict vector uses two labs whose ids share the first four characters, for example `a1b2-one` and `a1b2-two`, so the derived names are equal while the full ids differ.

Shared top-level additions (both sides read): `interface-name-length-fail-bytes.json` (8 times `é`, 16 bytes, expects `INTERFACE_NAME_LENGTH`), `interface-name-length-ok-bytes.json` (7 times `é`, 14 bytes, expects none), `linux-name-collision-fail-nonascii.json` (two long non-ASCII names that shorten to the same name), and `linux-name-collision-ok-nonascii.json`.
