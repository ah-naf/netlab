# Research: Sandbox Harness

No open unknowns. Findings below were checked by hand on this machine.

## Isolation method

- **Decision**: `unshare --user --map-root-user --net --mount`, then a tmpfs on `/run`, `mkdir /run/netns`, and `ip link set lo up`.
- **Rationale**: Verified here: bridge, veth, `ip netns add`, moving a veth into a namespace, `ip netns exec`, and `nft list ruleset` all work, and nothing appears on the host. No root and no `sudo` needed.
- **Alternatives considered**: a disposable VM or container (heavier, needs install and root or a daemon); `sudo` on the host (exactly what must be avoided).

## Why the tmpfs on `/run`

- **Finding**: Without it, `ip netns add` fails with `mkdir /run/netns failed: Permission denied`.
- **Decision**: The init script mounts a private tmpfs on `/run` (the mount namespace keeps it invisible to the host).

## Veth name quirk

- **Finding**: `ip link add a type veth peer name b` failed with `"type" is invalid lladdr`; `ip link add vethx type veth peer name vethy` worked. Single-character names clash with an `ip` argument.
- **Decision**: Environment check uses longer names (`nlchk0`, `nlchk1`).

## Detecting the sandbox

- **Decision**: Two checks must both be true. (1) `/proc/self/uid_map` is not the identity mapping `0 0 4294967295`. (2) The user namespace that owns the current network namespace (ioctl `NS_GET_USERNS`, number `0xb701`, on `/proc/self/ns/net`) is the same as the process's own user namespace (`/proc/self/ns/user`).
- **Rationale**: Verified here. On the host the map is the identity mapping. In the sandbox the map is `0 1000 1` and the network namespace owner equals the process user namespace (inode 4026532289). The ticket's idea of comparing with `/proc/1/ns/net` is avoided because `/proc/1` may not be readable.
- **Alternatives considered**: an environment variable set by the script (anyone can set it by hand, so it proves nothing); reading `/proc/1/ns/net` (permission problems).

## Host override

- **Decision**: Variable `NETLAB_ALLOW_HOST`; only the exact value `1` enables it. Using it prints a loud warning to stderr. No script sets it.
- **Rationale**: Needed for a dedicated disposable VM. Named constant in Go.

## Socket path across the boundary

- **Decision**: Worker socket at `.sandbox/worker.sock`, directory mode 0700.
- **Rationale**: Unix sockets are filesystem objects, so the host API can connect even though the worker lives in another network namespace. Confirmed by design; the worker itself arrives with NL-032, so this is checked then.

## Missing pieces handled

- **Makefile and `api/`**: none exist yet (NL-010 not done). This feature creates a minimal Makefile and `api/go.mod`; NL-010 extends them.
- **`sandbox-worker`** target: runs `go run ./cmd/worker`, which does not exist until NL-032. The target prints a clear message if the worker is missing.
- **`sandbox-test`** target: runs `go test -tags integration ./...`. With no tests (constitution), it passes on an empty set.
