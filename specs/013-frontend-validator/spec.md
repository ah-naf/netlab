# Feature Specification: Lab Validator

**Feature Branch**: `013-frontend-validator` (directory name; work stays on the current git branch)

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "@TICKETS/NL-019-frontend-validator.md"

## Clarifications

### Session 2026-10-31

- Q: After Validate opens the list, should the list and highlights update by themselves as the lab is edited? → A: Live. After the first Validate, they re-run on every edit until the list is closed.
- Q: Can a derived Linux name fail to fit 15 characters? → A: No. The derivation shortens long names with a hash, so only a collision is an error.
- Q: Which interfaces count for the duplicate-address warning? → A: Any two address-holding interfaces in one segment with the same address, including two on the same node.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Check the lab and see every problem (Priority: P1)

The user builds a lab and presses a Validate button. The app checks the whole lab and shows a list of issues. Each issue has a severity (error or warning), a short code, the name of the resource it concerns, and a plain message. If the lab is clean, the list says so. The user reads the list and knows what to fix before deploying.

**Why this priority**: Without a check, a broken lab only fails at deploy time with a hard-to-read error. The list is the core value of this feature.

**Independent Test**: Build a lab with two interfaces on one node that share a name and a route whose gateway is not on any connected subnet. Press Validate. The list shows one error for the duplicate name and one error for the route, each naming its resource. Fix both and the list updates by itself to say the lab is valid.

**Acceptance Scenarios**:

1. **Given** a lab with no problems, **When** the user presses Validate, **Then** the panel shows that no issues were found.
2. **Given** a lab with problems, **When** the user presses Validate, **Then** every problem appears as one row with severity, code, resource name, and message.
3. **Given** a lab with both errors and warnings, **When** the list shows, **Then** errors come before warnings and the list shows the count of each.
4. **Given** the list is open, **When** the user fixes a problem, **Then** that issue is gone from the list at once, with no second Validate press.
5. **Given** the same lab, **When** the user presses Validate twice with no edit between, **Then** both lists are identical, in the same order.

---

### User Story 2 - Jump from an issue to the offending item (Priority: P1)

The user clicks an issue in the list. The canvas selects the node or link the issue is about, and the properties panel shows it, so the user can fix it at once. The offending nodes are also highlighted on the canvas while the list is open.

**Why this priority**: A list of problems is only half useful if the user must hunt for each resource by hand.

**Independent Test**: Make two namespaces share one name, press Validate, and click the issue. One of the two namespaces is selected. Highlights show on both offending nodes.

**Acceptance Scenarios**:

1. **Given** an issue about a node, **When** the user clicks it, **Then** that node is selected and shown in the properties panel.
2. **Given** an issue about a link, **When** the user clicks it, **Then** that link is selected.
3. **Given** an issue about an interface or a route, **When** the user clicks it, **Then** the node that owns it is selected.
4. **Given** the list is open, **When** the lab has issues, **Then** every node that an issue points to is highlighted on the canvas, errors and warnings in different looks.
5. **Given** the list is open, **When** the user fixes an issue, **Then** nodes with no remaining issue lose their highlight at once; closing the list removes all highlights.

---

### User Story 3 - See name problems as soon as they happen (Priority: P1)

Name problems are shown while the user edits, without pressing Validate. A name that is too long, has bad characters, is not unique within its scope, or whose deploy-time Linux name would collide with another is flagged at once, next to the field.

**Why this priority**: Names are the most common mistake and the cheapest to catch. The project decisions require this check on every edit.

**Independent Test**: Type a 16-character interface name and see the error at once. Type two namespace names that differ only after the 8th character, so they would shorten to the same Linux name, and see the collision flagged at once, with no Validate click.

**Acceptance Scenarios**:

1. **Given** the user types a name over the length limit or with bad characters, **When** the field changes, **Then** the error shows next to the field within the same edit.
2. **Given** two resources in the same scope get the same name, **When** the second name is entered, **Then** the error shows at once.
3. **Given** two different user-facing names would shorten to the same Linux name, **When** the second is entered, **Then** a collision issue shows at once, naming both resources.
4. **Given** a long name, **When** its deploy-time Linux name is derived, **Then** the derived name always fits the 15-character limit (shortened with a hash when needed), so a long name alone is never an error.
5. **Given** an invalid name is flagged, **When** the user presses Validate, **Then** the same issue is in the list with the same code.

---

### User Story 4 - Network rules are checked (Priority: P2)

