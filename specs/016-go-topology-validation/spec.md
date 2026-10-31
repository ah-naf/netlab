# Feature Specification: Backend Lab Validation

**Feature Branch**: `016-go-topology-validation` (directory name; work stays on the current git branch)

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "@TICKETS/NL-030-go-topology-validation.md"

## Clarifications

### Session 2026-10-31

- Q: Where should examples for the backend-only checks live, since the editor does not produce those codes? → A: In their own subfolder (for example `testdata/validation/backend/`) that only the backend check reads. The top-level shared folder keeps only codes both sides produce. The existing-names input is stored in the example file next to the lab.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A bad lab is refused before anything is changed (Priority: P1)

Before any lab is deployed, the server checks the whole lab document. If it has problems, the server refuses it and returns every problem found, not only the first. Each problem has a severity, a stable code, the resource it concerns, and a plain message. Nothing on the machine is touched while a lab has errors.

**Why this priority**: Deploying changes the real network setup. A broken lab must never reach that step, and the user must see everything to fix in one go instead of one error per attempt.

**Independent Test**: Give the checker a lab with a duplicate node name, a dangling link end, and a bad interface name. It returns all three issues in one result. Give it a clean lab: it returns no issues.

**Acceptance Scenarios**:

1. **Given** a lab with several problems, **When** it is checked, **Then** the result lists every problem, each with severity, code, resource id, resource name, and message.
2. **Given** a lab with errors, **When** the check result is used to decide a deploy, **Then** the result says the lab must be refused and carries the full issue list; the job API (NL-037) applies it so no change is made to the machine.
3. **Given** a lab with only warnings, **When** it is checked, **Then** the warnings are returned and the lab is still accepted.
4. **Given** a clean lab, **When** it is checked, **Then** the result is empty.
5. **Given** the same lab, **When** it is checked twice, **Then** both results are identical, in the same order.
6. **Given** an empty lab, **When** it is checked, **Then** the result is empty and nothing fails.

---

### User Story 2 - The backend and the frontend always agree (Priority: P1)

The backend applies the same rules and returns the same issue codes as the editor in the browser. A shared folder of example labs, each with its expected issue codes, is checked against the backend. Every example gives exactly the expected codes, so a lab that the editor accepts is accepted by the server and a lab the editor flags is flagged with the same codes.

**Why this priority**: If the two sides disagree, users see a clean editor and then a server refusal, or the reverse. The shared examples are the contract that prevents this.

**Independent Test**: Run every shared example through the backend checker and compare the codes with the expected codes. All match.

**Acceptance Scenarios**:

1. **Given** the shared example folder, **When** every example is checked by the backend, **Then** the codes match the expected codes of that example, in any order.
2. **Given** an example with no expected codes, **When** it is checked, **Then** no issue is returned.
3. **Given** each rule in the shared issue-code contract, **When** the examples run, **Then** every code has at least one example that triggers it and one clean example.
4. **Given** a rule changes in the shared contract, **When** the examples are run, **Then** a mismatch is visible at once.
5. **Given** the editor and the backend check the same lab, **When** their results are compared, **Then** the codes are equal.

---

### User Story 3 - Deploy-time names are safe and never clash (Priority: P1)

Every node in a lab gets a deploy-time Linux name derived from its user-facing name. The backend checks that each derived name fits the 15-character limit and that no two nodes derive the same name, using the exact same derivation as the editor. A lab where two nodes would end up with the same Linux name is refused.

**Why this priority**: A name clash at deploy time would make one node overwrite or fail on another's namespace or bridge. This is the only place the backend can guarantee it.

**Independent Test**: Check a lab with two long node names that shorten to the same Linux name: a name-collision issue is returned. Check a lab with two long names that do not collide: no issue.

**Acceptance Scenarios**:

1. **Given** two nodes whose derived Linux names are equal, **When** the lab is checked, **Then** a name-collision issue names the later node and the other node.
2. **Given** any node name, **When** its Linux name is derived, **Then** it is at most 15 characters.
3. **Given** the same lab name and node name, **When** the name is derived by the backend and by the editor, **Then** the result is identical.
4. **Given** a short node name, **When** it is derived, **Then** it keeps the full name after the lab prefix.

