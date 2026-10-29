# NL-057: Polling, drift events, snapshot on reconnect

- Milestone: 3
- Depends on: NL-054, NL-039, NL-040
- Size: M

## Scope
Optional periodic server-side observation per active lab (interval configurable, default off or 10 s, minimum 2 s) that emits `KernelStateUpdated` and `StateDriftDetected` events only when something changed. Observation is skipped while a mutating job runs. Frontend toggle for polling. After a WebSocket reconnect, the client requests a fresh snapshot.

## Acceptance
Tests: unchanged state produces no event; a change produces exactly one event; polling stops when the last client disconnects; reconnect triggers a snapshot.
