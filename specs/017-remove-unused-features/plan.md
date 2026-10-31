# Implementation Plan: Remove Unused Features

**Branch**: `017-remove-unused-features` (directory name; work stays on the current git branch) | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/017-remove-unused-features/spec.md`, scope list in `TICKETS/NL-cleanup.md`

## Summary

Delete everything the draft labs do not use, in both halves of the app, and leave a smaller app that still builds, lints, and opens old files. Work is removal and simplification only: no new feature, no new dependency, no new file except a few lines in `api/cmd/topocheck`. Backend: the vector checker, five empty packages, runtime capture types, the existing-name option and its codes, and the lab fields `mtu`, `bridge`, DNAT, and the `nat` role. Frontend: MTU, STP, VLAN, observed-state UI, eight placeholder drawer tabs, two palette entries, and the vector script. Names become ASCII only, which lets the byte-counting code go. Docs, examples, and the 016 spec are brought in line. Planning found three things the ticket got wrong or missed; they are decided in [research.md](research.md): keep the existing deploy-name derivation, drop one more issue code, and fix two search false positives.

## Technical Context

**Language/Version**: Go 1.26 (standard library plus `invopop/jsonschema` already in use); TypeScript 6, React, Vite, Zustand, Tailwind

**Primary Dependencies**: None added or removed

**Storage**: Files only (`.netlab.json`, the examples); no database

**Testing**: None, per the constitution. Hand checks in [quickstart.md](quickstart.md): `make generate` twice, `make build`, `make lint`, `node web/scripts/checkExamples.ts`, a repository search, and a browser pass

**Target Platform**: Linux dev machine (WSL2); browser

**Project Type**: Web application (Go API, React frontend)

**Performance Goals**: None. Removal only

**Constraints**: Old saved labs must open; schema version stays 1; `make generate` must be stable; things later tickets need stay (spec FR-013)

**Scale/Scope**: about 45 test-data files, 1 command, 5 packages, 2 Go files and 1 Go constant block trimmed, about 25 frontend files edited or deleted, 3 examples, 4 docs

## Constitution Check

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. No other language added. |
| II. Simple, concise code | Pass. The feature exists to shrink code. The ponytail skill applies at implementation. |
| III. Small, reusable functions | Pass. Only removals and simplifications. |
| IV. No magic strings | Pass. Removed constants go with their users; none are inlined. |
| V. Readable names, minimal comments | Pass. |
| VI. Proper folder structure | Pass. Nothing moves except deletions. |
| VII. Sandboxed privileged execution | Pass. No privileged code touched. |

Tests: none, by constitution; the hand checks in the quickstart replace them. Post-design re-check: passes. No Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/017-remove-unused-features/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── lab-file.md
│   └── issue-codes.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
api/
├── cmd/
│   ├── genschema/        # edit: stop adding CaptureSession
│   ├── topocheck/        # edit: also print Validate issues
│   └── vectorcheck/      # DELETE
└── internal/
    ├── audit/ capture/ events/ observer/ store/   # DELETE (doc.go only)
    └── topology/         # trim model, settings, constants, issue, options, runtime, linuxname, name_rules, node_rules, validate
docs/                     # topology.schema.json regenerated; decisions.md, sandbox.md edited
examples/                 # 3 files edited
specs/016-go-topology-validation/   # edit: drop vector, existing-name, byte promises
testdata/validation/      # DELETE
web/
├── scripts/              # checkVectors.ts DELETE; checkExamples.ts edit
└── src/
    ├── components/       # inspector forms, palette, drawer tabs, NotAvailable
    ├── constants/        # inspector, layout, palette, links, topology, validation
    ├── store/            # documentOps, namespaceOps, bridgeLinkOps, fieldRules, toFlow, topologyStore, validation/*
    └── types/            # topology (regenerated), palette, topologyDocument (drop unknown role)
Makefile, README.md       # remove check-vectors, capture diagram lines
```

**Structure Decision**: Existing layout kept. This feature only deletes from it and edits files in place.
