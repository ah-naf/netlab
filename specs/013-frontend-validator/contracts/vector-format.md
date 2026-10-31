# Contract: Shared validation vectors

Folder: `testdata/validation/`. One JSON file per case. Consumed by `web/scripts/checkVectors.ts` and by the Go tests in NL-030. Names: `<code-lowercase-kebab>-fail.json`, `<...>-ok.json`; combined cases may use a descriptive name.

```json
{
  "description": "two namespaces share a name",
  "document": { "schemaVersion": 1, "lab": { "id": "a1b2", "name": "t" }, "nodes": [], "interfaces": [], "links": [] },
  "expectedCodes": ["DUPLICATE_NODE_NAME"]
}
```

- `document` is a full lab document in the current schema.
- `expectedCodes` is the list of issue codes the validator must return, compared as a sorted multiset (order and message text do not matter; each repeat counts).
- A clean case has `"expectedCodes": []`.
- Every code in [issue-codes.md](issue-codes.md) has at least one `-fail` and one `-ok` file.
- No field depends on the app; another program needs only the JSON.
