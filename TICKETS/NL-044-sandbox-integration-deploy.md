# NL-044: Sandbox integration tests for deployment

- Milestone: 2
- Depends on: NL-036, NL-043
- Size: M

## Scope
Cover the Linux integration list from DRAFT.md section 12 that applies to M2, all under `-tags integration` and run only via `make sandbox-test`:
1. two namespaces created, 2. veth connects them, 3. bridge connects multiple namespaces, 4. addresses and routes configured, 5. ping works where permitted and fails where the topology forbids it, 9. invalid topologies rejected, 10. partial failure reported and cleaned up, 11. reset removes only owned resources, 12. repeated deploy and cleanup are predictable.
- Test helpers create foreign "canary" resources and assert they survive.
- CI note: GitHub Actions runner can run the sandbox if user namespaces are enabled; document how.

## Acceptance
`make sandbox-test` passes. The output is pasted in the PR description; no claim is made unless the run actually happened.
