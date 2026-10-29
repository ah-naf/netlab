# Data Model: Project Decisions Record

This is a document, not a database. These are the parts of the document.

## Decisions Record (the file `docs/decisions.md`)

| Field | Meaning |
|---|---|
| Written date | Date the record was written (ISO). Required. |
| Reviewed date | Date the owner reviewed it. Empty until reviewed. |
| Decisions | Ordered list of ten Decision entries. |
| Known mismatches | List of ticket assumptions that disagree with the record. May be empty. |

## Decision

| Field | Meaning |
|---|---|
| Number | 1 to 10, matches the order in NL-000. |
| Topic | Short name, for example "Authentication for version 1". |
| Decision | The outcome, one or two sentences. |
| Rationale | One paragraph explaining why. |
| Alternative considered | Rejected option and why. Required when more than one option was viable (capture). |
| Status | `Proposed` until reviewed, then `Approved` or `Changed`. |

Topics, in order: authentication, persistence, veth link model, role model, resource naming and ownership, kernel control approach, packet capture, sandboxed development, frontend state, API versioning and error format.

Validation rules: exactly ten entries (FR-002); every entry has Decision and Rationale (FR-003); the capture entry also has Alternative considered and the missing-tool note (FR-004, FR-005); the naming entry covers the length limit and how lab-owned resources are told apart (FR-006).

State transitions for Status: Proposed → Approved, or Proposed → Changed (the entry is rewritten and the new rationale shown).

## Ticket Assumption

A statement in a ticket that depends on a decision. Not stored separately. Mismatches found during the check are listed under Known mismatches.
