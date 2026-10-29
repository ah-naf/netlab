package api

import (
	"encoding/json"
	"net/http"
)

type errorBody struct {
	Code     string `json:"code"`
	Message  string `json:"message"`
	Resource string `json:"resource,omitempty"`
	Details  any    `json:"details,omitempty"`
}

type errorAnswer struct {
	Error errorBody `json:"error"`
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set(contentTypeHeader, contentTypeJSON)
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

func writeError(w http.ResponseWriter, status int, code, message, resource string) {
	writeJSON(w, status, errorAnswer{Error: errorBody{Code: code, Message: message, Resource: resource}})
}
