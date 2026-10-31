package api

import "net/http"

// NewHandler returns the API routes.
func NewHandler(version string, workerReachable func() bool) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(HealthPath, healthHandler(version, workerReachable))
	mux.HandleFunc("/", notFound)
	return mux
}

func notFound(w http.ResponseWriter, r *http.Request) {
	writeError(w, http.StatusNotFound, codeNotFound, messageNotFound, r.URL.Path)
}
