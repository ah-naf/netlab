# Quickstart: Verify Health Endpoint and Client

Prerequisites: scaffold in place, Go 1.26, Node 22. Run from the repository root. Contract: [contracts/health-api.md](contracts/health-api.md). Stop each server with Ctrl+C when done.

## 1. Health endpoint (US1, SC-001, SC-003)

```bash
make dev-api          # terminal 1
curl -i localhost:8080/api/v1/health
```

Expected: `200`, `Content-Type: application/json`, an `X-Request-ID` header, and a body `{"status":"ok","version":"dev","workerReachable":false}`. The terminal 1 log shows one line for the request with the same id.

```bash
curl -i -H 'X-Request-ID: my-id' localhost:8080/api/v1/health | grep -i x-request-id
curl -i localhost:8080/api/v1/nope
curl -i -X POST localhost:8080/api/v1/health
```

Expected: `my-id` is echoed. The 404 and the 405 both return the standard JSON error body (`not_found`, `method_not_allowed`) with a request id.

## 2. Graceful stop (SC-006)

Press Ctrl+C in terminal 1.

Expected: the process exits and `echo $?` prints `0`.

## 3. Client (US2, SC-002, SC-005)

With the API running, start `make dev-web` and open the browser console on the page, then run:

```js
const { apiClient } = await import("/src/api/client.ts");
await apiClient.get("/api/v1/health");          // returns the health object
await apiClient.get("/api/v1/nope").catch(e => [e.kind, e.status, e.code, e.message]);
```

Expected: the first returns the health object. The second gives `["server", 404, "not_found", ...]`. Stop the API and run the first line again: it rejects with `kind: "network"`.

## 4. Indicator (US3, SC-004)

With `make dev-web` open and the API running, the header shows "API online, worker offline" (the worker does not exist yet). Stop the API: within 10 seconds it shows "API offline". Start it again: within 10 seconds it shows "API online, worker offline", with no page reload. On first load it briefly shows "Checking API".

## 5. Token header

Create `web/.env.local` with `VITE_API_TOKEN=test-token`, restart `make dev-web`, and in the browser Network tab confirm requests carry `Authorization: Bearer test-token`. Delete the file afterwards.

## 6. Lint and build

```bash
make lint && make build
```

Expected: no errors.
