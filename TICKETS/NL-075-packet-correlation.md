# NL-075: Packet correlation and inferred paths

- Milestone: 5
- Depends on: NL-065, NL-072
- Size: M

## Scope
Correlate observations across multiple captures using timestamp windows and packet attributes (ICMP id and sequence, TCP sequence numbers, IP id), taking NAT address rewrites into account when a NAT rule is known. Show inferred paths as dashed lines labeled "inferred", separate from directly observed events. Document the limits (offloading, clock skew, capture placement).

## Acceptance
Unit tests with synthetic multi-capture event streams including NAT and a bridge hop. Sandbox test: ping across a router with two captures yields an inferred path through the router.
