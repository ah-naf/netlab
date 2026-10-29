# Data Model: Topology Schema

JSON field names are camelCase. "Req" means the field is required. Everything else is optional and omitted when empty. Enum values are named constants.

## Document

| Field | Type | Req | Notes |
|---|---|---|---|
| `schemaVersion` | integer | yes | Current is 1. Missing or other value is rejected by `Migrate`. |
| `lab` | Lab | yes | |
| `nodes` | Node[] | yes | May be empty. |
| `interfaces` | Interface[] | yes | May be empty. |
| `links` | Link[] | yes | May be empty. |
| `layout` | map nodeId → Position | no | Canvas positions only. |

## Lab

`id` (string, req), `name` (string, req), `description` (string).

## Node

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | yes | Stable. Never derived from the name. |
| `name` | string | yes | User-facing, editable. |
| `type` | enum `namespace`, `bridge` | yes | |
| `role` | enum `host`, `router`, `nat` | namespace only | |
| `router` | RouterSettings | no | namespace only. |
| `natRules` | NatRule[] | no | namespace only. |
| `routes` | Route[] | no | namespace only. |
| `bridge` | BridgeSettings | no | bridge only. |

## Interface

`id` (req), `nodeId` (req, the owning node), `name` (req), `mtu` (integer, req), `state` (enum `up`, `down`, req, desired state), `addresses` (Address[]).

A bridge port is an Interface whose node is a bridge.

## Link

`id` (req), `endpointA` (interface id, req), `endpointB` (interface id, req), `kind` (enum `veth`, req), `mtu` (integer, req), `state` (enum `up`, `down`, req).

Exactly two endpoints. The schema does not check that the ids exist (FR-012).

## Address

`cidr` (string, req). Format is not checked here.

## Route

`destination` (string, req), `gateway` (string), `interfaceId` (string), `metric` (integer).

## RouterSettings

`forwarding` (boolean, req).

## NatRule

`id` (req), `kind` (enum `masquerade`, `dnat`, req), `interfaceId` (req, outgoing or incoming interface), `protocol` (string), `port` (integer), `toAddress` (string), `toPort` (integer).

## BridgeSettings

`stp` (boolean, req), `stpPriority` (integer), `vlan` (VlanSettings).

## VlanSettings

`filtering` (boolean, req), `defaultVlanId` (integer).

## Position

`x`, `y` (numbers, req).

## CaptureSession (runtime only, never in Document)

`id`, `interfaceId`, `filter` (string), `maxPackets` (integer), `maxSeconds` (integer), `state` (enum `running`, `stopped`).

## Rules

- Ids are strings, unique across the document (checked by validation, not here).
- Renaming a node or moving it changes only `name` or `layout`.
- Unknown fields are ignored on read and dropped on save.
- State transitions: none in the document (`state` fields hold the desired state).
