#!/usr/bin/env bash
# Runs inside the sandbox: private /run so `ip netns add` works, then the command.
set -euo pipefail

mount -t tmpfs tmpfs /run
mkdir -p /run/netns
ip link set lo up
exec "$@"
