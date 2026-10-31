# Implementation Plan: Milestone 1 README

**Branch**: `015-m1-readme` (directory name; work stays on the current git branch) | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-m1-readme/spec.md`

## Summary

Write one file, the root `README.md`, for a new developer. It follows a fixed section order (see [contracts/readme-contract.md](contracts/readme-contract.md)): what NetLab is, what Milestone 1 includes, a Mermaid architecture diagram with a plain list under it, prerequisites with check commands, a quick start that ends at the working canvas, the "no root" statement with a short sandbox paragraph, the project layout, the checks that exist today, and links to the deeper docs. Every command in it was run on this machine while planning and its real output is recorded in the contract, so the README repeats facts instead of guessing. Nothing is built: no code, no script, no new make target. The README links to the sandbox, decisions, links, and topology pages and does not copy them. No tests (constitution); verified by a clean-checkout run-through.

## Technical Context

**Language/Version**: Markdown (GitHub flavored) with one Mermaid block

**Primary Dependencies**: None. Facts come from `Makefile`, `scripts/check-env.sh`, `web/package.json`, `api/go.mod`, `web/vite.config.ts`, `api/cmd/api/main.go`

**Storage**: N/A

**Testing**: None, per the constitution. Verification is a hand run of every README command on a clean checkout ([quickstart.md](quickstart.md))

**Target Platform**: Linux development machines (the sandbox needs user namespaces); the page itself reads anywhere

**Project Type**: Documentation (repo root file)

**Performance Goals**: A new developer reaches a working canvas in under 10 minutes (SC-001)

**Constraints**: No `sudo` anywhere; no command or make target that does not exist; no copy of the sandbox or decisions text; commands state the folder to run from; simple wording (the constitution's readability rules apply to prose too)

**Scale/Scope**: 1 file, about 120 lines

## Constitution Check

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. The README states this stack; it adds no stack. |
| II. Simple, concise code | Pass. Nothing is coded; the page is short and links instead of copying. |
| III. Small, reusable functions | N/A. No code. |
| IV. No magic strings | N/A. No code. The page uses real names from the repo, not invented ones. |
| V. Readable names, minimal comments | Pass. Plain words, short sentences. |
| VI. Proper folder structure | Pass. `README.md` at the root; no other file added. |
| VII. Sandboxed privileged execution | Pass. The README states that nothing needs root, never uses `sudo`, and points to the sandbox for privileged work. |

Tests: none, by constitution. The README lists the checks that exist and marks the automated frontend and end-to-end tests "not available yet". Post-design re-check: passes; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/015-m1-readme/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── readme-contract.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
README.md                # new: the only deliverable
```

No other file changes. `docs/sandbox.md` is linked, not edited (see research §9 for one stale line it contains).

**Structure Decision**: Documentation only; a single root file.
