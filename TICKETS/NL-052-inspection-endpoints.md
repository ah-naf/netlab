# NL-052: Inspection endpoints

- Milestone: 3
- Depends on: NL-051, NL-037
- Size: M

## Scope
`GET /api/v1/labs/{id}/state`, `/links`, `/addresses`, `/routes`, `/neighbors`, `/bridges` with an optional `?node=` filter. Responses carry a `capturedAt` time, per-node results, and per-node `error` objects `{ code, message, resource, command }` when inspection fails. A failure for one node does not hide results for the others. No fabricated data on failure. Typed Go responses and OpenAPI entries.

## Acceptance
Handler tests with a fake worker (success, partial failure, worker down gives 503). Sandbox test: values returned match `ip` output read directly in the sandbox.
