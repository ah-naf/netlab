# Feature Specification: App Shell Layout

**Feature Branch**: `006-app-shell` (directory name; work stays on the current git branch)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "@TICKETS/NL-013-app-shell.md"

## Clarifications

### Session 2026-10-29

- Q: Should the Save and Validate buttons be disabled until their features exist, or stay clickable and show a "not available yet" message? → A: Disabled until their features exist, with a hover message saying "not available yet".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A familiar workspace layout (Priority: P1)

When the user opens the app they see a desktop workspace like a network diagram tool: a toolbar across the top, a component column on the left, a large central work area, an inspector column on the right, and a drawer along the bottom. Every area is clearly labeled, and nothing overflows or overlaps on common desktop screen sizes.

**Why this priority**: Every later feature (editor, inspector, logs, packet view) needs a place to live. The layout is the frame for all of them.

**Independent Test**: Open the app at 1280x720 and at 1920x1080. All five areas are visible, none overflow, and there is no page-level scrollbar.

**Acceptance Scenarios**:

1. **Given** the app is open at 1280x720, **When** the user looks at the screen, **Then** the toolbar, left column, center area, right column, and bottom drawer are all visible and no area is cut off.
2. **Given** the app is open at 1920x1080, **When** the user looks at the screen, **Then** the same five areas fill the screen with the center area taking the extra space.
3. **Given** the layout, **When** the user checks the page, **Then** there is no page-level scrollbar and the app fills the window height.

---

### User Story 2 - Toolbar with the lab actions (Priority: P1)

The toolbar shows the app name, the current project name, and the lab actions: Save, Validate, Deploy, Stop lab, and Reset lab, plus the API connection status already built. Actions whose features do not exist yet are visibly disabled and say so, so the user never clicks something that does nothing.

**Why this priority**: The toolbar is the main control surface and sets the user's picture of what the app can do.

**Independent Test**: Look at the toolbar. All names and buttons are present, the unavailable buttons are disabled, and hovering a disabled button explains why.

**Acceptance Scenarios**:

1. **Given** the toolbar, **When** the user looks at it, **Then** it shows "NetLab", a project name, buttons labeled Save, Validate, Deploy, Stop lab, and Reset lab, and the connection status.
2. **Given** an action whose feature is not built yet, **When** the user looks at its button, **Then** it appears disabled and cannot be clicked.
3. **Given** a disabled button, **When** the user hovers over it, **Then** a short message explains it is not available yet.
4. **Given** the connection status already built, **When** the toolbar is shown, **Then** the status appears in the toolbar and no longer sits in a separate header.

---

### User Story 3 - Resizable columns and a collapsible drawer (Priority: P2)

The user can drag the edges between the left column, the center area, and the right column to change their widths, and drag the edge above the bottom drawer to change its height. The drawer can be collapsed to just its tab bar and opened again. The app remembers these sizes and the collapsed state the next time it opens.

**Why this priority**: Different tasks need different space (wide canvas, tall logs), but the fixed layout already works without it.

**Independent Test**: Drag each edge and confirm the sizes change within limits. Reload the page and confirm the sizes are restored. Collapse and reopen the drawer.

**Acceptance Scenarios**:

1. **Given** the layout, **When** the user drags the edge between two columns, **Then** the widths change and the center area never becomes unusably small.
2. **Given** the layout, **When** the user drags the edge above the drawer, **Then** the drawer height changes within limits.
3. **Given** the user resized panels or collapsed the drawer, **When** the page is reloaded, **Then** the same sizes and collapsed state are restored.
4. **Given** the drawer is open, **When** the user collapses it, **Then** only the tab bar stays visible and the center area grows to fill the space.
5. **Given** saved sizes cannot be read (storage blocked or cleared), **When** the app opens, **Then** it uses the default sizes and works normally.

---

### User Story 4 - Drawer tabs that are honest about what exists (Priority: P2)

The bottom drawer has nine tabs: Deployment logs, Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT, Packet capture, and Diagnostics. Selecting a tab shows a panel that clearly says "Not available yet". Tabs never show made-up data.

**Why this priority**: The tab list shows where the product is going, but fake data would mislead. It builds on the drawer from the previous story.

**Independent Test**: Click through all nine tabs. Each shows its own name and the "Not available yet" message, with no sample data.

**Acceptance Scenarios**:

1. **Given** the drawer is open, **When** the user looks at the tab bar, **Then** all nine tabs are visible with the names above.
2. **Given** any tab, **When** the user selects it, **Then** it becomes the active tab and shows a panel with its name and "Not available yet".
3. **Given** a tab panel, **When** the user looks at it, **Then** no sample or placeholder data is shown.
4. **Given** the user selected a tab and reloaded the page, **When** the app opens, **Then** the same tab is active.

---

### User Story 5 - Light and dark appearance (Priority: P3)

The app follows the user's system appearance. In dark mode and in light mode, text, panels, borders, and status colors stay readable and consistent.

