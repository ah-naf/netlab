# NL-cleanup: Remove everything the simple lab does not need

- Milestone: Cleanup
- Depends on: NL-030
- Size: M

## Why
The app now only does what `DRAFT_UPDATED.md` shows: draw a lab, deploy it in the sandbox, inspect the kernel state as text, run ping, curl, a server, and tcpdump. Code, files, and UI for anything else add reading and maintenance cost with no benefit. This ticket removes it all before the Deploy tickets start.

Rule for this ticket: delete, do not hide. If a removed thing is needed later, a new ticket adds it back.

## Scope: backend (`api/`)
- Delete `api/cmd/vectorcheck/` and the `check-vectors` Makefile target.
- Delete the empty stub packages `internal/audit`, `internal/capture`, `internal/events`, `internal/observer`, `internal/store` (each is only a `doc.go`). Keep `internal/api`, `internal/engine`, `internal/topology`, `internal/worker`, `internal/sandbox`.
- `internal/topology`:
  - Delete `runtime.go` and `CaptureState` (capture is gone).
  - Delete `options.go` and `ExistingName`. `Validate(doc)` takes only the document. Remove the `NAME_CONFLICT_EXISTING` code, `BackendOnly`, and `AllCodes`, which only the vector checker and the existing-name check used. A redeploy resets first (NL-036), so no existing-name check is needed.
  - Remove the `recover` wrapper in `runRule`. A panic in a rule is a bug that should show.
  - Remove `UNSUPPORTED_NODE_TYPE` (no rule emits it) and `NAMESPACE_HAS_BRIDGE_FIELDS` (the `bridge` field it checks is gone), on both the Go and editor sides. Also remove `INTERFACE_NAME_RESERVED` (`.` and `..` fail the ASCII character check) and add one code, `NODE_NAME_CHARS`, so node names get the same ASCII check as interface names.
  - Names accept only ASCII letters, digits, `-` and `_`. Delete the byte counting and simplify `linuxname.go` and `name_rules.go` to plain `len` and slicing on an ASCII string. Keep the `nl-` + lab id + short-hash derivation: it is committed, working, and NL-031 reuses it.
  - Remove from the model: `mtu` on `Interface` and `Link`; `BridgeSettings` (`stp`, `stpPriority`, `vlan`) and `VlanSettings`; `NatKind`, `NatKindDNAT`, and the `NatRule` fields `kind`, `protocol`, `port`, `toAddress`, `toPort` (a NAT rule is `id` and `interfaceId`, meaning masquerade out of that interface); the `nat` role. Keep `state` on interfaces and links.
  - Remove rules and issue codes that only checked removed fields (for example the bridge-versus-namespace field checks, if they only covered `bridge` settings).
- Run `make generate` so `docs/topology.schema.json` and `web/src/types/topology.ts` match the Go model.
- `api/cmd/genschema` stays. `api/cmd/topocheck` stays and also prints the issues from `Validate`, so a lab file can still be checked from the command line once `vectorcheck` is gone.

## Scope: frontend (`web/`)
- Delete `web/scripts/checkVectors.ts` and `web/src/store/validation/bytes.ts`. Revert the byte-based edits in `constants/labFile.ts`, `constants/validation.ts`, `store/validation/linuxName.ts`, and `store/validation/nameRules.ts`. Keep `checkExamples.ts` and `roundtrip.ts`.
- Remove the MTU inputs and the "keep link and interface MTUs in step" logic: `InterfaceEditor.tsx`, `LinkForm.tsx`, `store/bridgeLinkOps.ts`, `store/namespaceOps.ts`, `store/documentOps.ts`, `constants/inspectorBridgeLink.ts`, `constants/links.ts`, `store/fieldRules.ts`.
- Remove STP and VLAN: delete `components/inspector/StpFields.tsx`, the bridge settings in `BridgeForm.tsx`, and their constants and types. Keep the bridge port list (`PortRow.tsx`).
- Remove the "Observed state: Not deployed" line and its constants: delete `components/inspector/ObservedLine.tsx`, the `OBSERVED_*` constants in `constants/inspector.ts`, and its uses in `InterfaceEditor.tsx` and `RouteRow.tsx`.
- Remove the placeholder drawer tabs for features that are cut: Interface state, Addresses, Routes, Neighbors, Bridge state, Firewall/NAT, Packet capture, and Diagnostics (`DRAWER_TAB_ID`, `DRAWER_TABS` in `constants/layout.ts`). Keep Issues and Deployment logs. NL-046 and NL-050 add Run and Inspect.
- Remove the `veth` palette entry (links are drawn by dragging between interface handles) and the `nat` palette entry and `nat` role. Remove the `available` flag and the "Not available yet" tooltip logic from `PaletteEntry.tsx` and `types/palette.ts` if every remaining entry is available. Delete `components/NotAvailable.tsx` if nothing uses it.
- Keep `DisabledButton.tsx` for Deploy and Reset until NL-041 enables them.
- Old saved labs that contain removed fields still open: unknown fields are ignored on read. No `schemaVersion` bump.

## Scope: docs
- `docs/decisions.md`:
  - Decision 1 (auth): no token. The worker socket is mode 0600 in a 0700 directory.
  - Decision 2 (persistence): no database. The API keeps the last deployed lab in memory. Labs are saved as `.netlab.json` files by the browser.
  - Decision 5 (naming): unchanged except that names are ASCII only, so "15 characters" means 15 bytes with no extra rule.
  - Decision 6 (kernel control): the worker runs fixed `ip`, `bridge`, `sysctl`, `nft`, `ping`, `curl`, `tcpdump` by absolute path with separate arguments. No netlink library.
  - Decision 7 (capture): no capture UI. `tcpdump -c N` text output only (NL-046).
  - Decision 9 (state): one desired-topology store. No observed-state store.
  - Remove the "Known mismatches" section.
- `docs/sandbox.md`: replace the integration-test line with the manual checks in NL-078.
- `README.md`: remove the `check-vectors` row from the checks table.
- Delete `testdata/validation/` completely (including the untracked `*-bytes.json` and `*-nonascii.json`). Delete `specs/016-go-topology-validation/contracts/backend-vector-format.md` and edit the other files in that folder so they no longer promise vectors, existing names, or byte counting.
- Update the three files in `examples/` and the inline fixtures in `web/scripts/checkExamples.ts` so they carry no removed fields.
- `README.md`: also remove the Capture box and line from the architecture diagram text.

## Acceptance
- `make generate` twice leaves no diff the second time. `make build` and `make lint` pass.
- `node web/scripts/checkExamples.ts` prints `ok` for every example.
- `grep -rniE 'mtu|\bstp|vlan|dnat|capture|observed|vector' api web/src web/scripts docs examples Makefile README.md` finds nothing, except the `tcpdump` mention in `docs/decisions.md` decision 7 `setPointerCapture` in `web/src/hooks/useResizeDrag.ts`, and the `mtu`, `bridge`, and `nat` strip code in `web/src/types/topologyDocument.ts`.
- In the browser: no MTU, STP, or VLAN controls, no placeholder drawer tabs, no `veth` or `NAT gateway` palette entry. A name with a non-ASCII character is flagged. An old `.netlab.json` that contains `mtu` still opens.
