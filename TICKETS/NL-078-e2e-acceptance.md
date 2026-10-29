# NL-078: End-to-end acceptance and release checklist

- Milestone: 5
- Depends on: all previous tickets
- Size: M

## Scope
Verify the final acceptance criterion in the sandbox: a user visually builds two namespaces connected through a Linux bridge, deploys to real kernel state, verifies interface and IP state in the inspector, pings between namespaces, and sees the captured ICMP packets in the UI. Record the run (log and short screen capture). Also run the full suites: `make test-web`, `make test-api`, `make sandbox-test`, `make e2e-sandbox`. Then a separate manual pass on a disposable VM (not the developer's machine) for the parts the sandbox cannot show, if desired. Final checks: no `sh -c` in the code base, no secrets committed, `NETLAB_ALLOW_HOST` unset in all scripts, docs match behavior, known limitations listed.

## Acceptance
A release checklist file `docs/release-checklist.md` with each item checked and linked to evidence. Items not actually run stay unchecked.