**Why this priority**: A polish item that matters for long sessions but does not block any workflow.

**Independent Test**: Switch the system appearance between light and dark and confirm the app follows, with readable text everywhere.

**Acceptance Scenarios**:

1. **Given** the system appearance is dark, **When** the app opens, **Then** it uses the dark colors.
2. **Given** the system appearance is light, **When** the app opens, **Then** it uses the light colors.
3. **Given** the app is open, **When** the system appearance changes, **Then** the app switches without a reload.

---

### Edge Cases

- Window narrower than 1024 pixels: the layout keeps working with a minimum usable width, and the page may scroll sideways rather than hiding areas. Phones are not supported.
- Window very short: the drawer and canvas both keep a minimum height, and the drawer can be collapsed to make room.
- Saved sizes from an older layout or out of range: they are clamped to the allowed limits.
- Storage is blocked, full, or cleared: the app uses defaults and does not show an error.
- The user drags an edge outside the window: the size stops at its limit.
- Keyboard use: the tabs and buttons can be reached and used with the keyboard, and disabled buttons are skipped or announced as disabled.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST show a toolbar across the top, a left column, a center area, a right column, and a collapsible bottom drawer, filling the window with no page-level scrollbar.
- **FR-002**: The toolbar MUST show the app name "NetLab", the current project name, the buttons Save, Validate, Deploy, Stop lab, and Reset lab, and the API connection status.
- **FR-003**: Buttons whose features are not built yet MUST be disabled and MUST explain why on hover with the text "not available yet" (a disabled button is never clickable, so it shows no message on click). Deploy, Stop lab, and Reset lab are disabled until the deployment feature exists. Save and Validate are disabled until their features exist.
- **FR-004**: The previous standalone header MUST be replaced by the toolbar, with the connection status unchanged in behavior.
- **FR-005**: The left and right columns MUST be resizable by dragging, within a minimum and maximum width, and the center area MUST keep a minimum width.
- **FR-006**: The drawer MUST be resizable by dragging within a minimum and maximum height, and MUST collapse to its tab bar and reopen.
- **FR-007**: Panel sizes, the drawer's collapsed state, and the active tab MUST be remembered between visits. If remembered values cannot be read or are out of range, defaults and limits MUST apply without an error.
- **FR-008**: The drawer MUST have exactly nine tabs in this order: Deployment logs, Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT, Packet capture, Diagnostics.
- **FR-009**: Each tab MUST show a panel with its name and the text "Not available yet" and MUST NOT show sample data.
- **FR-010**: The left column, center area, and right column MUST show clearly labeled empty areas (for example "Components", "Canvas", "Inspector") that say they are not available yet, until their features exist.
- **FR-011**: The app MUST support light and dark appearance, following the system setting, with named color values defined in one place.
- **FR-012**: Buttons, tabs, and drag edges MUST be reachable and usable with the keyboard, and the active tab MUST be announced to assistive tools.
- **FR-013**: No tests are written (constitution). The visual and behavior checks are done by hand at 1280x720 and 1920x1080.

### Key Entities

- **Layout state**: Left column width, right column width, drawer height, drawer collapsed or open, and the active tab. Remembered between visits.
- **Drawer tab**: A fixed name and a "not available yet" panel. Nine in total.
- **Toolbar action**: A label, an enabled or disabled state, and the reason it is disabled.
- **Theme**: Light or dark, taken from the system, with one set of named colors for each.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1280x720 and at 1920x1080, all five areas are fully visible with no overflow and no page-level scrollbar.
- **SC-002**: A panel resize or drawer collapse responds as the user drags, with no visible lag, and the layout stays usable at every position within the limits.
- **SC-003**: After a reload, 100% of the remembered values (sizes, collapsed state, active tab) are restored.
- **SC-004**: All nine tab names and all five toolbar buttons are visible and spelled as listed.
- **SC-005**: 0 tabs show sample or made-up data.
- **SC-006**: Every disabled button explains why within 1 second of hovering.
- **SC-007**: Text stays readable in both light and dark appearance (no unreadable text or hidden borders).

## Assumptions

- The connection indicator and the API client from the health feature exist and are reused in the toolbar.
- Desktop-first: a minimum window width of 1024 pixels is supported. Phones and tablets are out of scope.
- The project name shows a default such as "Untitled lab" until the save and open features exist, and it is not editable yet.
- Save and Validate are also disabled (not only Deploy, Stop, and Reset), as confirmed by the owner, because their features do not exist yet and an enabled button that does nothing would mislead. They are enabled when their features arrive.
- The app follows the system light or dark setting. A manual theme switch is out of scope.
- Remembered values live in the browser's local storage, wrapped so that unavailable storage never causes an error.
- Resizing uses simple mouse dragging plus keyboard arrows on the drag edges. Touch support is out of scope.
- The ticket's Vitest test is dropped because the constitution says no tests are written. The checks are manual (FR-013).
- The look follows the project's frontend-design guidance for a professional, network-engineering tool.