---

### User Story 4 - Backend-only checks: unsupported types and existing names (Priority: P2)

The backend knows things the editor cannot: whether a node type is supported, and which lab-owned resource names already exist on the machine. It refuses a lab with an unsupported node type. Given the set of lab-owned names that already exist, it refuses a lab whose derived names would clash with names owned by another lab, while allowing names already owned by the same lab (a redeploy).

**Why this priority**: These protect the machine from other labs' resources and from node kinds that cannot be deployed. They matter for deploy but not for basic drawing.

**Independent Test**: Check a lab that has a node of an unknown type: an unsupported-type issue is returned. Check a lab with a derived name that is in the provided existing list owned by a different lab id: a name-conflict issue is returned. Check the same lab with the name owned by itself: no conflict.

**Acceptance Scenarios**:

1. **Given** a node whose type is not a supported type, **When** the lab is checked, **Then** an unsupported-node-type issue names that node.
2. **Given** a list of existing lab-owned names, each with its owner lab id, and a lab whose derived name equals one owned by a different lab id, **When** the lab is checked, **Then** a name-conflict issue names the node and the existing name.
3. **Given** an existing name owned by this lab's own id, **When** the lab is checked, **Then** no conflict is raised (the lab is being redeployed).
4. **Given** no existing names are provided, **When** the lab is checked, **Then** the existing-name check is skipped.
5. **Given** a name in the existing list that does not start with the lab-owned prefix `nl-`, **When** the lab is checked, **Then** it is ignored (it is not lab-owned).

---

### User Story 5 - Run the check without a test framework (Priority: P2)

A developer can run the shared examples against the backend checker with one command and see which examples pass or fail, so the check can be done by hand without writing test files.

**Why this priority**: The ticket's acceptance asks for passing tests, but the project rule is that tests are not written. A runnable check gives the same proof by hand.

**Independent Test**: Run the one command. Every example prints `ok`, the command exits 0. Break one expected code on purpose: it prints `FAIL` and exits non-zero.

**Acceptance Scenarios**:

1. **Given** the shared examples, **When** the developer runs the check command, **Then** one line per example says `ok` or `FAIL` with expected and actual codes.
2. **Given** any mismatch or any issue code without a failing and a clean example, **When** the command ends, **Then** it exits non-zero.
3. **Given** the command, **When** it runs, **Then** it needs no privileges, no network, and no machine changes.
4. **Given** the example files are shared with the editor, **When** the command reads them, **Then** it reads the same top-level files with no copy, and it also reads the backend-only examples in the backend subfolder.
5. **Given** a backend-only example, **When** the editor's own example check runs, **Then** it never reads it, so the editor check is unaffected.

---

### Edge Cases

