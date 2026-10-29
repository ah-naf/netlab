# NL-077: Documentation set

- Milestone: 5
- Depends on: NL-045, NL-043, NL-066
- Size: M

## Scope
Everything listed in DRAFT.md section 14 that does not exist yet: architecture overview, environment variables table (`.env.example` kept in sync), Linux VM prerequisites and packages, API reference generated from `docs/openapi.yaml`, example topology files, bridge-lab tutorial with screenshots, troubleshooting guide (user namespaces disabled, tcpdump missing, WSL2 notes, permission errors), cleanup and recovery guide, single-user VM deployment guide with systemd units. Each command in the docs is run once by the author; mark any that are untested.

## Acceptance
A reviewer follows the tutorial from a clean machine in the sandbox and reaches the working bridge lab.
