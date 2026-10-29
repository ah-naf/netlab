# NL-040: Frontend WebSocket client with reconnect

- Milestone: 2
- Depends on: NL-039, NL-013
- Size: M

## Scope
Typed event client with exponential backoff reconnect, visible states (connecting, live, reconnecting, offline) in the toolbar, sequence gap detection that triggers a full snapshot refetch (`GET /labs/{id}` and, after M3, `/state`), and event dispatch into stores.
- Deployment Logs tab shows live events with timestamps and operation status.

## Acceptance
Vitest with a mock WebSocket: reconnect after close, backoff growth, gap triggers refetch, reconnect state shown. Manual: stop and restart the API and watch the toolbar recover.
