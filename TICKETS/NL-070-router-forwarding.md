# NL-070: Router role and forwarding

- Milestone: 5
- Depends on: NL-044
- Size: M

## Scope
Router role on a namespace: `EnableForwarding` op sets `net.ipv4.ip_forward` and IPv6 forwarding inside that namespace only (never on the host namespace). Plan builder emits it for router nodes. UI toggle in the namespace panel. Example topology: two subnets joined by a router namespace.

## Acceptance
Sandbox test: host A and host B on different subnets ping through the router; with forwarding disabled they do not; the sandbox's root namespace sysctl is untouched.
