# NL-056: Desired versus observed UI

- Milestone: 3
- Depends on: NL-054, NL-055, NL-017
- Size: M

## Scope
Properties panel shows Desired and Observed columns side by side with mismatch highlighted and an inspection error state. Canvas status styles: desired (not deployed), deployed (observed matches), drifted, failed, unknown. Drift list view with a click to select the resource. Legend explaining the colors.

## Acceptance
Component tests for each status. Manual: deploy, change state in the sandbox, refresh, and see the drift badge.
