# NL-065: Topology packet animation

- Milestone: 4
- Depends on: NL-062, NL-014
- Size: M

## Scope
Map packet events to interfaces and links by interface id; pulse the interface handle and animate a dot along the link for each observation (rate limited so high packet rates do not freeze the UI). Label every animation "observed at <interface>". Do not draw an end-to-end path from a single capture. Toggle to turn animation off. Respect `prefers-reduced-motion`.

## Acceptance
Component test: a packet event for interface X triggers the highlight on X and its link only. Manual: ping between namespaces in the sandbox shows pulses at captured interfaces.
