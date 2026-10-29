# NL-062: Capture API and packet streaming

- Milestone: 4
- Depends on: NL-060, NL-061, NL-039
- Size: L

## Scope
- REST: `POST /labs/{id}/captures`, `GET /labs/{id}/captures`, `GET /labs/{id}/captures/{captureId}`, `DELETE /labs/{id}/captures/{captureId}`.
- `CaptureStarted`, `CaptureStopped`, `PacketObserved` events over the lab WebSocket. Packet events are batched (for example every 50 ms) and subject to a per-connection bounded queue; on overflow, drop packets and send a `dropped` counter, never block the worker. Capture errors surface as events and in the capture status.
- Worker to API streaming over the Unix socket with backpressure.
- A capture belongs to a lab and owner; another owner's capture is a 404.

## Acceptance
Go tests with a fake worker stream: batching, overflow counter, authorization. Sandbox test: start capture, ping, a WebSocket client receives ICMP `PacketObserved` events.
