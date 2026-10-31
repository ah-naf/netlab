# Contract: README content rules

## Order and required content
Sections in the order of [data-model.md](../data-model.md). Each section below MUST exist.

### Intro and Milestone 1
- First paragraph: NetLab lets you draw a network lab (namespaces, bridges, links), check it, and later deploy it on Linux; a lab is one such drawing.
- Milestone 1 list: draw a lab on the canvas, edit nodes and links in the properties panel, validate with the Issues list, save and open `.netlab.json` files, start from example labs. Not in Milestone 1: deploying a lab.

### Architecture
- A fenced `mermaid` block, then a plain list of the five parts with one job each (see data-model).
- M1 parts styled solid; later parts dashed and labelled "later".

### Prerequisites (table)
| Tool | Minimum | Check |
|---|---|---|
| git | any recent | `git --version` |
| make | GNU make 4 | `make --version` |
| Node.js | 22.18 | `node --version` |
| npm | 10 | `npm --version` |
| Go | 1.26 | `go version` |
Then: "Only for the sandbox check, not needed for the canvas: `unshare`, `ip`, `nft`." Supported development system: Linux.

### Quick start (from the repo root)
```bash
make install-web
make dev-api    # terminal 1, API on :8080
make dev-web    # terminal 2, frontend on http://localhost:5173
```
Expected: open `http://localhost:5173`; empty canvas; the toolbar indicator reads **API online** or, in Milestone 1, **API online, worker offline** (see research §8 and fix the wording to what the clean run shows).

### Troubleshooting
- "API offline": start `make dev-api`; the frontend alone still works.
- Busy port 5173: the dev server stops with an error; free the port or run `npm run dev -- --port <port>` from `web`.
- Do not change the API port in Milestone 1 (the dev proxy targets `:8080`).

### Safety and sandbox
- Sentence: "Nothing in Milestone 1 needs root, and no command in this README uses `sudo`."
- Short paragraph: privileged code runs only in a throwaway user, network, and mount namespace (`scripts/sandbox.sh`); only the worker runs there; links to `docs/sandbox.md`.
- Environment check: `scripts/check-env.sh` prints `ok` per tool and for bridge, veth pair, and named namespace; exit 0.

### Project layout
One line per folder from the data model.

### Checks (table, from the repo root)
Exactly the rows in research §5. Plus: "Automated frontend unit tests and the end-to-end browser test (`make test-web`, `make e2e-web`) are not available yet." with no command.

### More docs
Links: `docs/sandbox.md`, `docs/decisions.md`, `docs/links.md`, `docs/topology.schema.json`.

## Rules
- Every command appears in a fenced code block, with the folder stated.
- No `sudo`. No make target or script that does not exist.
- No copied paragraphs from `docs/sandbox.md` or `docs/decisions.md`; link instead.
- Short sentences, plain words, English.
- Names of targets, scripts, ports, and indicator texts match the repository exactly.
