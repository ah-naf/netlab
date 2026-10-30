# Implementation Plan: Properties Panel for Namespaces

**Branch**: `010-inspector-namespace` (directory name; work stays on the current git branch) | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-inspector-namespace/spec.md`

## Summary

Replace the read-only node view in the right panel with a form for one selected namespace: name, role, interfaces (name, MTU, state, addresses), default gateway, static routes, and a read-only Observed value on each row. Every field is a small `ValidatedField`: it keeps its own draft, checks the draft on each keystroke with a pure rule function, shows the error next to the field, and writes to the lab only on Enter or blur and only when valid. The lab never holds a bad value. A small error store counts fields with unresolved errors so the panel can say the lab has errors and later validation work can read it. Document changes are pure functions in a new `namespaceOps.ts` and go through one new store action `edit`, so one confirmed edit is one undo step. The field rules live in `fieldRules.ts` and are reusable by the later whole-lab validator. Web only; no new dependencies. No tests (constitution). Visual work follows the 008 [design direction](../008-palette-and-node-ops/contracts/design-direction.md) (frontend-design skill).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: Zustand 5, Tailwind CSS 4, `@xyflow/react` 12 (unchanged). IP and CIDR checks use the standard library, no package.

**Storage**: In-memory lab document. Field drafts and error flags are UI state only and are not in history.

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px.

**Project Type**: Web application (web side only)

**Performance Goals**: Error visible within 200 ms of typing (SC-003); typing in one field must not re-render the other fields.

**Constraints**: Colors from existing theme tokens; limits, messages, labels, roles, and default-route destinations are named constants; functions under 100 lines; the lab stays valid after every operation (FR-008).

**Scale/Scope**: 1 constants file, 1 rules module, 1 ops module, 1 error store, about 8 small components, edits to `topologyStore` (one action) and `NodeInspector`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only. |
| II. Simple, concise code | Pass. No new dependency; one generic field component reused for every input; native `URL` for IPv6 checks. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. Each rule and each document op is a small pure function; the form is split into section components so none nears 100 lines. |
| IV. No magic strings | Pass. Limits, messages, labels, role and state choices, default-route destinations, and the Observed text live in `constants/inspector.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. `components/inspector`, `store`, `constants`, `types`, `hooks`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Tests: ticket asks for Vitest, constitution forbids tests; satisfied by hand ([quickstart.md](quickstart.md)). Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/010-inspector-namespace/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
web/src/
├── constants/inspector.ts            # limits, messages, labels, role/state choices, default destinations, OBSERVED_TEXT
├── types/inspector.ts                # RouteDraft, FieldRule
├── store/
│   ├── fieldRules.ts                 # pure rules: name, interface name, mtu, cidr, address, gateway, destination, metric
│   ├── ipAddress.ts                  # isIpv4, isIpv6, parseCidr (shared by the rules)
│   ├── namespaceOps.ts               # pure document ops: role, interface fields, addresses, gateway, routes, lab name
│   ├── fieldErrorStore.ts            # which fields have unresolved errors; hasFieldErrors
│   └── topologyStore.ts              # + edit(fn): one history step, skips no-ops
├── hooks/useFieldDraft.ts            # draft text, live error, confirm, cancel, error flag lifecycle
└── components/
    ├── NodeInspector.tsx             # picks view: namespace form, lab name, multi-select, link text
    └── inspector/
        ├── NamespaceForm.tsx         # name, role, sections, error banner
        ├── ValidatedField.tsx        # input + error text, uses useFieldDraft
        ├── RoleField.tsx             # Host/Router select or read-only text
        ├── InterfaceEditor.tsx       # one interface: name, MTU, state, Observed, remove
        ├── AddressList.tsx           # addresses with add and remove
        ├── GatewayField.tsx          # default gateway
        ├── RoutesTable.tsx           # rows, add route, route draft row
        ├── RouteRow.tsx              # one route: four fields, Observed, remove
        ├── ErrorBanner.tsx           # "This lab has errors" from fieldErrorStore
        └── LabNameField.tsx          # nothing-selected view
```

**Structure Decision**: Reuse the 008 pattern: pure rules and ops in `store/`, one history-aware action, constants in `constants/`. New UI goes in its own `components/inspector` folder so `NodeInspector.tsx` stays a thin switch.

## Complexity Tracking

None.
