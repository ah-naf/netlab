# Sandbox

All privileged networking code runs in a throwaway sandbox, so it can never change the network setup of your real machine.

## Use

```bash
scripts/check-env.sh                # check tools and sandbox support
scripts/sandbox.sh <command> ...    # run any command in the sandbox
make sandbox-shell                  # interactive shell in the sandbox
make sandbox-test                   # run privileged checks in the sandbox
make sandbox-worker                 # run the worker in the sandbox
```

The sandbox is `unshare --user --map-root-user --net --mount` plus a private `/run`. Inside, you look like root and have your own network stack. When the command ends, everything it created is gone.

## Design

Only the worker runs inside the sandbox. The API stays on your real machine and talks to the worker through a socket file under `.sandbox/`. A socket file is a normal file, so it works across the network boundary. `.sandbox/` is git-ignored and created with mode 0700.

The worker refuses to start outside the sandbox. `internal/sandbox.InSandbox()` checks that the process has a user mapping that is not the identity mapping and that its network namespace is owned by its own user namespace.

## Host override

`NETLAB_ALLOW_HOST=1` lets the worker run outside the sandbox. Use it on a disposable VM only. It prints a loud warning. No script or Makefile target sets it, and none uses `sudo`.

## Limits

- Lab traffic cannot leave the sandbox. It never reaches your real network.
- Nothing persists except files under `.sandbox/` and `data/`.
- Only the network and mounts are isolated. Files the sandboxed command writes land on your real disk under your own user, so the sandbox does not protect your files.
- `tcpdump` is not installed on this machine. `scripts/check-env.sh` reports it as missing.
