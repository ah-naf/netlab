# NL-001: Sandbox harness for privileged code

- Milestone: Foundations
- Depends on: NL-000, NL-010 (Makefile exists)
- Size: M

## Goal
Make it impossible to damage the developer's real network configuration while developing or testing privileged code.

## Scope
1. `scripts/sandbox.sh <command...>`: runs the command inside `unshare --user --map-root-user --net --mount`, then mounts a tmpfs on `/run`, creates `/run/netns`, brings up `lo`, and execs the command. Exits with the command's status.
2. Sandbox detection helper in Go, `internal/sandbox.InSandbox()`: true when `/proc/self/uid_map` shows a non-identity mapping and the network namespace differs from the init namespace (compare `/proc/self/ns/net` with `/proc/1/ns/net` inodes). Used by the worker (NL-032) to refuse to start on the host.
3. `NETLAB_ALLOW_HOST=1` override exists but prints a loud warning and is documented as "disposable VM only". No Makefile target sets it.
4. Make targets: `make sandbox-shell` (interactive shell in the sandbox for manual poking), `make sandbox-test` (runs `go test -tags integration ./...` inside the sandbox), `make sandbox-worker` (runs the worker inside the sandbox listening on `.sandbox/worker.sock`).
5. Prerequisite check script `scripts/check-env.sh`: verifies `unshare`, `ip`, `nft`, `go`, `node`, reports `tcpdump` and `tc` presence, and tests that the sandbox can create a bridge, a veth pair, and a namespace. Prints clear remediation if user namespaces are disabled.
6. Document the design: only the worker runs in the sandbox; the API stays on the host and talks over a Unix socket in `.sandbox/` (a path on the real filesystem, so it crosses the network namespace boundary).
7. Document limits: no access to the host's interfaces, so lab traffic never leaves the sandbox. Nothing is persisted except files under `.sandbox/` and `data/`. `.sandbox/` is in `.gitignore`.

## Acceptance
- `scripts/check-env.sh` passes on this machine.
- `scripts/sandbox.sh ip link add br0 type bridge && ip link show br0` succeeds, and afterwards `ip link show br0` on the host fails (the bridge does not exist on the host).
- `scripts/sandbox.sh id -u` prints 0 while `id -u` on the host prints the normal user id.
- A Go test for `InSandbox()` returns false on the host and true under the sandbox script.

## Notes
Verified manually: veth creation requires a name such as `vethx`; `ip netns add` needs the tmpfs on `/run` or it fails with "mkdir /run/netns failed: Permission denied".
