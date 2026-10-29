# Contract: Sandbox Interfaces

## `scripts/sandbox.sh <command> [args...]`

- Runs the command inside the sandbox and returns its exit status.
- No arguments: prints usage to stderr, exit status 2.
- Never uses `sudo`. Never sets `NETLAB_ALLOW_HOST`.
- Arguments are passed through as separate words, never joined into a shell string.

## `scripts/check-env.sh`

- Prints one line per item (see data-model.md). Exit 0 on pass, 1 on fail.
- When user namespaces are disabled, prints how to enable them and exits 1.

## Go package `internal/sandbox`

```go
// InSandbox reports whether the process runs in a user and network namespace created by the sandbox.
func InSandbox() bool

// HostOverrideEnabled reports whether NETLAB_ALLOW_HOST is exactly "1".
func HostOverrideEnabled() bool
```

```go
// RequireSandbox returns nil in the sandbox, or outside it only with the override (and a warning).
func RequireSandbox() error
```

The worker (NL-032) calls `RequireSandbox()` and refuses to start when it returns an error.

## Make targets

| Target | Action |
|---|---|
| `make sandbox-shell` | Interactive shell in the sandbox. |
| `make sandbox-test` | `go test -tags integration ./...` in the sandbox (empty set passes). |
| `make sandbox-worker` | Worker in the sandbox on `.sandbox/worker.sock`. Clear message if the worker does not exist yet. |

None of these set the override or call `sudo`.
