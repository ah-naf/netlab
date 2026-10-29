# NL-042: Authentication, authorization, audit log, limits

- Milestone: 2
- Depends on: NL-032, NL-038
- Size: M

## Scope
- API: bearer token middleware (NL-000 decision 1), constant-time compare, token read from `NETLAB_TOKEN`, no default token in production mode, dev mode prints a generated token at startup. Lab ownership keyed to the token's owner id, checked on every lab route and WebSocket.
- Worker: re-validates the token and request fields independently, checks that the lab id and resource names match the ownership records, rejects operations on resources the lab does not own.
- Audit log: every privileged operation (who, lab, op, params summary, result, duration) written to SQLite and a rotating JSON log file. Secrets are never logged.
- Limits: max labs, max nodes per lab, max concurrent ops in the worker, per-op timeout, output size cap, request body size cap, rate limit on deploy.

## Acceptance
Tests: missing or wrong token gives 401; another owner's lab gives 404; the worker rejects a forged request for a resource owned by a different lab; audit entries exist for every op in a deploy; limits return clear errors.