The validator also checks the network content of the lab: addresses, routes, and the shape of the links and the nodes they join. Each rule has a stable code, so the same problem always shows the same code.

**Why this priority**: These checks catch a lab that would deploy but not work, or not deploy at all. The name checks (P1) cover the most common mistakes first.

**Independent Test**: Build one lab per rule below and press Validate on each. Each shows exactly the expected code. A lab that obeys every rule shows none.

**Acceptance Scenarios**:

1. **Given** an address that is not a valid IPv4 or IPv6 CIDR, **When** the lab is validated, **Then** an error names the interface that holds it.
2. **Given** a route whose gateway is not inside any prefix directly connected on its output interface, **When** the lab is validated, **Then** an error names the node and the route.
3. **Given** a link that points to an interface that does not exist, **When** the lab is validated, **Then** an error reports the dangling reference.
4. **Given** one interface used by two links, **When** the lab is validated, **Then** an error names the interface and both links.
5. **Given** a link endpoint that is not valid (for example both ends on the same interface, or an end that is not an interface of a namespace or a bridge), **When** the lab is validated, **Then** an error names the link.
6. **Given** an interface whose owner node is missing, or a node of a type that cannot hold the thing it holds (for example routes or NAT rules on a bridge, bridge settings on a namespace), **When** the lab is validated, **Then** an error names the item.
7. **Given** the same IP address on two interfaces that sit on the same layer-2 segment (directly linked, or joined through bridges), **When** the lab is validated, **Then** a warning names both interfaces, even when both are on the same node.
8. **Given** the same IP address on two interfaces in different segments, **When** the lab is validated, **Then** no warning is shown.

---

### User Story 5 - One rule set, one set of shared test cases (Priority: P2)

The rules are written once as a pure check of the lab document with no dependence on the screen. A folder of shared example labs, each with its expected issue codes, is kept so the later backend validator can be held to the same rules.

**Why this priority**: The backend validator is built later and must agree with this one. Shared examples make drift visible. They do not change what the user sees now.

**Independent Test**: Run every example lab through the validator by hand and compare the resulting codes with the expected codes in the file. All match.

**Acceptance Scenarios**:

1. **Given** the shared examples folder, **When** every example is checked, **Then** the issue codes match the expected codes of that example, in any order.
2. **Given** an example with no expected codes, **When** it is checked, **Then** no issue is returned.
3. **Given** every rule in this spec, **When** the examples are counted, **Then** each rule has at least one example that triggers it and one that is clean.
4. **Given** the examples are plain data files, **When** another program reads them, **Then** it needs no knowledge of this app to use them.

---

### Edge Cases

