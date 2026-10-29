# NL-037: Lab and job API

- Milestone: 2
- Depends on: NL-030, NL-036
- Size: L

## Scope
Implement endpoints from DRAFT.md section 11 for labs and jobs: `POST/GET /labs`, `GET /labs/{id}`, `PUT /labs/{id}/topology`, `POST /labs/{id}/validate`, `POST /labs/{id}/deploy` (returns 202 with a job id), `GET /labs/{id}/jobs/{jobId}`, `POST /labs/{id}/stop`, `DELETE /labs/{id}`, `POST /labs/{id}/reset`.
- Typed requests and responses, consistent errors, correct status codes (400 validation with all issues, 404, 409 when a job is already running for the lab, 422, 503 when the worker is unreachable).
- Job states: queued, running, succeeded, failed, cancelled, rolled_back. One mutating job per lab at a time.
- Lab status is derived from observed state (NL-054) and job results, never from the topology alone. Before M3 the status reads `deployed` only after the executor's read-back verification succeeded.
- OpenAPI file `docs/openapi.yaml` kept in sync, with a test that checks every route is documented.

## Acceptance
`curl` scripts in `docs/api-examples.md` against the API plus a sandboxed worker deploy the bridge lab and report job success. Handler tests cover each status code.
