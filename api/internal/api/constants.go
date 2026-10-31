package api

const (
	HealthPath = "/api/v1/health"

	contentTypeHeader = "Content-Type"
	contentTypeJSON   = "application/json"

	statusOK = "ok"

	codeNotFound         = "not_found"
	codeMethodNotAllowed = "method_not_allowed"
	codeInternal         = "internal"

	messageNotFound         = "route not found"
	messageMethodNotAllowed = "method not allowed"
)
