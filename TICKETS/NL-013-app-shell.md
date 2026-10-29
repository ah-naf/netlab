# NL-013: App shell layout

- Milestone: 1
- Depends on: NL-010
- Size: M

## Scope
Desktop-first layout from DRAFT.md section 3: top toolbar (name, project name, Save, Validate, Deploy, Stop lab, Reset lab, status), left palette column, center canvas area, right inspector column, collapsible bottom drawer with the tab list (Deployment logs, Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT, Packet capture, Diagnostics). Tabs render placeholders that say "Not available yet" and are clearly disabled, not fake data.
- Resizable panels, remembered sizes in localStorage, dark and light theme tokens.
- Toolbar buttons exist but Deploy, Stop, Reset are disabled until NL-041.

## Acceptance
- Visual check at 1280x720 and 1920x1080: no overflow, panels resize, drawer collapses.
- Vitest render test confirms all tab labels and toolbar buttons exist.
