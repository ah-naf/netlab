# Implementation Plan: Properties Panel for Bridges and Links

**Branch**: `012-inspector-bridge-link` (directory name; work stays on the current git branch) | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/012-inspector-bridge-link/spec.md`

## Summary

Add three views to the right-hand Inspector, built from the pieces already made for the namespace panel (`ValidatedField`, `SelectField`, `Section`, `RemoveAction`, field rules, `edit`): a bridge form (name, ports with where each leads, STP switch and priority, a VLAN "not supported yet" note), a link form (endpoint A and B with editable interface names, MTU for the link and both endpoints, state), and a nothing-selected view (lab name plus counts of namespaces, bridges, interfaces, and links). New document changes are small pure functions in one new module and go through the existing `edit` action, so one edit is one undo step. `NodeInspector.tsx` becomes a thin switch. The lab format does not change (a link keeps no name of its own, per the clarification). Web only; no new dependencies. No tests (constitution). Layout follows the 011 [UI contract](../011-fix-namespace-panel/contracts/ui-contract.md) so the three panels look like one family (frontend-design skill).

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8

**Primary Dependencies**: Existing only: Zustand 5 (`useShallow`), Tailwind CSS 4.

**Storage**: In-memory lab document; no schema change. Field drafts and error flags stay UI state.

**Testing**: None, per the constitution. Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Desktop browsers, minimum width 1024 px; the Inspector column is about 380 px wide.

**Project Type**: Web application (web side only)

**Performance Goals**: Error visible within 200 ms of typing (SC-004); counts update on the same render as the change.

**Constraints**: Colors from existing theme tokens; all visible text, limits, and defaults are named constants; functions under 100 lines; the lab never holds an invalid value (FR-012); every store selector that returns an array or object is wrapped in `useShallow` (the 011 crash).

**Scale/Scope**: 1 constants file, 1 ops module, 2 new field rules, 7 small components, edits to `NodeInspector.tsx`, `ValidatedField.tsx` (disabled prop), `fieldRules.ts`, and the link constants.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Web only. |
| II. Simple, concise code | Pass. Reuses the existing field, select, section, and remove components; no new dependency. ponytail and frontend-design skills apply at implementation. |
| III. Small, reusable functions | Pass. Each operation and rule is one small pure function; each view is split into components well under 100 lines. |
| IV. No magic strings | Pass. Titles, labels, limits (STP priority range, default 32768), and notes live in `constants/inspectorBridgeLink.ts`. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Components in `components/inspector`, ops in `store`, constants in `constants`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. |

Tests: none, by constitution; checked by hand in [quickstart.md](quickstart.md). Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/012-inspector-bridge-link/
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
├── constants/inspectorBridgeLink.ts        # titles, labels, STP limits, VLAN note, summary labels
├── store/
│   ├── bridgeLinkOps.ts                    # pure: setStp, setStpPriority, setLinkMtu, setLinkState, peerOf, summarize
│   └── fieldRules.ts                       # + validateStpPriority
├── components/
│   ├── NodeInspector.tsx                   # thin switch: namespace, bridge, link, several, nothing
│   └── inspector/
│       ├── BridgeForm.tsx                  # groups: Bridge, Ports, Spanning tree, VLAN
│       ├── PortRow.tsx                     # one port: editable name, "leads to", remove
│       ├── StpFields.tsx                   # STP switch and priority field
│       ├── LinkForm.tsx                    # groups: Link, Endpoint A, Endpoint B
│       ├── LinkEndpoint.tsx                # node name (read-only) and interface name field
│       ├── LabSummary.tsx                  # counts
│       └── ValidatedField.tsx              # + disabled prop
└── constants/links.ts                      # - LINK_SELECTED_HINT (unused after this feature)
```

**Structure Decision**: Same pattern as 010 and 011: pure ops and rules in `store/`, one history-aware `edit`, constants in `constants/`, one small component per concern in `components/inspector`. The old inline bridge view in `NodeInspector.tsx` is replaced by `BridgeForm`.

## Complexity Tracking

None.
