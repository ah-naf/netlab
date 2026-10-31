# Research: Backend Lab Validation

Facts below were read from the repository on 2026-10-31.

## 1. What exists
`api/internal/topology` already has the document model (`Document`, `Node`, `Interface`, `Link`, `NatRule`, `Route`, `BridgeSettings`), typed enums (`NodeType`, `LinkKind`, `State`), `Migrate` (version check), and `Load` and `Marshal`. JSON decoding accepts any string for `Type`, `Kind`, and `Role`, so an unsupported node type reaches the rules as an ordinary value. Unknown JSON fields are ignored. `cmd/topocheck` loads a file and prints it; `cmd/genschema` writes the schema. No `_test.go` files exist.

## 2. Rule source
**Decision**: The 20 rules in `specs/013-frontend-validator/contracts/issue-codes.md` are the rule list; the ticket's "DRAFT.md section 4" is not in the repository. Code strings are Go constants of a `Code` string type whose values equal the contract exactly.
**Rationale**: One contract, two implementations, shared vectors prove agreement.

## 3. Two backend-only codes
**Decision**: `UNSUPPORTED_NODE_TYPE` (error, resource: the node): `type` is not `namespace` or `bridge`. `NAME_CONFLICT_EXISTING` (error, resource: the node, `relatedIds` empty, message names the existing name): a derived Linux name equals an entry in `Options.ExistingNames` that starts with `nl-` and whose owner lab id is not this document's lab id (details in §4). Both are added to the shared contract file by a task (FR-014). Their vectors go in `testdata/validation/backend/`.
**Rationale**: Clarification: the editor does not produce them, so their vectors stay out of the shared folder.
**Alternatives**: Add the type rule to the editor too (rejected in clarification).

## 4. Existing-name check details
**Finding**: Every derived name starts with this lab's own prefix `nl-<first 4 id characters>-`. A name under *another* lab's prefix can therefore never equal one of this lab's derived names, unless two labs share the same first four id characters (ids are short by design, 014 research §6). So deciding ownership by prefix alone cannot tell such labs apart.
**Decision**: `Options.ExistingNames` is a list of `ExistingName { Name, LabID }`. A node conflicts (`NAME_CONFLICT_EXISTING`) when its derived name equals an existing `Name` and that entry's `LabID` is not this document's `lab.id`. An entry with an empty `LabID` counts as foreign (safe default). Names that do not start with `nl-` are not lab-owned and are ignored. An entry owned by this lab is never a conflict (redeploy). No entries means the check is skipped.
**Rationale**: Covers every spec scenario (redeploy allowed, foreign name conflicts, unowned names ignored, empty set skipped) and the one case that can actually happen.
**Spec refinement**: The spec says another lab's *prefix*; this plan decides ownership by full lab id, which is the stricter, correct form of the same idea. The spec text is left as is; analyze may flag it.

## 5. Derived Linux name and the byte problem
**Finding**: The editor's `linuxName` and its interface-name length rule use JavaScript string length (UTF-16 units). Linux limits interface and bridge names to 15 **bytes** (`IFNAMSIZ`). A name like `éééééééé` (8 characters, 16 bytes) passes the editor but cannot exist on Linux; Go's `len` counts bytes, so the two sides would disagree. Slicing by UTF-16 units can also cut inside a character.
**Decision**: Measure in UTF-8 bytes on both sides. Interface names: valid when 1 to 15 bytes. Derived name: `base = "nl-" + idPart + "-"` where `idPart` is the longest whole-character prefix of the lab id that fits in 4 bytes (so the base is at most 8 bytes and there is always room for at least 2 bytes of name plus the 5-byte hash part); if `len(base) + len(name)` bytes is at most 15, use `base + name`; else keep the longest prefix of whole characters of the name that fits in `15 - len(base) - 5` bytes, then `-` and 4 lowercase hex digits of the low 16 bits of the FNV-1a 32-bit hash of the name's UTF-8 bytes. The lab id comes from a user file and may hold any characters, so its part is also cut by bytes on whole characters: a 4-character ASCII id gives 4 bytes as before, an id like `éééé` gives `éé`. This keeps the base at most 8 bytes, so the result is always at most 15 bytes and no length goes negative. JavaScript and Go then agree for astral characters too.
**Rationale**: ASCII behaviour is unchanged (same as the contract), so existing vectors still pass; non-ASCII becomes correct and identical on both sides.
**Editor change**: `web/src/store/validation/linuxName.ts` (byte count, whole-character slicing with `TextEncoder`) and `nameRules.ts` (interface length in bytes). New shared vectors prove it.
**Alternatives**: Restrict names to ASCII (surprising for users); count code points (still wrong for Linux).

