# Research: Properties Panel for Namespaces

## Draft, confirm, and the "lab never holds a bad value" rule

Decision: each field keeps a local draft. The rule runs on every change and sets the error text. Enter or blur confirms: if the draft is valid it is written to the lab through `edit`; if not, the draft and its error stay on screen and nothing is written. Escape restores the last lab value and clears the error.
Rationale: matches the clarified answer (invalid text lives only in the field). One confirmed edit is one undo step, with no history entry per keystroke.
Alternatives: write valid values on every keystroke (rejected: many undo steps and half-typed CIDRs like `10.0.0.` flip between valid and invalid); store invalid values and flag them (rejected by clarification).

## Where unresolved errors are tracked

Decision: a small Zustand store, `fieldErrorStore`, holds the set of field keys that currently show an error. A field adds its key when its draft is invalid and removes it when fixed, cancelled, or unmounted. `hasFieldErrors` drives the panel banner and is the value a later "lab is valid" indicator must read.
Rationale: the panel banner and other parts of the app can read it without prop drilling; unmount cleanup covers "selecting another node discards the draft".
Alternatives: React context inside the panel (rejected: the future validator and toolbar sit outside the panel).

## Field rules in one place

Decision: `store/fieldRules.ts` exports pure functions that return an error text or `null`, with all texts and limits from `constants/inspector.ts`. Rules that need the lab (unique names, duplicate address) take the document as an argument. The later whole-lab validator (NL-019) imports the same functions.
Rationale: FR-016; one definition for messages and limits.

## IPv4, IPv6, and CIDR checking

Decision: `ipAddress.ts` checks IPv4 by splitting four decimal parts of 0 to 255 with no leading junk, and IPv6 by letting the `URL` parser accept `http://[<address>]/`. A CIDR is an address, a slash, and a prefix length (0 to 32 for IPv4, 0 to 128 for IPv6). Host bits may be set.
Rationale: no dependency; `URL` already implements IPv6 parsing correctly, including `::` forms.
Alternatives: a validation package (rejected: new dependency for two small checks); a hand-written IPv6 regex (rejected: easy to get wrong).

## Interface name rules

Decision: 1 to 15 characters, no `/`, no whitespace, not `.` or `..`, unique among that node's interfaces. These are the Linux limits quoted in decision 5; namespace interfaces keep the user-facing name at deploy time.
Rationale: spec FR-010.

## Default gateway storage

Decision: the default gateway is a route with destination `0.0.0.0/0` (IPv4 gateway) or `::/0` (IPv6 gateway) in `node.routes`. `namespaceOps.setDefaultGateway` finds the existing default route of the same family or adds one; an empty value removes it. The static routes table hides default routes.
Rationale: the schema has no gateway field and must not change in this feature. Matches the clarified assumption.
Alternatives: add a schema field (rejected: schema change, Go side impact).

## Route completeness

Decision: a route needs a valid destination and at least one of gateway or output interface; metric is optional. An incomplete new route lives as a draft row in the panel (not in the lab). When it becomes valid and complete the user confirms it and it is added in one step. Editing a stored route follows the same per-field confirm rule.
Rationale: Linux needs a next hop or device; the schema allows both optional, so the form enforces the sensible minimum. This reads "all fields valid" in the spec as "every filled field is valid".

## Role editing

Decision: Host and Router are selectable only when the node's role is host or router. NAT gateways and namespaces with no role show the role as text. Changing role only sets `role`; router settings are untouched.
Rationale: spec assumption; a role-less namespace has no valid choice to move to without inventing a role.

## One history step per edit

Decision: add `edit(fn: (document) => Document)` to the store. It runs the pure op, skips history when the result is the same object, otherwise commits through the existing history helper and keeps selection.
Rationale: every op reuses the same undo path as palette operations.

## Observed column

Decision: constant `OBSERVED_TEXT = "Not deployed"`, rendered as read-only text on each interface and route row. No store field until the observed-state work.
Rationale: reserves the layout without adding data.
