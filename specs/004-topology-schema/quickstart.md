# Quickstart: Verify the Topology Schema

Prerequisites: scaffold in place (NL-010), Node 22, Go 1.26, network for `go mod`/`npm install`. Run from the repository root. Contract: [contracts/topology-document.md](contracts/topology-document.md).

## 1. Generate (US1, SC-003, SC-005)

```bash
make generate
git status --short docs/topology.schema.json web/src/types/topology.ts
make generate && git diff --stat docs web/src/types   # second run changes nothing
```

Expected: both files exist. A second `make generate` produces no diff. Open `docs/topology.schema.json` and confirm every field in [data-model.md](data-model.md) appears, and `CaptureSession` is not under `Document`.

## 2. Round-trip on both sides (US1, SC-001)

```bash
norm() { python3 -m json.tool --sort-keys; }
norm < examples/bridge-lab.json > /tmp/orig.json
(cd api && go run ./cmd/topocheck ../examples/bridge-lab.json) | norm > /tmp/go.json
node --experimental-strip-types web/scripts/roundtrip.ts examples/bridge-lab.json | norm > /tmp/ts.json
diff /tmp/orig.json /tmp/go.json && diff /tmp/orig.json /tmp/ts.json && echo SAME
```

Expected: `SAME`.

## 3. Structure of the example (US2)

```bash
python3 - <<'PY'
import json
d = json.load(open("examples/bridge-lab.json"))
print([n["name"] for n in d["nodes"]], len(d["links"]), [a["cidr"] for i in d["interfaces"] for a in i.get("addresses", [])])
PY
```

Expected: nodes `ns1 ns2 br0`, 2 links, addresses `10.0.0.1/24` and `10.0.0.2/24`. Each link has two interface ids.

## 4. Stable ids and layout (SC-002)

Edit a node name and a `layout` position in a copy of the example, run both round-trip commands, and confirm every `id` is unchanged and positions live only under `layout`.

## 5. Version handling (US3, SC-004)

```bash
sed 's/"schemaVersion": 1/"schemaVersion": 99/' examples/bridge-lab.json > /tmp/future.json
(cd api && go run ./cmd/topocheck /tmp/future.json); node --experimental-strip-types web/scripts/roundtrip.ts /tmp/future.json
grep -v schemaVersion examples/bridge-lab.json > /tmp/noversion.json
(cd api && go run ./cmd/topocheck /tmp/noversion.json)
```

Expected: both refuse with `unsupported schemaVersion 99`. The last one reports `schemaVersion is missing`. Exit status is non-zero.

## 6. Unknown fields and runtime records (edge cases)

Add `"surprise": 1` at the top level of a copy and run both round-trips: the output has no `surprise`. Add a `captures` array: it is dropped too.
