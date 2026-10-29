# Implementation Plan: Repository Scaffold

**Branch**: `003-repo-scaffold` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-repo-scaffold/spec.md`

## Summary

Create the empty but runnable project skeleton: a Vite + React + TypeScript frontend in `web/`, extended Go backend layout in `api/` (API and worker entry points plus one folder per responsibility), root `Makefile` commands to start, build, and lint, an `.env.example`, ignore rules, and `docs/` and `examples/` folders. No features, no tests (constitution).

## Technical Context

**Language/Version**: Go 1.26 (backend); TypeScript with Node 22 (frontend)

**Primary Dependencies**: Frontend: React 19, Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), `@xyflow/react` 12, `zustand`, ESLint (flat config) with `typescript-eslint`, Prettier. Backend: Go standard library only.

**Storage**: N/A

**Testing**: None, per the constitution. Verified by running commands by hand (see [quickstart.md](quickstart.md)).

**Target Platform**: Linux dev machine (this one: WSL2)

**Project Type**: Web application (frontend plus backend)

**Performance Goals**: Backend starts in under 3 seconds (SC-002). Fresh checkout to blank page in under 5 minutes (SC-001).

**Constraints**: No `sudo` in any command. Existing sandbox files are extended, not replaced. Package manager is npm.

**Scale/Scope**: 1 frontend project, 1 Go module, 2 entry points, 10 backend responsibility folders, 6 frontend source folders.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Go and React with TypeScript only. |
| II. Simple, concise code | Pass. Entry points are tiny. Config files use defaults. |
| III. Small, reusable functions | Pass. API `main` delegates to a small `run` function. |
| IV. No magic strings | Pass. Env variable names, default address, and exit messages are named constants in Go. The Vite config reads the proxy target from one constant. |
| V. Readable names, minimal comments | Pass. Each empty folder gets a one-line `doc.go` comment. |
| VI. Proper folder structure | Pass. This feature creates the structure: `web/src/{components,hooks,store,api,types,constants}` and `api/{cmd,internal/<responsibility>}`. |
| VII. Sandboxed privileged execution | Pass. No privileged code. The worker stub calls `sandbox.RequireSandbox()` first. |
| No tests | Pass. No test files, no test runner, no test Make targets. |

Post-design re-check: no change. No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/003-repo-scaffold/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── root-commands.md
└── tasks.md             # created later by /speckit-tasks
```

### Source Code (repository root)

```text
web/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    ├── hooks/
    ├── store/
    ├── api/
    ├── types/
    └── constants/
api/
├── go.mod                       # exists
├── cmd/
│   ├── api/main.go
│   └── worker/main.go
└── internal/
    ├── api/doc.go
    ├── topology/doc.go
    ├── engine/doc.go
    ├── worker/doc.go
    ├── observer/doc.go
    ├── capture/doc.go
    ├── events/doc.go
    ├── store/doc.go
    ├── sandbox/                 # exists, kept as is
    └── audit/doc.go
docs/                            # exists
examples/.gitkeep
.env.example
.gitignore                       # extended
Makefile                         # extended
```

**Structure Decision**: Web application layout with `web/` and `api/` at the repository root, matching tickets NL-011 to NL-022. Extends the existing `Makefile`, `.gitignore`, and `api/internal/sandbox`.

## Complexity Tracking

No constitution violations to justify.
