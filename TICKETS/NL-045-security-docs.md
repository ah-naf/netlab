# NL-045: Worker security documentation

- Milestone: 2
- Depends on: NL-042, NL-043
- Size: S

## Scope
`docs/security.md`: threat model, trust boundaries (browser, API, worker), what the worker can do and cannot do, required capabilities (`CAP_NET_ADMIN`, `CAP_SYS_ADMIN` for namespace operations, `CAP_NET_RAW` for capture) with the reason for each, a systemd unit example using `AmbientCapabilities`, `NoNewPrivileges`, `ProtectSystem`, `PrivateTmp`, socket permissions, how to run it safely on a disposable VM, why the sandbox exists, and the `NETLAB_ALLOW_HOST` warning. List of known residual risks.

## Acceptance
Reviewed against the code: each claim in the doc has a test or code reference noted next to it.
