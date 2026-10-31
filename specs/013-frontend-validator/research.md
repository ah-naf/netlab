# Research: Lab Validator

## 1. Where the issue list shows
**Decision**: A new "Issues" tab in the bottom drawer. The Validate button (now enabled) sets the open flag, expands the drawer, and selects that tab. Closing the tab body's close button clears the flag.
**Rationale**: The drawer already exists for tab-style output; the right panel is busy with the properties form, and the user needs to see the form after clicking an issue.
**Alternatives**: Popover from the toolbar (covers the canvas); a section in the properties panel (replaced on every selection).

## 2. Live list (clarification)
**Decision**: No stored issue list. `useIssues` returns `validate(document)` memoized on the document while the flag is open, else `[]`. Highlights read the same hook.
**Rationale**: Derived data cannot go stale; undo and redo come free. 200 resources validate well under the 1 s goal.
**Alternatives**: Store the issues and refresh on edit (stale-state bugs).

## 3. One rule set for fields and Validate
**Decision**: `nameRules.ts` returns issue codes for a candidate name; the field checks (`validateNodeName`, `validateInterfaceName`) map the first code to its message, and `validate` maps every code to an issue. Messages come from one table in `constants/validation.ts`.
**Rationale**: FR-015 and FR-019: same rule, same code, in both places.
**Alternatives**: Keep two copies (drift).

## 4. Derived Linux name
**Decision**: Nodes only (namespaces and bridges). `linuxName(labId, name)`: base `nl-<first 4 chars of lab id>-`; if base + name is at most 15 characters, use it; else keep the first characters of the name that fit, then `-` and 4 hex digits of the FNV-1a 32-bit hash of the full name. Interface names keep the user-facing name (decision 5), so they have no derived name here. The exact rule is in [contracts/issue-codes.md](contracts/issue-codes.md); NL-030 and the plan builder MUST copy it.
**Rationale**: Decision 5 names the prefix and a deterministic short hash but no exact algorithm. The text says "fits 15 characters": by this construction a derived name always fits, so the only live failure is a collision (rule `LINUX_NAME_COLLISION`). The "does not fit" half of FR-014 is met by construction and needs no separate code.
**Alternatives**: Treat overflow as an error (users could never use long names); CRC or SHA (no gain, FNV-1a is a few lines).
**Open item**: Bridge ports and veth peers on the host side may need derived names too; that belongs to the plan builder ticket and is not checked here.
**Task note**: The failing collision vector needs two long names with the same prefix and the same 4-digit hash. Find a pair by brute force at implementation time (about 300 tries expected).

## 5. CIDR containment
**Decision**: Add `cidrContains(cidr, ip)` next to `isCidr` using `BigInt` for both IPv4 and IPv6 (compare prefix bits). Different families never match.
**Rationale**: Needed for the route gateway rule; BigInt keeps one code path.
**Alternatives**: Separate v4 and v6 code (twice the code); a library (new dependency).

## 6. Duplicate IP per layer-2 segment
**Decision**: Union-find over interface ids. Each link unions its two endpoints. All interfaces of one bridge node are unioned together (a bridge joins its ports). Interfaces on a namespace are not joined to each other. Then group address strings (host part, prefix stripped) by segment; any group of two or more is one warning per extra interface. Link state is ignored, per the spec.
**Rationale**: Matches the clarified rule, including two addresses on one node in one segment.
**Alternatives**: Graph walk per interface (slower, more code).

## 7. Highlights
**Decision**: `issueTarget(document, issue)` returns node ids and an optional link id. `toFlowNodes` and `toFlowEdges` take a map of id to worst severity and set `data.issue` and an edge class; `NodeCard` shows a ring in the error or warning token color.
**Rationale**: Reuses the existing flow mapping; no new overlay layer.
**Alternatives**: Separate overlay on the canvas (position sync problems).

## 8. Checking vectors without a test framework
**Decision**: `web/scripts/checkVectors.ts`, run with `node web/scripts/checkVectors.ts`, same pattern as `roundtrip.ts` (explicit `.ts` imports, no new tools). It compares the sorted codes per file and exits 1 on any mismatch.
**Rationale**: Satisfies the ticket's "run every vector file" by hand per the constitution; no Vitest dependency.
**Alternatives**: Vitest (forbidden by the no-tests decision).
