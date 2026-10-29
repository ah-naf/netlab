# NL-039: WebSocket hub and deployment events

- Milestone: 2
- Depends on: NL-037
- Size: M

## Scope
`internal/events`: typed event envelope `{ id, seq, labId, type, ts, resourceId, payload }` and all types from DRAFT.md section 10 (only the deployment ones are emitted now). `GET /api/v1/labs/{id}/events` upgrades to WebSocket.
- Per-connection bounded queue, slow consumers are dropped with a `gap` marker and a close code, not allowed to block the executor or worker. Cancellation when the browser disconnects. Per-lab monotonically increasing `seq` so clients detect gaps.
- Authorization: a connection only receives events for labs its token owns. No cross-lab broadcast.
- Ping/pong heartbeat and idle timeout.

## Acceptance
Go tests: slow client does not block the publisher; a client for lab A never receives lab B events; sequence gaps are reported after a drop; disconnect releases resources (goroutine leak test).
