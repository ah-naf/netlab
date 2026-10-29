# Data Model: Sandbox Harness

No stored data. These are the runtime concepts.

## Sandbox

| Field | Meaning |
|---|---|
| User mapping | The current user appears as 0 inside. Not the identity mapping. |
| Network namespace | Own network stack, owned by the sandbox user namespace. |
| Mount namespace | Own mounts, with a private tmpfs on `/run` containing `/run/netns`. |
| Lifetime | Exactly the lifetime of the command it runs. |

State: starting → running command → exited (all resources gone).

## Environment Check Report

Printed as lines of `<item>: ok | missing | FAIL`.

| Item | Kind | Rule |
|---|---|---|
| `unshare`, `ip`, `nft`, `go`, `node` | Required | Missing makes the check fail. |
| `tcpdump`, `tc` | Optional | Missing is reported and does not fail the check. |
| Sandbox can create bridge | Capability | Must succeed. |
| Sandbox can create veth pair | Capability | Must succeed. |
| Sandbox can create named namespace | Capability | Must succeed. |

Exit code: 0 when no required item is missing and all capabilities succeed; non-zero otherwise.

## Host Override

| Field | Meaning |
|---|---|
| Name | `NETLAB_ALLOW_HOST` |
| Enabled when | The value is exactly `1`. |
| Effect | The worker may start outside the sandbox and prints a loud warning. |
