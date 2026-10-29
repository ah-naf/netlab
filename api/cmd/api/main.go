// Command api serves the NetLab HTTP API.
package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"netlab/api/internal/api"
)

const (
	addrEnv         = "NETLAB_API_ADDR"
	defaultAddr     = ":8080"
	shutdownTimeout = 5 * time.Second
	defaultVersion  = "dev"
)

// version is set at build time with -ldflags "-X main.version=...".
var version = defaultVersion

// workerNotBuilt reports the worker as unreachable until the worker exists (NL-032).
func workerNotBuilt() bool { return false }

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	server := &http.Server{Addr: listenAddr(), Handler: api.NewHandler(version, workerNotBuilt)}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	failed := make(chan error, 1)
	go func() { failed <- server.ListenAndServe() }()

	select {
	case err := <-failed:
		return err
	case <-ctx.Done():
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}

func listenAddr() string {
	if addr := os.Getenv(addrEnv); addr != "" {
		return addr
	}
	return defaultAddr
}
