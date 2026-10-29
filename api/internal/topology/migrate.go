package topology

import (
	"encoding/json"
	"errors"
	"fmt"
)

var errVersionMissing = errors.New("schemaVersion is missing")

const unsupportedVersionFormat = "unsupported schemaVersion %d"

// Migrate decodes a document and upgrades it to the current version.
func Migrate(raw []byte) (Document, error) {
	var doc Document
	var header struct {
		SchemaVersion int `json:"schemaVersion"`
	}
	if err := json.Unmarshal(raw, &header); err != nil {
		return doc, err
	}
	if header.SchemaVersion == 0 {
		return doc, errVersionMissing
	}
	if header.SchemaVersion != CurrentVersion {
		return doc, fmt.Errorf(unsupportedVersionFormat, header.SchemaVersion)
	}
	err := json.Unmarshal(raw, &doc)
	return withEmptyLists(doc), err
}

// withEmptyLists makes missing lists save as [] instead of null.
func withEmptyLists(doc Document) Document {
	if doc.Nodes == nil {
		doc.Nodes = []Node{}
	}
	if doc.Interfaces == nil {
		doc.Interfaces = []Interface{}
	}
	if doc.Links == nil {
		doc.Links = []Link{}
	}
	return doc
}
