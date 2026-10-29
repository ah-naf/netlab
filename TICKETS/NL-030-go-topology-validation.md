# NL-030: Go topology validation

- Milestone: 2
- Depends on: NL-011, NL-019
- Size: M

## Scope
`internal/topology`: `Validate(doc) []Issue` implementing every rule in DRAFT.md section 4, with the same issue codes as the frontend. Also: supported topology types, resource ownership and name-conflict checks against a provided set of existing lab-owned names, derived Linux names fit 15 characters and do not collide after hashing (NL-000 decision 5).
- Consumes the shared vectors in `testdata/validation/`.
- Invalid documents are rejected before any kernel change; the API returns all issues, not only the first.
- Pure Go, no privileges.

## Acceptance
`go test ./internal/topology/...` passes with the shared vectors, plus tests for name collision, dangling endpoint, duplicate address, invalid interface name, and unsupported node type.
