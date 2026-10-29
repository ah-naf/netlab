# Quickstart: App Shell Layout (manual checks)

Prerequisite: `cd web && npm install`. No tests exist (constitution), so all checks are by hand.

```bash
cd web && npm run dev      # open the printed URL
npm run build && npm run lint && npm run format:check
```

Optional: also run the API (`make` target from NL-010) to see "API online".

## Checks

1. **Layout (US1, SC-001)**: Browser devtools device size 1280x720, then 1920x1080. Five regions visible, no page scrollbar, center takes extra space.
2. **Toolbar (US2, SC-004, SC-006)**: "NetLab", "Untitled lab", five buttons, connection status. All five buttons disabled. Hover each: "Not available yet" shows. No separate header remains.
3. **Resize (US3, SC-002)**: Drag both column edges and the drawer edge: sizes change and stop at limits; center never under 400 px. Focus an edge, use arrow keys.
4. **Collapse (US3)**: Collapse drawer: only the tab bar stays; center grows. Reopen.
5. **Persist (US3, US4, SC-003)**: Resize, collapse, pick "Routes", reload: all restored.
6. **Bad storage (FR-007)**: In devtools set `netlab.layout` to `{"leftWidth":99999,"activeTab":"x"}` and reload: values clamped, default tab, no error. Block site storage and reload: defaults, no error.
7. **Tabs (US4, SC-005)**: Click all nine in order: each shows its name and "Not available yet", no sample data. Arrow keys move between tabs.
8. **Theme (US5, SC-007)**: Devtools rendering emulation, `prefers-color-scheme` light and dark: app switches with no reload, text and borders readable, status dot colors visible.
9. **Narrow (edge)**: Width 900 px: page scrolls sideways, nothing hidden.
10. **Theme switch (FR-011)**: Click the sun/moon button in the toolbar: theme flips and the label says the other theme. Reload: choice kept, no flash of the other theme. Clear `netlab.theme` and reload: system setting applies again, and changing the system setting switches the app without a reload.
11. **Short window (edge)**: Height 400 px: canvas keeps at least 160 px, drawer shrinks, collapse still works.
12. **Narrow window (edge)**: Width 900 px: page scrolls sideways. Set `netlab.layout` to `{"leftWidth":400,"rightWidth":480}` at width 1024: center stays at least 400 px.

Contracts: [ui-contract.md](contracts/ui-contract.md). State: [data-model.md](data-model.md).
