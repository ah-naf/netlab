# Quickstart: Verify the Decisions Record

Prerequisites: `docs/decisions.md` exists. Run from the repository root. No setup, no tests.

## 1. Completeness (FR-001, FR-002, FR-003, SC-001)

```bash
grep -c '^## [0-9]' docs/decisions.md          # expect 10
grep -c '^\*\*Rationale\*\*' docs/decisions.md  # expect 10
```

Expected: both counts are 10 and no entry is blank.

## 2. Capture entry (FR-004, FR-005)

Open entry 7. Expected: it names `tcpdump` as chosen, in-process capture as rejected with a reason, and says `tcpdump` is not installed on the development machine.

## 3. Naming entry (FR-006)

Open entry 5. Expected: it mentions the `nl` prefix, the 15-character limit, and the shortening rule.

## 4. Dates (FR-007)

Expected: `Written:` has an ISO date. `Reviewed:` is `pending` until the owner signs off, then an ISO date.

## 5. Ticket consistency (FR-008, SC-004)

```bash
grep -rniE 'token|sqlite|prefix|netlink|tcpdump|zustand|/api/v1' TICKETS/
```

Expected: every match agrees with the record. Disagreements are fixed or listed under "Known mismatches".

## 6. Owner review (SC-003)

The owner reads the file (target: under 15 minutes) and sets each Status to Approved or Changed.
