<!--
Sync Impact Report
Version change: (unfilled template) -> 1.0.0
Modified principles: none (first adoption)
Added sections: Core Principles I-VII, Stack and Structure, Development Workflow, Governance
Removed sections: none
Follow-up TODOs: none
-->
# NetLab Constitution

## Core Principles

### I. Go Backend, React Frontend
The backend MUST be written in Go. The frontend MUST be written in React with TypeScript.
No other application language or framework is introduced without a constitution amendment.
Rationale: one stack per side keeps the code base small and consistent.

### II. Simple, Concise Code
Code MUST use the shortest clear form. If a task takes one or two lines, do not write five or six.
Avoid dense inline logic: extract it into a named helper instead. Prefer the standard library and
existing project helpers over new code or new dependencies. The ponytail skill and the
frontend-design skill MUST be used where they apply (ponytail for every coding task, frontend-design
for UI work).
Rationale: less code is easier to read, review, and maintain.

### III. Small, Reusable Functions
A function MUST NOT exceed 100 lines; most SHOULD be far shorter and do one thing. Shared logic
MUST live in one reusable place (DRY), and code MUST follow common design principles (single
responsibility, separation of concerns, clear module boundaries).
Rationale: small single-purpose units are reusable and understandable.

### IV. No Magic Strings
Literal strings and numbers with meaning (operation names, event types, status values, endpoint
paths, error codes, limits, timeouts) MUST be named constants or typed enums defined once and
imported where used. Inline literals are allowed only for trivial, self-explanatory values.
Rationale: one definition prevents typos and mismatches between frontend and backend.

### V. Readable Names, Minimal Comments
Variables, functions, and types MUST have simple, readable names. Comments MUST be added only when
the code cannot explain itself, and MUST be short and informative (explain why, not what).
Rationale: good names remove the need for most comments.

### VI. Proper Folder Structure
Frontend and backend MUST each follow a clear, conventional layout with code grouped by
responsibility (for example `web/src/{components,hooks,store,api,types,constants}` and
`api/{cmd,internal/<package>}`). A file belongs in the folder that matches its responsibility.
Rationale: predictable locations make the code base navigable and reusable.

### VII. Sandboxed Privileged Execution (NON-NEGOTIABLE)
Go code that creates namespaces, links, bridges, routes, firewall rules, or captures packets MUST
be run only inside the sandbox harness (`scripts/sandbox.sh`, a throwaway user, network, and mount
namespace), never directly against the developer's real network stack. No command or Makefile target
may use `sudo` for lab operations. The worker MUST refuse to start outside the sandbox unless the
explicit disposable-VM override is set.
Rationale: lab operations must never alter the developer's real Linux machine.

## Stack and Structure

- Backend: Go, `net/http` or a lightweight router, REST under `/api/v1`, WebSockets for events.
- Frontend: React, TypeScript, Vite, `@xyflow/react`, Tailwind CSS, Zustand.
- Tests: tests are NOT written and TDD is NOT used, by project decision. Verify changes by running
  the application (in the sandbox for privileged code). Tickets that mention tests are satisfied by
  running the described check by hand.
- Security-relevant rules from the product spec (typed operations, no shell execution, input
  validation, lab-owned resources only) still apply and are enforced by design and code review.

## Development Workflow

- Work follows the tickets in `TICKETS/` and the product spec in `DRAFT.md`.
- Every change MUST satisfy Principles II to VII before it is considered done.
- Never claim a Linux networking check passed unless it was actually run in the sandbox.
- Keep the application runnable after each ticket.

## Governance

This constitution supersedes other project practices. Amendments require a written change to this
file, a version bump, and an updated Last Amended date. Versioning follows semantic versioning:
MAJOR for removed or redefined principles, MINOR for added principles or materially expanded
guidance, PATCH for wording fixes. Every change and review MUST check compliance with the
principles above, and any deviation MUST be justified in the change description.

**Version**: 1.0.0 | **Ratified**: 2026-10-29 | **Last Amended**: 2026-10-29
