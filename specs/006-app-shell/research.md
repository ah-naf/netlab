# Research: App Shell Layout

No NEEDS CLARIFICATION remain. Decisions below.

## Resizing

- **Decision**: Own small `useResizeDrag` hook using pointer events, plus a `ResizeHandle` component (`role="separator"`, focusable, arrow keys change size by a named step).
- **Rationale**: Three drag edges, no touch. About 30 lines. Matches principle II (no new dependency).
- **Alternatives**: `react-resizable-panels` (new dependency, more than needed); CSS `resize` (no limits, no handles between panels).

## Layout

- **Decision**: CSS grid on a `h-screen` root. Columns `left | 1fr | right`, rows `toolbar | main | drawer`. Sizes come from the store as inline CSS values. `min-w-[1024px]` on the root so narrow windows scroll sideways.
- **Rationale**: Grid gives a fixed toolbar, a center that takes the extra space, and no page scrollbar with `overflow-hidden` on panels.
- **Alternatives**: Nested flex (more wrappers); absolute positioning (fragile).

## Remembered state

- **Decision**: One Zustand store (`useLayoutStore`) with the built-in `persist` middleware and a `safeStorage` wrapper (try/catch on get, set, remove). Values are clamped on load (`merge`) and on every set.
- **Rationale**: Zustand is already in the stack. One key holds all five values. Blocked or full storage falls back to defaults silently (FR-007).
- **Alternatives**: Hand-written `useLocalStorage` hook per value (five reads, duplicated clamping).

## Theme

- **Decision**: CSS variables for named colors in `index.css`: light values in `:root`, dark values under `@media (prefers-color-scheme: dark)`. Tailwind v4 `@theme inline` maps them to utilities (`bg-surface`, `text-fg`, `border-line`, status colors).
- **Rationale**: One place for colors (FR-011). Browser follows system changes with no JS, so no reload (US5 scenario 3).
- **Alternatives**: Tailwind `dark:` variant on every class (colors scattered); JS theme listener (extra code).

## Disabled buttons and hover message

- **Decision**: Button gets `disabled` plus `title="Not available yet"`. Disabled buttons do not fire pointer events in some browsers, so wrap each in a `span` that carries the `title`.
- **Rationale**: Native tooltip, no library, shows within about 1 second. Wrapper span makes the hover reliable.
- **Alternatives**: Custom tooltip component (more code, not required).

## Tabs

- **Decision**: `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected`. Arrow keys move between tabs. Tab list is one constant array.
- **Rationale**: Meets FR-012 (active tab announced) with plain elements.

## Connection indicator

- **Decision**: Reuse `ConnectionIndicator` unchanged in behavior. Swap its hard-coded gray/green/amber/red dot classes for the status theme tokens so it stays readable in dark mode.
