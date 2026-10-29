# NL-071: Route management

- Milestone: 5
- Depends on: NL-070
- Size: M

## Scope
`AddRoute` (and delete for reset) with validation: destination prefix, gateway must be reachable on a directly connected subnet of the output interface, interface owned by the namespace, metric range. Default gateway per namespace. Routes UI table in the properties panel with desired and observed columns. Never modifies the default route of the host namespace.

## Acceptance
Sandbox tests: static route via router works end to end; invalid gateway rejected by API and worker; drift reported if a route is removed by hand.
