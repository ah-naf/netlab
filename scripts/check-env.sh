#!/usr/bin/env bash
# Checks tools and sandbox capability. Exit 0 when nothing required is missing.
set -uo pipefail

SANDBOX="$(dirname "$0")/sandbox.sh"
REQUIRED_TOOLS=(unshare ip nft go node)
OPTIONAL_TOOLS=(tcpdump tc)
CHECK_LINK=nlchk0
CHECK_PEER=nlchk1
CHECK_NAMESPACE=nlchk
failed=0

report_tool() {
  if command -v "$1" >/dev/null 2>&1; then echo "$1: ok"; return 0; fi
  echo "$1: missing"
  return 1
}

check_capability() {
  local name=$1; shift
  if "$SANDBOX" "$@" >/dev/null 2>&1; then echo "$name: ok"; else echo "$name: FAIL"; failed=1; fi
}

for tool in "${REQUIRED_TOOLS[@]}"; do report_tool "$tool" || failed=1; done
for tool in "${OPTIONAL_TOOLS[@]}"; do report_tool "$tool" || true; done

if ! "$SANDBOX" true >/dev/null 2>&1; then
  echo "sandbox: FAIL (user namespaces unavailable)"
  echo "Enable them (as an administrator): sysctl -w user.max_user_namespaces=15000"
  echo "On some distributions also: sysctl -w kernel.unprivileged_userns_clone=1"
  exit 1
fi

check_capability "bridge" ip link add "$CHECK_LINK" type bridge
check_capability "veth pair" ip link add "$CHECK_LINK" type veth peer name "$CHECK_PEER"
check_capability "named namespace" ip netns add "$CHECK_NAMESPACE"

exit "$failed"
