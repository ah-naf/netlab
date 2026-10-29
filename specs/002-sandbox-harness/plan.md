# Implementation Plan: Sandbox Harness for Privileged Code

**Branch**: `002-sandbox-harness` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-sandbox-harness/spec.md`

## Summary

Add a sandbox that runs any command in a throwaway user, network, and mount namespace, so privileged networking code can never touch the real machine. Deliver two shell scripts (`sandbox.sh`, `check-env.sh`), a small Go package that reports whether the process is in the sandbox (used later by the worker), Make shortcuts, a `.gitignore` entry, and a short doc. The approach was proven by hand on this machine (bridge, veth, named namespace, nft all work inside it).

## Technical Context

**Language/Version**: Bash for scripts; Go 1.26 for the detection package

**Primary Dependencies**: `unshare`, `ip`, `nft` (system tools); Go standard library only (the detection uses one raw `ioctl` through `syscall`)

**Storage**: Files under `.sandbox/` (git-ignored, mode 0700). Nothing else is persisted.

**Testing**: None, per the constitution. Each scenario is checked by hand with [quickstart.md](quickstart.md).

**Target Platform**: Linux with unprivileged user namespaces (this machine: WSL2, kernel 6.18, `max_user_namespaces` 63345)

**Project Type**: Developer tooling (scripts plus one small Go package)

**Performance Goals**: Sandbox starts in under 5 seconds; environment check finishes in under 10 seconds (SC-002, SC-003)

**Constraints**: No `sudo`. No script sets `NETLAB_ALLOW_HOST`. Scripts never run user-supplied strings through a shell.

**Scale/Scope**: 3 scripts, 1 Go package (about 40 lines), 1 Makefile, 1 doc page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result |
|---|---|
| I. Go backend, React frontend | Pass. Go for the one package. Bash only for tooling that must wrap `unshare`. |
| II. Simple, concise code | Pass. Scripts stay under about 30 lines each; the Go function is a few lines. |
| III. Small, reusable functions | Pass. Detection is split into three small functions (identity map, owner namespace, combine). |
| IV. No magic strings | Pass. Paths, the override variable name, and the ioctl number are named constants in Go. Scripts define variables for the override name and socket directory at the top. |
| V. Readable names, minimal comments | Pass. Comments only where the kernel behavior is not obvious (the ioctl). |
| VI. Proper folder structure | Pass. `scripts/` for scripts, `api/internal/sandbox/` for Go, `docs/` for the doc. |
| VII. Sandboxed privileged execution | Pass. This feature implements it. No step runs privileged code on the host. |
| No tests | Pass. None written. |

Post-design re-check: no change. No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-sandbox-harness/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── sandbox-interface.md
└── tasks.md             # created later by /speckit-tasks
```

### Source Code (repository root)

```text
scripts/
├── sandbox.sh           # entry: unshare, then run sandbox-init.sh
├── sandbox-init.sh      # runs inside: private /run, lo up, exec command
└── check-env.sh         # environment check
api/
├── go.mod               # minimal module; NL-010 extends it
└── internal/sandbox/
    └── sandbox.go       # InSandbox(), host override check
Makefile                 # sandbox-shell, sandbox-test, sandbox-worker
docs/
└── sandbox.md           # design and limits
.gitignore               # adds .sandbox/
```

**Structure Decision**: Scripts at the repo root in `scripts/`. The Go package lives under `api/internal/` as planned in NL-010, so the worker can import it without a move. This feature creates the minimal `api/go.mod` and `Makefile`; NL-010 adds the rest later.

## Complexity Tracking

No constitution violations to justify.
