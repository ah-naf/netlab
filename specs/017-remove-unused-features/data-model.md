# Data Model: Remove Unused Features

The lab document keeps its shape. These fields and values go away. Schema version stays 1.

## Document (before → after)

| Entity | Removed | Kept |
|---|---|---|
| Node | `bridge` (`stp`, `stpPriority`, `vlan`), role value `nat` | `id`, `name`, `type`, `role` (`host`, `router`), `router`, `natRules`, `routes` |
| Interface | `mtu` | `id`, `nodeId`, `name`, `state`, `addresses` |
| Link | `mtu` | `id`, `endpointA`, `endpointB`, `kind`, `state` |
| NatRule | `kind`, `protocol`, `port`, `toAddress`, `toPort` | `id`, `interfaceId` (masquerade out of that interface) |
| Document | none | `schemaVersion`, `lab`, `nodes`, `interfaces`, `links`, `layout` |

## Removed types

- `CaptureSession`, `CaptureState` (Go `runtime.go`, schema definition added by `genschema`).
- `BridgeSettings`, `VlanSettings`, `NatKind`.
- `Options`, `ExistingName` (validation input).

## Issue codes

See [contracts/issue-codes.md](contracts/issue-codes.md). 17 codes remain.

## Reading an old file

1. Parse and check the shape (unchanged).
2. Check `schemaVersion` is 1 (unchanged).
3. Strip removed fields and values (new): `mtu`, node `bridge`, role `nat`, DNAT-only rule fields.
4. Fill missing lists with empty lists (unchanged).

Validation rules about removed fields disappear with them. No state transitions.
