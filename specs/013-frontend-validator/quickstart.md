# Quickstart: Lab Validator (hand checks)

Prerequisites: `cd web && npm install && npm run dev`; open the app in a browser.

## 1. Vectors (US5, SC-002, SC-005)
Run `node web/scripts/checkVectors.ts` from the repo root. Expect every file listed OK and exit code 0. Break one `expectedCodes` on purpose to see exit 1, then undo.

## 2. Validate and list (US1)
1. Add two namespaces and one bridge. Press **Validate**: the drawer opens on **Issues** and says no issues.
2. Rename the second namespace to the first one's name. The list adds `DUPLICATE_NODE_NAME` at once, with the count showing 1 error.
3. Rename it back: the row disappears with no second Validate press (live list).
4. Undo and redo the rename: the row follows.

## 3. Jump and highlight (US2, SC-006)
With the duplicate name from step 2 still in place, click the row: that namespace is selected and the properties panel shows it. Both namespaces carry the error ring. Close the list: the rings go away.

## 4. Names while typing (US3, SC-004)
Without opening the list, type a 16-character interface name: error shows next to the field. Type two long namespace names with the same first characters whose derived names collide (the pair stored in `testdata/validation/linux-name-collision-fail.json`): the collision error shows at once.

## 5. Network rules (US4)
Codes that the app cannot build (the field checks block them, and Save and open are not available yet) are covered by the vectors in section 1: `INVALID_CIDR`, `DANGLING_ENDPOINT`, `LINK_SAME_INTERFACE`, `INTERFACE_IN_TWO_LINKS`, `LINK_ENDPOINT_KIND`, `INTERFACE_NODE_MISSING`, `DUPLICATE_ID`, and the node-field codes. Build these in the app and check the codes by hand:
- Route with gateway outside every connected prefix: `ROUTE_GATEWAY_UNREACHABLE`.
- Same address on two namespaces joined through a bridge: `DUPLICATE_IP_ON_SEGMENT` warning; on two namespaces in different segments: none.

## 6. Speed (SC-001)
The vector script also times one `validate` call on a generated lab of 200 resources and prints the milliseconds; expect under 1000. In the app, press Validate on any lab: the list shows with no visible delay.

Done when every step matches. Contracts: [issue-codes](contracts/issue-codes.md), [vector-format](contracts/vector-format.md).
