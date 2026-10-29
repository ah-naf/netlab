# NL-033: Controlled command runner

- Milestone: 2
- Depends on: NL-032
- Size: M

## Scope
`internal/worker/runner`: the only place that executes external programs. Fixed absolute executable allowlist (`ip`, `bridge`, `nft`, `tc`, `tcpdump`, `ping`) resolved once at startup. `exec.CommandContext` with separate args, no shell, minimal environment (`PATH` cleared, `LC_ALL=C`). Per-command argument validators (regex or typed builders) that reject anything unexpected, including leading `-` in user-derived values. Timeouts, stdout and stderr size caps, exit status mapping to structured errors, concurrency semaphore.
- Static check: a test greps the repository for `sh -c`, `bash -c`, and `exec.Command("sh"` and fails if found.

## Acceptance
Unit tests with a fake executable: timeout kills the child and returns a timeout error; output over the cap is truncated and flagged; injection strings (`; rm -rf /`, `$(id)`, `-o`, newlines) are rejected by validators; unlisted executables are impossible to request.