- An empty lab (no nodes, no links) is valid and shows no issues.
- A route with no gateway (an on-link route) has no gateway check, but its output interface must exist on the same node.
- A route with no output interface is checked against every directly connected prefix on the node; one match is enough.
- A gateway and a prefix of different IP families (IPv4 gateway, IPv6 prefix) do not match.
- An interface with no addresses is valid.
- A node name and a bridge name may not collide with each other (they share one scope); an interface name only collides with other interfaces of the same node.
- Two issues about the same resource with different codes are both shown.
- A single resource that breaks one rule in two ways (two bad characters) shows one issue per rule, not one per character.
- A lab loaded from a file with duplicate resource ids reports the duplicate ids; the other rules still run on a best-effort basis and never crash.
- Highlights point only at resources that exist; with the live list, an issue about a deleted resource disappears with it.
- If the user selects an issue's node and then edits another field, the list keeps its place and only changes rows whose issue changed.
- Layer-2 segments are found through links and bridges only; a link that is down still counts as joining its ends for the duplicate-address warning.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a check that takes a lab document and returns a list of issues, with no side effects and no dependence on the screen.
- **FR-002**: Each issue MUST have a severity (error or warning), a stable code, the id and name of the resource it concerns, and a human-readable message.
- **FR-003**: The check MUST be deterministic: the same document gives the same issues in the same order.
- **FR-004**: The check MUST report an error for a duplicate id among nodes, interfaces, or links.
- **FR-005**: The check MUST report an error for a duplicate name among nodes (namespaces and bridges share one scope) and among the interfaces of one node.
- **FR-006**: The check MUST report an error for an interface name that is not 1 to 15 characters, contains `/` or whitespace, or is `.` or `..`.
- **FR-007**: The check MUST report an error for an address that is not a valid IPv4 or IPv6 CIDR.
- **FR-008**: The check MUST report an error for a link endpoint that does not match an existing interface.
- **FR-009**: The check MUST report an error when one interface is used by more than one link.
- **FR-010**: The check MUST report an error for a link whose endpoints are not valid (same interface on both ends, or an endpoint that is not an interface of a namespace or bridge).
- **FR-011**: The check MUST report an error for a route whose gateway is not inside a prefix directly connected on the route's output interface; when no output interface is set, any directly connected prefix of the node is accepted.
- **FR-012**: The check MUST report an error for a node relationship that is not valid: an interface whose node is missing, a route, NAT rule, or router setting on a bridge, bridge settings on a namespace, or a NAT rule that points to an interface that is not on its node.
- **FR-013**: The check MUST report a warning for the same IP address on two interfaces in one layer-2 segment, where a segment is the set of interfaces joined by links through bridges. Any two address-holding interfaces in a segment count, including two on the same node.
- **FR-014**: The check MUST report an error when the Linux name derived from a user-facing name collides with the derived name of another resource. The derivation MUST always produce a name of at most 15 characters, so fit is guaranteed by construction and needs no separate error.
- **FR-015**: The name rules (FR-005, FR-006, FR-014) MUST run on every edit and show their issues next to the field at once, not only when Validate is pressed.
- **FR-016**: A Validate button MUST run all rules and show the result as a list, with the error count and the warning count. Once the list is open, it MUST re-run on every lab edit, including undo and redo, until the list is closed.
- **FR-017**: Clicking an issue MUST select the node or link it concerns; an issue about an interface, route, address, or NAT rule MUST select the owning node.
- **FR-018**: While the list is open, every node and link that an issue points to MUST be highlighted on the canvas, with a different look for errors and warnings.
- **FR-019**: Issue codes and rule meaning MUST be defined once and used by both the check and the shared examples; a rule MUST NOT have two codes and a code MUST NOT have two meanings.
- **FR-020**: Shared example labs MUST be plain data files in a shared folder, each with the lab and the list of expected issue codes, written so a later backend validator can read the same files.
- **FR-021**: The shared examples MUST cover every rule in this spec with at least one failing and one clean case.
- **FR-022**: The check MUST NOT crash or hang on any document the lab format allows, including empty or partly filled ones.
- **FR-023**: Per the project constitution, no automated test files are written; the behavior MUST be verified by hand in the running app and by checking the shared examples against the validator by hand.

### Key Entities

- **Issue**: One finding. Has a severity (error or warning), a stable code, the resource id and name it concerns, and a message.
- **Rule**: One named check with one code. Each rule has at least one failing and one clean shared example.
- **Shared example**: A plain data file with one lab and the issue codes the validator must return for it.
- **Layer-2 segment**: The set of interfaces joined by links through bridges; used for the duplicate-address warning.
- **Derived Linux name**: The deploy-time short name made from the user-facing name (see project decision 5); used only for the fit-and-collision check, never shown or stored.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user presses Validate on a lab of up to 200 resources and sees the result in under 1 second.
- **SC-002**: 100% of shared examples return exactly their expected issue codes.
- **SC-003**: A user finds and fixes a flagged problem from the list in under 30 seconds, without searching the canvas.
- **SC-004**: Name problems show next to the field within 200 ms of typing, with no Validate click.
- **SC-005**: Every rule in this spec has at least one failing and one clean shared example (100% coverage of rules).
- **SC-006**: 100% of issues that point to a live resource select that resource, or its owning node, when clicked.

## Assumptions

- The lab document format and its types from the earlier schema feature exist and are reused; the format does not change.
- Selection, the properties panel, field checks, and the lab name field from earlier features exist; this feature adds the Validate button, the issue list, and the highlights on top.
- The deploy-time Linux name rule is the one in project decision 5: a lab prefix plus a short lab id plus a deterministic short hash, fitting 15 characters. The exact derivation is reused as is, not redefined here.
- Severity split: broken references, bad names, bad addresses, and unreachable gateways are errors; duplicate IP on one segment is a warning because it can be on purpose in a lab.
- The check does not run on the backend and does not block saving or editing; blocking deploy on errors comes with a later feature.
- The backend validator itself is out of scope here; only the shared examples that it will also use are in scope.
- Rules the lab format cannot express yet (VLAN, NAT correctness beyond references) are out of scope.
- Dependency: the topology schema feature (NL-011) is complete.
