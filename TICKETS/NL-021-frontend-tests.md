# NL-021: Frontend tests for Milestone 1

- Milestone: 1
- Depends on: NL-015, NL-016, NL-019, NL-020
- Size: M

## Scope
Fill the DRAFT.md frontend test list that applies to M1: node creation and deletion, interface configuration, connection validation, serialization and deserialization, API error handling. Add a Playwright smoke test: open the app, drag two namespaces and a bridge, connect them, validate, save.
(WebSocket reconnect and packet filtering tests belong to NL-040 and NL-063.)

## Acceptance
`make test-web` runs all unit tests, and `make e2e-web` runs the Playwright smoke test headless against `make dev-web` with the API running.
