# Data Model: Repository Scaffold

No stored data. These are the structural parts the scaffold creates.

## Backend responsibility folders (`api/internal/`)

| Folder | Purpose (first line of its `doc.go`) |
|---|---|
| `api` | HTTP handlers, routing, middleware |
| `topology` | Topology schema and validation |
| `engine` | Deployment planning and execution |
| `worker` | Worker client and privileged operations |
| `observer` | Reading kernel state and drift detection |
| `capture` | Packet capture sessions and decoding |
| `events` | Event types and WebSocket hub |
| `store` | Persistence |
| `sandbox` | Sandbox detection (exists) |
| `audit` | Audit logging |

Rule: exactly these ten folders, each with a purpose description (FR-004, FR-005, SC-004).

## Frontend source folders (`web/src/`)

`components`, `hooks`, `store`, `api`, `types`, `constants`. Rule: constitution VI layout.

## Settings (`.env.example`)

| Name | Placeholder value | Meaning |
|---|---|---|
| `NETLAB_API_ADDR` | `:8080` | Address the API listens on |
| `NETLAB_WORKER_SOCKET` | `.sandbox/worker.sock` | Worker socket path |
| `NETLAB_ALLOW_HOST` | (empty, commented) | Disposable VM only. Never set it on this machine. |

Rule: no secrets, every setting the code reads appears (FR-009, SC-006).
