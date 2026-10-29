# NL-050: Observer parsers

- Milestone: 3
- Depends on: NL-011
- Size: M

## Scope
`internal/observer`: typed Go decoders and normalized API types for `ip -j link show`, `ip -j addr show`, `ip -j route show`, `ip -j -6 route show`, `ip -j rule show`, `ip -j neigh show`, `bridge -j link show`, `bridge -j fdb show`. Tolerate missing and extra fields across iproute2 versions. Normalized schema is independent of the tool's raw shape. Parsing errors become structured inspection errors, never empty or invented data.
- Pure functions fed by captured fixtures in `testdata/iproute2/` (record fixtures from the sandbox, include at least two iproute2 versions if available).

## Acceptance
Unit tests over all fixtures including truncated and malformed JSON; a fuzz test for each parser does not panic.
