# UI Contract: Namespace Properties Panel

Lives in the right column (`<aside aria-label="Inspector">`, existing region).

## Views

| Selection | View |
|---|---|
| One namespace node | Namespace form |
| One bridge node | Existing node view (link and bridge panel feature changes it) |
| Several nodes | Existing "N nodes selected" text |
| Nothing selected | Lab name field plus the existing hint |

## Namespace form, top to bottom

| Section | Content |
|---|---|
| Error banner | "This lab has errors" with a count, only while any field has an unresolved error |
| Name | Node name field |
| Role | Select with Host and Router; read-only text for NAT or no role |
| Interfaces | One block per interface (below), then the existing add-interface control |
| Default gateway | One field |
| Static routes | Table plus "Add route" |

## Interface block

| Part | Behavior |
|---|---|
| Name | Text field |
| MTU | Text field, digits |
| State | Select: up, down |
| Addresses | One row per address with Remove; an "Add address" field below |
| Observed | Read-only "Not deployed" |
| Remove interface | Existing control |

## Route row

Destination, gateway, output interface (select of this node's interfaces by name), metric, Observed ("Not deployed"), Remove. "Add route" shows an empty row; it is stored when the user confirms with a valid, complete route.

## Field behavior (every text field)

| Input | Result |
|---|---|
| Typing | Draft updates; the rule runs; the error shows under the field in `text-led-fault`, `role="alert"` |
| Enter or leaving the field, draft valid | Value written to the lab, error cleared, one undo step |
| Enter or leaving the field, draft invalid | Nothing written; draft and error stay |
| Escape | Field returns to the lab value; error cleared |
| Select or add | Selects write immediately (they cannot be invalid) |

Fields have a visible label (or `aria-label`), error text is linked with `aria-describedby`, invalid fields set `aria-invalid`.

## Error banner

Reads `hasFieldErrors` and the error count. Text: "This lab has errors (N)". Disappears at 0.

## Canvas link

Name, interface names, and addresses edited here show on the node card as soon as the value is written.
