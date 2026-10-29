# Research: Project Decisions Record

No open technical unknowns. The questions below are about how to write the record.

## Document format

- **Decision**: One Markdown file, `docs/decisions.md`, with a numbered level-2 heading per decision, a fixed field list under each (Status, Decision, Rationale, Alternative considered), and a review block at the top.
- **Rationale**: One file is found fastest (SC-002). A fixed field list makes gaps obvious.
- **Alternatives considered**: One file per decision (too many files for ten short entries); a general ADR tool (extra dependency for no gain).

## Content source

- **Decision**: Start from the ten decisions in `TICKETS/NL-000-decisions.md`. Packet capture is settled as external `tcpdump` with output decoded in Go and in-process capture as the rejected alternative.
- **Rationale**: The ticket already holds reasoned recommendations. The spec clarification confirmed the only choice that was left open.
- **Alternatives considered**: Re-opening all decisions (slow, and the ticket answers are reasonable defaults).

## Consistency check method

- **Decision**: Search `TICKETS/*.md` for terms tied to each decision (token, SQLite, veth, role, `nl-` prefix, netlink, tcpdump, sandbox, Zustand, `/api/v1`, error format) and compare the matches with the record. Fix mismatches in the tickets or list them in the record.
- **Rationale**: Cheap, repeatable by hand, needs no tooling.
- **Alternatives considered**: A script or test (not allowed by the constitution and not worth it for ten decisions).

## Known mismatch to record

- **Finding**: The constitution says no tests are written, but many tickets list tests as acceptance (for example NL-012, NL-021, NL-030 to NL-036, NL-044, NL-050, NL-061, NL-066).
- **Decision**: List this in the record as a known mismatch. Updating those tickets is a separate task, so it is not done here.
- **Rationale**: This feature owns the record, not a rewrite of all tickets.

## Owner review

- **Decision**: The record carries two dates: written and reviewed. Reviewed stays empty until the owner confirms.
- **Rationale**: Satisfies FR-007 without pretending a review happened.
