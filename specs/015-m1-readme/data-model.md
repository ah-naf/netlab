# Data Model: Milestone 1 README

No data. The deliverable is one document. Its structure is the model.

## README sections (in order)
| # | Section | Holds |
|---|---|---|
| 1 | Title and intro | What NetLab is, who it is for, what a lab is |
| 2 | Milestone 1 | What works now and what does not (no deploy) |
| 3 | Architecture | Mermaid diagram, then a plain list of the five parts |
| 4 | Prerequisites | Table: tool, minimum version, check command; supported system |
| 5 | Quick start | Install, start API, start frontend, open the browser, what you should see |
| 6 | Troubleshooting | API offline, amber worker state, busy port, frontend alone |
| 7 | Safety and sandbox | "Nothing in Milestone 1 needs root", short sandbox paragraph, link, environment check |
| 8 | Project layout | One line per top-level folder |
| 9 | Checks | Table: check, folder, command, pass result; not-available-yet line |
| 10 | More docs | Links to sandbox, decisions, links, and topology format pages |

## Architecture parts
| Part | Job | Built in M1 |
|---|---|---|
| Frontend | Browser canvas to draw, edit, validate, save, and open labs | Yes |
| API | HTTP API under `/api/v1`; health check only in M1 | Partly (health) |
| Worker | Does the privileged work inside the sandbox; talks to the API over a Unix socket | No |
| Observer | Reads real kernel state and reports it | No |
| Capture | Captures packets on a link with `tcpdump` | No |

## Check
Fields: name, folder to run from, command, expected pass result. Each row is a command that exists and was run before it was written down.

## Top-level folders
`web` (frontend), `api` (Go API, worker, tools), `docs` (sandbox, decisions, links, topology schema), `examples` (ready-made labs), `scripts` (sandbox and environment scripts), `specs` (feature specs and plans), `testdata` (shared validator vectors), `TICKETS` (work tickets), `Makefile` (common commands).
