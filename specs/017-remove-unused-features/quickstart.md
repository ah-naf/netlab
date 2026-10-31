# Quickstart: Remove Unused Features (hand checks)

Prerequisites: Go 1.26, Node 22.18 or newer. Run from the repository root. No privileges, no sandbox.

## 1. Schema and types are stable (SC-002, FR-008)
```bash
make generate && git diff --stat docs/topology.schema.json web/src/types/topology.ts > /tmp/a
make generate && git diff --stat docs/topology.schema.json web/src/types/topology.ts > /tmp/b
cmp /tmp/a /tmp/b
```
Expect no output from `cmp`. Open the schema: no `mtu`, `bridge`, `capture`, or `dnat`.

## 2. Build and lint (SC-002)
```bash
make build
make lint
```
Both exit 0.

## 3. Examples (FR-010)
```bash
node web/scripts/checkExamples.ts
```
Expect `ok` for each example and `bad input` lines `ok`, exit 0.

## 4. Nothing left behind (SC-001)
```bash
grep -rniE 'mtu|\bstp|vlan|dnat|capture|observed|vector' api web/src web/scripts docs examples Makefile README.md
```
Expect only decision 7 in `docs/decisions.md` (the `tcpdump` text), `setPointerCapture` in `web/src/hooks/useResizeDrag.ts`, and the two `"mtu"` strip lines in `web/src/types/topologyDocument.ts` (they exist to drop the field from old files). Also check the paths are gone (and `specs/016-go-topology-validation/contracts/backend-vector-format.md`; the other 016 files carry a "Trimmed by spec 017" note at the top instead of a rewrite): `testdata/validation`, `api/cmd/vectorcheck`, `api/internal/{audit,capture,events,observer,store}`, `web/scripts/checkVectors.ts`.

## 5. Names are ASCII (User Story 3)
Copy `examples/direct-link.json`, rename an interface to `café`, then:
```bash
cd api && go run ./cmd/topocheck ../path/to/copy.json
```
Expect an `INTERFACE_NAME_CHARS` issue. Open the same file in the editor (`make dev-web`): the Issues tab shows the same code.

## 6. The editor (User Stories 1 and 4, SC-003, SC-005)
Run `make dev-web`. Add a namespace, a bridge, and a link. Select each node, each interface, and the link: no MTU, STP, VLAN, or "Observed state" text. Open the drawer: only Issues and Deployment logs. The palette has no `veth pair` or `NAT gateway`, and every entry drags onto the canvas.

## 7. Old file opens (SC-004, FR-009)
Make a file from an example and add `"mtu": 1500` to an interface and a link, `"bridge": {"stp": true}` to the bridge, and `"role": "nat"` to a namespace. Open it in the editor: it loads, none of those show. Save, then check the saved file contains none of them.

## 8. Docs (SC-006)
Read `docs/decisions.md` next to `TICKETS/README.md`: no token, no database, no capture screen, no "Known mismatches".

Contracts: [lab-file](contracts/lab-file.md), [issue-codes](contracts/issue-codes.md). Data: [data-model](data-model.md).
