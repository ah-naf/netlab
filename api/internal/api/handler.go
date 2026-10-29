package api

import "net/http"

// NewHandler returns the API routes wrapped with request id and request log.
func NewHandler(version string, workerReachable func() bool) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(HealthPath, healthHandler(version, workerReachable))
	mux.HandleFunc("/", notFound)
	return withRequestID(withRequestLog(mux))
}

func notFound(w http.ResponseWriter, r *http.Request) {
	writeError(w, http.StatusNotFound, codeNotFound, messageNotFound, r.URL.Path)
}
