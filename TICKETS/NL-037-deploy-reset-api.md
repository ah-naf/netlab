# NL-037: Deploy and reset API

- Milestone: Deploy
- Depends on: NL-036
- Size: S

## Scope
Two synchronous endpoints under `/api/v1`. No lab records, no jobs, no database.
- `POST /deploy`: body is the topology document. Runs the Go validator (NL-030). Validation errors return 400 with the full issue list and change nothing. A worker that is down returns 503. Success or failure returns 200 with the per-operation results from NL-036.
- `POST /reset`: runs `DeleteOwned`, returns the result.
- The API keeps the last deployed document in memory so NL-046 and NL-050 can find node names. It is lost on restart; reset works anyway because it deletes by prefix.
- Errors use the existing error shape from decision 10.

## Acceptance
With the API and the sandbox worker running, `curl -d @examples/bridge-lab.json localhost:8080/api/v1/deploy` returns every operation `ok`. Posting a lab with a duplicate node name returns 400 with issues. `POST /reset` leaves no `nl-` resource.
