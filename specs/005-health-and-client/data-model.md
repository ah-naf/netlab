# Data Model: Health Endpoint and API Client

No stored data. These are the shapes that cross the wire or live in the web app.

## Health answer (JSON, 200)

| Field | Type | Req | Notes |
|---|---|---|---|
| `status` | string | yes | `"ok"` while the server runs. |
| `version` | string | yes | Build version, default `"dev"`. |
| `workerReachable` | boolean | yes | Always `false` until NL-032. |

## Error answer (JSON, 4xx/5xx)

```json
{ "error": { "code": "not_found", "message": "route not found", "resource": "/api/v1/x", "details": null } }
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `error.code` | string | yes | One of `not_found`, `method_not_allowed`, `internal`. |
| `error.message` | string | yes | Short human text. |
| `error.resource` | string | no | The failed address, omitted when empty. |
| `error.details` | any | no | Omitted when empty. |

## Request id

Header `X-Request-ID` on every answer. Reused from the request when present and at most 64 characters, otherwise generated (32 hex characters).

## Client error (`ApiError`, web)

| Field | Type | Notes |
|---|---|---|
| `kind` | `"server"` or `"network"` | Network means no answer. |
| `status` | number | HTTP status. 0 for network errors. |
| `code` | string | From the body, or `"unknown"` when the body is not standard. |
| `message` | string | From the body, or a generic message. |
| `resource` | string, optional | |
| `details` | unknown, optional | |

## Connection state (web)

`checking` → `online` | `online-worker-offline` | `offline`.

| Condition on a health check | State |
|---|---|
| Not finished yet (first check) | `checking` |
| Answer ok and `workerReachable` true | `online` |
| Answer ok and `workerReachable` false | `online-worker-offline` |
| No answer, timeout, error answer, or invalid body | `offline` |

Labels: `online` → "API online", `online-worker-offline` → "API online, worker offline", `offline` → "API offline", `checking` → "Checking API".