## 6. Hash
**Decision**: `hash/fnv.New32a` over the name's bytes; take `sum & 0xffff`, format `%04x`. Same as the editor's `fnv1a32` on UTF-8 bytes.
**Rationale**: Standard library; matches the contract and the editor.

## 7. Address parsing
**Decision**: Use `net/netip`: `netip.ParsePrefix` for CIDRs, `netip.ParseAddr` for gateways, `prefix.Masked().Contains(addr)` for reachability. IPv4 and IPv6 never match each other; IPv4-mapped IPv6 does not match an IPv4 prefix (same as the editor, which treats them as different families). Duplicate-address keys use the parsed `netip.Addr` (prefix length ignored).
**Known divergence**: `netip` rejects IPv4 parts with leading zeros (`10.0.0.01`), while the editor's `isIpv4` accepts them. Left as a recorded difference: such a CIDR is `INVALID_CIDR` in Go and valid in the editor. It does not appear in the shared vectors. The editor should tighten later; not part of this ticket.
**Alternatives**: Hand-written parsing (more code, more bugs).

## 7b. Known differences (kept out of the shared vectors)
- IPv4 parts with leading zeros: `netip` rejects `10.0.0.01`; the editor accepts it (see §7).
- Whitespace: the editor trims and tests names with JavaScript rules (`trim`, `\s`), Go uses `strings.TrimSpace` and `unicode.IsSpace`. They differ at U+0085 (whitespace only in Go) and U+FEFF (whitespace only in JavaScript). Names with those two characters can get different codes on the two sides. No shared vector, golden name, or backend vector may contain U+0085 or U+FEFF; a later change should pick one explicit whitespace set for both.

## 8. Layer-2 segments
**Decision**: Union-find over interface ids, identical to the editor: unite both ends of each link whose ends exist; unite all interfaces of each bridge node; group parsed addresses (distinct interfaces only) per segment; report each interface after the first.
**Rationale**: Same algorithm means same codes.

## 9. Order and determinism
**Decision**: Errors before warnings, then by the order of codes in the contract (with the two new codes last), then by resource id using byte order. Rules run in a fixed slice; no map iteration decides output order.
**Rationale**: FR-003. The editor sorts ids with `localeCompare`; code comparison in vectors is a multiset, so order differences between sides do not matter.

## 10. Never crash
**Decision**: Rules read slices defensively (nil slices, missing refs are normal) and each rule runs under a `recover` wrapper that skips a panicking rule, like the editor's `runRule` try/catch. A recovered panic is not reported as an issue.
**Rationale**: FR-013.

## 11. Refusal shape for the API
**Decision**: When the job API (NL-037) refuses a lab, it answers HTTP 422 with the existing error shape: `{"error":{"code":"invalid_topology","message":"the lab has errors","details":[ <issues> ]}}`, where `details` is the full issue list. This ticket ships `topology.HasErrors(issues)` and the JSON tags on `Issue`; the endpoint itself is out of scope. Documented in `contracts/refusal-response.md`.
**Rationale**: Matches decision 10 (one error shape) and FR-010 without building an endpoint that has no caller yet.

## 12. The vector command
**Decision**: `api/cmd/vectorcheck` takes the vectors folder as its argument. It reads every `*.json` in it (shared files), runs `Validate` with no options, and compares the sorted multiset of codes with `expectedCodes`. It then reads `backend/*.json`, runs `Validate` with the file's `existingNames`, and compares. It prints one line per file (`ok` or `FAIL` with expected and actual), then checks coverage: every code in the shared contract has a `<kebab>-fail*` and a `<kebab>-ok*` file in the top-level folder, and each backend code has both in `backend/`. Exit 1 on any mismatch or missing coverage. A Makefile target `check-vectors` runs it with `../testdata/validation`. It also times one `Validate` on a generated 200-resource lab and fails at 1000 ms or more (SC-004).
**Rationale**: FR-012 and SC-007. Same format as `topocheck` and `genschema`.
**Alternatives**: `go test` files (forbidden by the no-tests decision).

## 13. Vector decoding differences
**Finding**: The shared vectors contain `"kind": "tunnel"` and other free-form strings; Go decodes enums as plain strings, so they load. Documents are decoded with `json.Unmarshal` into `topology.Document`; unknown fields are ignored, as the editor does.
**Decision**: No change needed to the vectors; the backend check decodes each vector as `{ description, document, expectedCodes, existingNames? }`.
