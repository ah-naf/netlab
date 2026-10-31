# Contract: Lab file (`.netlab.json`)

Format: [docs/topology.schema.json](../../../docs/topology.schema.json), regenerated from the Go model by `make generate`. Schema version stays 1.

## Writing

A saved lab never contains: `mtu`, `bridge`, role `nat`, or the NAT rule fields `kind`, `protocol`, `port`, `toAddress`, `toPort`. A NAT rule is `{ "id", "interfaceId" }`.

## Reading

Unknown fields and the removed ones above are accepted and dropped. The file opens. It does not produce an issue because of them. The only reasons to refuse a file stay as before: not JSON, wrong shape, missing or unsupported `schemaVersion`.

## Names

Node, interface, and bridge names contain only ASCII letters, digits, `-`, and `_`. Any other character gives `INTERFACE_NAME_CHARS` (interfaces) or the matching existing name issue (nodes). The editor and the backend agree.

## Compatibility check

`make generate` run twice gives no diff. `web/src/types/topology.ts` equals the generated output.
