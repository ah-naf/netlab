# Implementation Plan: Lab Validator

**Branch**: `013-frontend-validator` (directory name; work stays on the current git branch) | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/013-frontend-validator/spec.md`

## Summary

Add a pure `validate(document): Issue[]` made of small rule functions, one per issue code, in a new `web/src/store/validation/` folder. The same rules feed three places: the live name checks next to fields (every edit), a new **Issues** tab in the bottom drawer opened by the Validate button (live while open, per the clarification), and canvas highlights on offending nodes and links. Clicking an issue selects the node or link through the existing selection actions. Shared examples live in `testdata/validation/*.json` (format in [contracts/vector-format.md](contracts/vector-format.md)) and are checked by a small script, `web/scripts/checkVectors.ts`, run by hand like the existing `roundtrip.ts`. The validator imports only types and plain constants, with explicit `.ts` extensions, so the script runs under plain Node. The lab format does not change. Web only; no new dependencies. No tests (constitution).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8; Node 22 for the vector script

**Primary Dependencies**: Existing only: Zustand 5 (`useShallow`), `@xyflow/react`, Tailwind CSS 4

**Storage**: In-memory lab document; no schema change. The only new UI state is "issue list open" (not persisted).

**Testing**: None, per the constitution. Hand checks in [quickstart.md](quickstart.md), including `node web/scripts/checkVectors.ts`.

**Target Platform**: Desktop browsers, minimum width 1024 px

**Project Type**: Web application (web side only; Go side is NL-030)

**Performance Goals**: Validate of 200 resources under 1 s (SC-001); name errors within 200 ms (SC-004). All rules are linear or near-linear in lab size; the duplicate-address rule uses a union-find over links.

**Constraints**: Colors from existing theme tokens; all codes, messages, and limits are named constants; functions under 100 lines; selectors returning arrays or objects use `useShallow`; validator has no React or store imports.

**Scale/Scope**: 1 constants file, about 6 small rule modules plus `validate.ts`, 1 CIDR-containment helper, 1 store flag, 3 components (Issues tab, issue row, Validate wiring), edits to `Toolbar`, `BottomDrawer`, `Canvas`/`toFlow`, `NodeCard`, `documentOps.validateNodeName`, `fieldRules.validateInterfaceName`, 1 script, about 25 vector files.

## Constitution Check

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only; vectors are language-neutral JSON for Go later. |
| II. Simple, concise code | Pass. No dependency; one rule = one small function. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. Rules split by topic; each under 100 lines. Name rules are shared by the validator and the field checks (DRY). |
| IV. No magic strings | Pass. Codes are one `ISSUE_CODE` constant used by rules, messages, and vectors. Limits and the `nl` prefix are constants. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Rules in `store/validation`, components in `components`, constants in `constants`, vectors in `testdata`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Tests: none, by constitution. Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/013-frontend-validator/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── issue-codes.md
│   └── vector-format.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
testdata/validation/
└── <rule>-<fail|ok>.json        # one lab + expected codes each

web/
├── scripts/checkVectors.ts      # reads every vector, prints mismatches, exit 1 on any
└── src/
    ├── constants/validation.ts  # ISSUE_CODE, SEVERITY, messages, LINUX_NAME limits, tab/label text
    ├── types/validation.ts      # Issue, Severity, IssueTarget
    ├── store/
    │   ├── ipAddress.ts         # + cidrContains(cidr, ip)
    │   ├── validationStore.ts   # { open, setOpen }
    │   └── validation/
    │       ├── validate.ts      # runs all rules, sorts errors first
    │       ├── idRules.ts       # duplicate ids
    │       ├── nameRules.ts     # node names, interface names, derived Linux names (also used by field checks)
    │       ├── linkRules.ts     # dangling, two links, endpoint validity
    │       ├── nodeRules.ts     # node/interface relationships, NAT refs
    │       ├── addressRules.ts  # CIDR validity, route gateway, duplicate IP per segment
    │       ├── linuxName.ts     # derived Linux name (see contracts/issue-codes.md)
    │       └── issueTarget.ts   # issue -> node ids + link id (selection and highlights)
    ├── hooks/useIssues.ts       # [] when closed, else memoized validate(document)
    └── components/
        ├── IssuesPanel.tsx      # drawer tab body: counts, list, close
        └── IssueRow.tsx         # one issue, click selects
```

**Structure Decision**: Web application, web side only. Rules live under `store/validation` because they are pure document logic like `documentOps`. The drawer gets a real tab body for Issues; other tabs stay placeholders.