- A lab file with a missing or unsupported schema version is refused before rules run, with the existing version error; the rules never run on an unreadable document.
- A lab with duplicate ids still runs every other rule on a best-effort basis and never crashes.
- Missing optional parts (no layout, no routes, no bridge settings) are valid.
- A node name that is only spaces is an empty-name issue, not a collision.
- Two nodes with the same name never also raise a Linux-name collision (one issue per cause).
- An interface address list with an invalid CIDR gives one issue per bad address, and the other address rules skip it.
- IPv4 and IPv6 addresses and gateways never match each other.
- A lab with thousands of resources is checked without noticeable delay.
- The existing-names set may be huge; the check does not slow down for typical sizes.
- The result never depends on map iteration order or the clock.
- A node type the editor can never produce (for example from a hand-edited file) is reported, not ignored.
- The check never changes the lab document it reads.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST provide a check that takes a lab document and returns all issues found, not only the first.
- **FR-002**: Each issue MUST have a severity (error or warning), a stable code, the id and name of the resource it concerns, a message, and the ids of related resources.
- **FR-003**: The check MUST be deterministic, MUST NOT change the document, and MUST need no privileges.
- **FR-004**: The backend MUST implement every rule and issue code in the shared issue-code contract, with the same code strings and the same meaning as the editor.
- **FR-005**: The backend MUST derive deploy-time Linux names with the same derivation as the editor, always producing at most 15 characters.
- **FR-006**: The backend MUST report a name collision when two nodes derive the same Linux name.
- **FR-007**: The backend MUST report a node whose type is not a supported type as its own backend issue code.
- **FR-008**: Given a list of existing lab-owned names, each with its owner lab id, the backend MUST report a conflict when a derived name equals an existing name owned by a different lab id (an entry with no owner counts as a different lab), MUST NOT report one for names owned by this lab's own id, MUST ignore names that do not start with the lab-owned prefix `nl-`, and MUST skip the check when no list is given.
- **FR-009**: The check MUST let callers tell that a lab with any error-severity issue must be refused before any change to the machine (warnings MUST NOT make it refused); the job API (NL-037) applies this before touching the machine.
- **FR-010**: The check MUST give the job API everything it needs to return the full issue list, not only the first, when it refuses a lab, with the response shape documented here; the endpoint itself is built in NL-037.
- **FR-011**: The shared example labs in the shared test-data folder MUST all produce exactly their expected codes when run through the backend; examples for the backend-only codes MUST live in a separate subfolder read only by the backend check, each holding the lab, the expected codes, and, for the existing-name check, the set of existing names.
- **FR-012**: The backend MUST include a command that runs every shared example and exits non-zero on any mismatch or on any issue code without both a failing and a clean example.
- **FR-013**: The check MUST NOT crash or hang on any document the format allows, including partly filled and duplicate-id documents.
- **FR-014**: New backend-only issue codes (unsupported node type, name conflict with an existing name) MUST be added to the shared issue-code contract so both sides can read it; the editor is not required to produce them.
- **FR-015**: Per the project constitution, no automated test files are written; the behavior MUST be verified by running the check command and the shared examples by hand.

### Key Entities

- **Issue**: One finding with severity, code, resource id and name, message, and related ids.
- **Issue code**: A stable string with one fixed meaning, shared by the editor and the backend.
- **Derived Linux name**: The deploy-time name made from a node's user-facing name and the lab id; at most 15 characters.
- **Existing name list**: Lab-owned Linux names already on the machine, each with its owner lab id, provided by the caller.
- **Shared example**: A plain data file with one lab and the issue codes it must give; used by both sides.
- **Backend-only example**: The same kind of file, in a separate subfolder, that may also hold a set of existing names; read only by the backend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of shared examples return exactly their expected issue codes through the backend.
- **SC-002**: For every lab in the top-level shared examples, the backend and the editor return the same set of codes (100% agreement); backend-only examples are checked by the backend alone.
- **SC-003**: A lab with 10 problems returns all 10 in one result (no first-error stop).
- **SC-004**: A lab of 200 resources is checked in under 1 second.
- **SC-005**: Every issue code in the shared contract has at least one failing and one clean example (100% coverage).
- **SC-006**: For 100% of labs with at least one error, the check reports that the lab must be refused and returns every error; the job API (NL-037) uses this to refuse before any change to the machine.
- **SC-007**: A developer runs the whole shared check with one command in under 1 minute.

## Assumptions

- The shared issue-code contract and example folder from the editor validation feature exist and are the source of truth; the backend follows them and does not redefine any code.
- The derivation of Linux names is the one in that contract (lab prefix, lab id, short hash), and both sides must give the same result for the same input.
- The lab document model and its version conversion already exist on the backend and are reused; documents with an unsupported version are refused by the existing version check before rules run.
- "Lab-owned" names start with the prefix `nl-`. Because a derived name always begins with this lab's own id part, ownership is decided by the owner lab id given with each existing name, not by the prefix alone (two labs can share the same short id part).
- This ticket builds the check and the refusal result; the job API (NL-037) builds the endpoint that refuses a lab and calls the check before any kernel change.
- The caller (the plan builder and the job API, later tickets) supplies the existing names; where those names come from is out of scope here.
- Backend-only codes (unsupported node type, name conflict) are added to the shared contract; the editor may show them later but is not required to. Their examples live in a backend-only subfolder so the editor's example check, which reads only the top-level folder, is unaffected.
- Warnings never block a deploy; only errors do.
- Per the project constitution, no test files are written; the ticket's `go test` acceptance is met by running the check command and the shared examples by hand.
