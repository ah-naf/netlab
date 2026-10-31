# NL-078: Acceptance run and README

- Milestone: Use the lab
- Depends on: NL-077
- Size: S

## Scope
Walk every draft lab by hand in the sandbox and record the result.
- For each of the seven examples (NL-077): Deploy, use Inspect for the state the draft shows, use Run for the draft's ping, curl, and tcpdump steps, Reset. Write one line per lab in `docs/acceptance.md` with the date and pass or fail. A lab that was not run stays unchecked.
- Update `README.md`: the worker is now built, Deploy and Reset exist, how to start `make sandbox-worker`, `make dev-api`, `make dev-web`, and the updated checks table. Remove the Milestone 1 "not available" lines.
- Final checks: no `sh -c` anywhere (`grep -rn 'sh -c' api`), `NETLAB_ALLOW_HOST` is set in no script or Makefile target.

## Acceptance
`docs/acceptance.md` lists all seven labs, each checked or marked failed with a reason.
