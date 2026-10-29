# Feature Specification: Health Endpoint and API Client

**Feature Branch**: `005-health-and-client` (directory name; work stays on the current git branch)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "@TICKETS/NL-012-health-and-client.md"

## Clarifications

### Session 2026-10-29

- Q: When the server answers but the privileged worker cannot be reached, should the indicator still say "API online"? → A: No single online state. Show a third state, "API online, worker offline", when the server answers but the worker cannot be reached.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask the server if it is alive (Priority: P1)

Anyone (a developer, a script, the web app) can ask the server one question: "are you running?" The server answers with its status, its version, and whether the privileged worker can be reached. Until the worker exists, the worker answer is always "not reachable".

**Why this priority**: It is the first real endpoint and the basis for every connection check.

**Independent Test**: Start the server and request the health address. A successful JSON answer with status, version, and worker reachability comes back.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** the health address is requested, **Then** the answer is success with JSON containing the status, the version, and the worker reachability.
2. **Given** no worker exists yet, **When** the health address is requested, **Then** worker reachability is false.
3. **Given** any request to the server, **When** it is answered, **Then** the answer carries a request id that also appears in the server log line for that request.
4. **Given** a request to an address that does not exist, **When** it is answered, **Then** the answer is a standard JSON error with a code and message.

---

### User Story 2 - One reliable way for the web app to call the server (Priority: P1)

The web app has one shared client for calling the server (get, post, put, delete). It reads the server address and an optional access token from settings, sends the token with each request, and turns every failure into one clear error type. The error type tells the caller whether the server answered with an error (with its code and message) or whether the server could not be reached at all.

**Why this priority**: Every later screen calls the server. A single client keeps error handling the same everywhere.

**Independent Test**: Call the health address through the client and get typed data back. Call a missing address and get a server error with code and message. Stop the server and call again to get a "could not reach the server" error.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** the client requests health, **Then** it returns the typed answer.
2. **Given** the server answers with an error body, **When** the client receives it, **Then** it raises an error carrying the status, code, and message from the body.
3. **Given** the server is stopped, **When** the client makes a request, **Then** it raises an error of a different kind: network failure.
4. **Given** a token is set in settings, **When** the client makes a request, **Then** the token is sent with it.
5. **Given** the server answers with an error that is not in the standard format, **When** the client receives it, **Then** it still raises the same error type with the status and a generic message.

---

### User Story 3 - See whether the server is online (Priority: P2)

The web app shows a small indicator that says "API online", "API online, worker offline", or "API offline". It checks the server by itself every few seconds and updates without a page reload.

**Why this priority**: Users need to know quickly whether the app can do anything. It builds on the first two stories.

**Independent Test**: Open the web app with the server running and see "API online, worker offline" (the worker does not exist yet). Stop the server and, within a few seconds, see "API offline". Start it again and see "API online, worker offline" without reloading.

**Acceptance Scenarios**:

1. **Given** the server is running and the worker is reachable, **When** the page loads, **Then** the indicator shows "API online".
2. **Given** the indicator shows online, **When** the server is stopped, **Then** within 10 seconds it shows "API offline".
3. **Given** the indicator shows offline, **When** the server starts, **Then** within 10 seconds it shows "API online" (or "API online, worker offline" when the worker is not reachable) with no page reload.
4. **Given** the page just loaded, **When** the first check has not finished yet, **Then** the indicator shows a neutral "checking" state, not offline.
5. **Given** the server answers but reports the worker as not reachable, **When** the indicator updates, **Then** it shows "API online, worker offline".
6. **Given** the indicator shows "API online, worker offline", **When** the worker becomes reachable, **Then** within 10 seconds it shows "API online".

---

### Edge Cases

