# Quickstart: Backend Lab Validation (hand checks)

> **Trimmed by spec 017.** The shared vector files, `vectorcheck`, the existing-name option (`NAME_CONFLICT_EXISTING`, `Options`), `UNSUPPORTED_NODE_TYPE`, `INTERFACE_NAME_RESERVED`, `NAMESPACE_HAS_BRIDGE_FIELDS`, and the byte counting described below were removed. Names are ASCII only and `NODE_NAME_CHARS` was added. See `specs/017-remove-unused-features/contracts/issue-codes.md`. The text below is the record of what spec 016 first built.

Prerequisites: Go 1.26, Node 22.18 or newer. Run from the repository root. No privileges, no network, no sandbox.

## 1. Shared and backend vectors (SC-001, SC-005, SC-007)
```bash
make check-vectors
```
Expect one `ok` line per vector (shared and `backend/`), a `speed:` line under 1000 ms, no `MISSING` lines, exit code 0. Break one `expectedCodes` on purpose: that file prints `FAIL`, exit code 1. Undo.

## 2. The editor still agrees (SC-002)
```bash
node web/scripts/checkVectors.ts
```
Expect every line `ok` including the new non-ASCII vectors, exit 0. Together with step 1 this shows both sides give the same codes for every shared file.

## 3. Everything is returned, not the first (SC-003)
Build a lab file with 10 different problems (duplicate name, dangling end, bad interface name, two links on one interface, and so on) and run it through the command used for ad-hoc checks, `go run ./cmd/vectorcheck` on a folder containing that file with its expected codes. Expect all 10 codes in the actual list.

## 4. Backend-only codes (US4)
The `backend/` vectors cover: unsupported node type, a conflict with another lab's existing name, no conflict for this lab's own name, names without the `nl-` prefix ignored, and an empty set skipping the check. All print `ok` in step 1.

## 5. Build, lint, and speed
```bash
make lint
make build
```
Both exit 0. The `speed:` line from step 1 is the 200-resource timing.

## 6. Determinism
Run `make check-vectors` twice and compare the full output: identical.

Contracts: [issue-codes-additions](contracts/issue-codes-additions.md), [backend-vector-format](contracts/backend-vector-format.md), [refusal-response](contracts/refusal-response.md).
