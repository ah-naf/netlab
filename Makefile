SANDBOX := scripts/sandbox.sh
SANDBOX_DIR := .sandbox
WORKER_DIR := api/cmd/worker
WORKER_SOCKET := $(SANDBOX_DIR)/worker.sock

.PHONY: generate install-web dev-web dev-api build lint sandbox-shell sandbox-test sandbox-worker

generate:
	cd api && go run ./cmd/genschema ../docs/topology.schema.json
	cd web && npx json2ts -i ../docs/topology.schema.json -o src/types/topology.ts --additionalProperties false

install-web:
	cd web && npm install

dev-web:
	cd web && npm run dev

dev-api:
	cd api && go run ./cmd/api

build:
	cd web && npm run build
	cd api && go build ./...

lint:
	cd web && npm run lint && npm run format:check
	cd api && test -z "$$(gofmt -l .)" && go vet ./...

sandbox-shell:
	$(SANDBOX) bash

sandbox-test:
	cd api && ../$(SANDBOX) go test -tags integration ./...

sandbox-worker:
	@if [ -d $(WORKER_DIR) ]; then \
		mkdir -p -m 0700 $(SANDBOX_DIR) && cd api && NETLAB_WORKER_SOCKET=../$(WORKER_SOCKET) ../$(SANDBOX) go run ./cmd/worker; \
	else \
		echo "worker not built yet (NL-032)"; \
	fi
