# Quickstart: Verify the Repository Scaffold

Prerequisites: Node 22, Go 1.26, network access for `npm install`. Run from the repository root. The commands are in [contracts/root-commands.md](contracts/root-commands.md).

## 1. Frontend (US1, SC-001)

```bash
make install-web
make dev-web
```

Expected: Vite prints a local URL (`http://localhost:5173`). The page loads blank with no console errors. Stop with Ctrl+C.

Proxy check (backend running, section 2 in another terminal):

```bash
curl -i http://localhost:5173/api/anything
```

Expected: the response comes from the Go server (404 from the empty mux), not from Vite.

## 2. Backend (US2, SC-002)

```bash
time make dev-api      # then press Ctrl+C
echo $?
```

Expected: starts in under 3 seconds, stays running, exits cleanly with status 0 on Ctrl+C.

```bash
ls api/internal
head -1 api/internal/*/doc.go
```

Expected: ten folders (`api topology engine worker observer capture events store sandbox audit`), each `doc.go` starts with a package purpose comment.

Worker placeholder:

```bash
make sandbox-worker
cd api && go run ./cmd/worker
```

Expected: the first prints `worker not implemented yet (NL-032)`. The second (outside the sandbox) is refused with `not in sandbox: run through scripts/sandbox.sh` and exit 1.

## 3. Root commands and files (US3, SC-003 to SC-006)

```bash
make build
make lint
git check-ignore .sandbox/ data/ node_modules/
grep -rn sudo Makefile
cat .env.example
ls docs examples
```

Expected: build and lint finish with zero errors. All three paths are printed as ignored. `grep` finds nothing. `.env.example` lists the three settings and no secrets. Both folders exist.