- Server answers slowly: the check gives up after a fixed time and counts as offline.
- Server answers with a non-JSON body: the client raises the same error type with a generic message, and the indicator treats it as offline.
- Until the worker feature exists, the worker is always unreachable, so a running server shows "API online, worker offline".
- Server is stopped in the middle of a request: handled as a network failure.
- Several checks overlap (slow server): only one check runs at a time.
- The page is hidden in a background tab: checking continues at the same pace (no special handling).
- A very long request id header or none provided: the server makes its own id.
- The server receives a stop signal while a request is running: it finishes that request, then stops.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The server MUST answer `GET /api/v1/health` with success and a JSON body containing `status`, `version`, and `workerReachable`.
- **FR-002**: `workerReachable` MUST be false until the worker feature exists.
- **FR-003**: The health address MUST NOT require an access token.
- **FR-004**: Every server answer MUST include a request id, taken from the caller if given, otherwise created by the server, and the id MUST appear in the server's log line for that request.
- **FR-005**: Every error answer MUST use one standard JSON shape: `{ "error": { "code", "message", "resource", "details" } }` (decision 10), with an appropriate HTTP status. Unknown addresses MUST return this shape with status 404.
- **FR-006**: The server MUST keep stopping gracefully on an interrupt signal (finish running requests, then stop).
- **FR-007**: The web app MUST have one shared client with get, post, put, and delete methods that reads the server base address and an optional access token from settings and sends the token on each request when set.
- **FR-008**: The client MUST raise one error type for all failures. It MUST distinguish a server error (with status, code, message, resource, details) from a network failure (no answer).
- **FR-009**: The client MUST handle an error answer that is not in the standard shape by raising the same error type with the status and a generic message.
- **FR-010**: The web app MUST show an indicator with four states, based on health checks that repeat every 5 seconds: "checking" (before the first result), "API online" (server answers and the worker is reachable), "API online, worker offline" (server answers and the worker is not reachable), and "API offline" (no answer, an error answer, or an answer that is not valid health data).
- **FR-011**: A health check that gets no answer within 3 seconds MUST count as offline, and only one check MUST run at a time.
- **FR-012**: The indicator MUST be visible in the app header, and a later toolbar feature will adopt it.
- **FR-013**: No tests are written (constitution). The handler, the error mapping, and the indicator are verified by running them by hand.

### Key Entities

- **Health answer**: Status (a short word such as "ok"), version (the build version string), and worker reachability (true or false).
- **Error answer**: Code, message, resource, and details, in one standard shape.
- **Request id**: A unique label for each request, echoed in the answer and the log.
- **Client error**: The one error type in the web app. Has a kind (server error or network failure), plus status, code, message, resource, and details for server errors.
- **Connection state**: One of checking, online, online with worker offline, offline.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The health address answers in under 100 ms on the developer machine.
- **SC-002**: 100% of error answers use the standard error shape.
- **SC-003**: 100% of answers carry a request id that matches the log line for the request.
- **SC-004**: After the server stops, the indicator shows "API offline" within 10 seconds. After it starts, the indicator shows "API online, worker offline" (or "API online" when the worker is reachable) within 10 seconds.
- **SC-005**: A developer can call the server from the web app with one line of calling code, with no per-screen error handling needed for the three failure types (server error, odd error, network failure).
- **SC-006**: Stopping the server with Ctrl+C while a request is running finishes that request and exits with status 0.

## Assumptions

- The scaffold (NL-010) exists, with a running server that has an empty route table and graceful shutdown already in place.
- The shared error shape from `docs/decisions.md` (decision 10) is used.
- The access token check itself comes later (NL-042). The client only sends a token when one is configured. The server ignores it for now.
- The toolbar belongs to NL-013 and does not exist yet. For now the indicator sits in a plain header area of the app, and NL-013 will move it into the toolbar.
- The version string comes from a named build-time value with a default such as "dev".
- The check interval (5 seconds) and timeout (3 seconds) are named settings in the web app, not shown to users.
- No tests are written (constitution), so each scenario is checked by running it by hand.
