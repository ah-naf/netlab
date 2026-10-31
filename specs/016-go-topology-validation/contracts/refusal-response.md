# Contract: Refusing an invalid lab (for NL-037)

Documented here so the job API builds on one shape; the endpoint is not part of this ticket.

- Trigger: `topology.HasErrors(topology.Validate(doc, opts))` is true. Warnings alone never refuse a lab.
- Response: HTTP 422 with the project error shape:
```json
{ "error": { "code": "invalid_topology", "message": "the lab has errors", "details": [ { "severity": "error", "code": "DUPLICATE_NODE_NAME", "resourceId": "n2", "resourceName": "ns1", "message": "…", "relatedIds": ["n1"] } ] } }
```
- `details` is the full issue list (errors and warnings), never only the first.
- Nothing on the machine is changed before the check passes.
- Unreadable documents (bad JSON, missing or unsupported schema version) are refused earlier with the existing `Migrate` errors and a 400; the rules never run on them.
