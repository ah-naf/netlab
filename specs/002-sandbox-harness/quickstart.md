# Quickstart: Verify the Sandbox Harness

Prerequisites: run from the repository root. No `sudo` anywhere. The contract is in [contracts/sandbox-interface.md](contracts/sandbox-interface.md).

## 1. Isolation (US1, SC-001)

```bash
scripts/sandbox.sh sh -c 'ip link add nlbr0 type bridge && ip link show nlbr0'
ip link show nlbr0
```

Expected: the first command succeeds. The second fails with `Device "nlbr0" does not exist`.

```bash
scripts/sandbox.sh id -u; id -u
```

Expected: `0` then your normal user id.

```bash
scripts/sandbox.sh false; echo $?
```

Expected: `1` (the command's exit status).

```bash
scripts/sandbox.sh sh -c 'ip netns add t1 && ip link add nlchk0 type veth peer name nlchk1 && ip link set nlchk1 netns t1 && ip netns exec t1 ip link show nlchk1'
```

Expected: succeeds, and `ip netns list` on the host shows nothing new.

## 2. Environment check (US2, SC-002)

```bash
time scripts/check-env.sh; echo $?
```

Expected: required tools `ok`, `tcpdump` reported `missing` on this machine, three capabilities `ok`, exit 0, under 10 seconds.

## 3. Refusal outside the sandbox (US3, SC-004)

```bash
cd api && go run ./internal/sandbox/cmd/check                              # host
../scripts/sandbox.sh go run ./internal/sandbox/cmd/check                   # sandbox
NETLAB_ALLOW_HOST=1 go run ./internal/sandbox/cmd/check                     # override
```

Expected: the host run prints `not in sandbox: run through scripts/sandbox.sh` and exits 1. The sandbox run prints `ok to start`. The override run prints the loud warning and `ok to start`.

## 4. Shortcuts (US4, SC-003, SC-005)

```bash
make sandbox-shell     # then run: id -u   (expect 0), exit
grep -rnE 'sudo|NETLAB_ALLOW_HOST' Makefile scripts/ || true
```

Expected: shell is inside the sandbox. The grep finds no `sudo` and no line that sets the override.

## 5. Hygiene (FR-012)

```bash
git check-ignore .sandbox/
```

Expected: `.sandbox/` is printed (it is ignored).
