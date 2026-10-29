# NL-066: Capture integration tests

- Milestone: 4
- Depends on: NL-062, NL-063, NL-065
- Size: M

## Scope
Sandbox tests for items 7 and 8 of the DRAFT.md integration list: capture observes ICMP traffic, and the frontend receives packet events. Also: capture cleanup on lab delete and on worker shutdown, no leftover processes, limit enforcement, capture of an interface that is later removed ends with a clear error. A Playwright test drives the whole flow (draw, deploy, capture, ping, see packets). This is the DRAFT.md acceptance criterion; NL-078 reruns it for release.

## Acceptance
`make sandbox-test` and `make e2e-sandbox` pass with captured ICMP packets visible in the UI.
