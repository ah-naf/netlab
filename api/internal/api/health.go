package api

import "net/http"

type healthAnswer struct {
	Status          string `json:"status"`
	Version         string `json:"version"`
	WorkerReachable bool   `json:"workerReachable"`
}

func healthHandler(version string, workerReachable func() bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeError(w, http.StatusMethodNotAllowed, codeMethodNotAllowed, messageMethodNotAllowed, r.URL.Path)
			return
		}
		writeJSON(w, http.StatusOK, healthAnswer{Status: statusOK, Version: version, WorkerReachable: workerReachable()})
	}
}
