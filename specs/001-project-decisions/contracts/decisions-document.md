# Contract: `docs/decisions.md`

The only interface of this feature is the structure of the document. Later tickets rely on it.

## Layout

```markdown
# NetLab Decisions Record

Written: YYYY-MM-DD
Reviewed: YYYY-MM-DD (or "pending")

## 1. <Topic>
**Status**: Proposed | Approved | Changed
**Decision**: ...
**Rationale**: ...
**Alternative considered**: ...   (required for decision 7, optional otherwise)

## 2. <Topic>
...

## Known mismatches
- <ticket id>: <what disagrees with which decision>   (or "None")
```

## Rules

- Exactly ten numbered entries, numbers 1 to 10, in the order given in the data model.
- Entry numbers stay fixed so tickets can cite "decision 5" without breaking.
- A changed decision is rewritten in place with Status `Changed`. Do not delete or renumber entries.
- Entry 7 (packet capture) states: external `tcpdump` chosen, in-process capture rejected, `tcpdump` not installed on the development machine.
- Entry 5 (naming) states the `nl` prefix plus short lab id, the 15-character interface name limit, and how names are shortened.
