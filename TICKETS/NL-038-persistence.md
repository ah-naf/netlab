# NL-038: Persistence

- Milestone: 2
- Depends on: NL-000, NL-037
- Size: M

## Scope
SQLite store behind an interface (`internal/store`): labs, topology versions, jobs with per-operation progress, resources owned by each lab (kind, name, namespace, created by job), captures metadata, audit entries. Migrations with versioned SQL files. Resource ownership records are the source for cleanup and for the orphan sweep (NL-043). Operation progress is written as each operation completes so a crash leaves an accurate trail.
- Frontend: Save now stores to the API, with the file download kept as export. Project list and open from the server.

## Acceptance
Unit tests against an in-memory SQLite. Restarting the API keeps labs and job history. Kill the API during a deploy (sandbox test) and the job is marked `interrupted` on restart with its owned-resource list intact.
