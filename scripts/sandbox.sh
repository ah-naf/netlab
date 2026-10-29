#!/usr/bin/env bash
# Runs a command in a throwaway user, network, and mount namespace.
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "usage: $0 <command> [args...]" >&2
  exit 2
fi

exec unshare --user --map-root-user --net --mount "$(dirname "$0")/sandbox-init.sh" "$@"
