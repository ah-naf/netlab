package topology

import (
	"encoding/json"
	"os"
)

const (
	jsonIndent = "  "
	fileMode   = 0o644
)

// Load reads a lab document from a file.
func Load(path string) (Document, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return Document{}, err
	}
	return Migrate(content)
}

// Save writes a lab document as indented JSON.
func Save(path string, doc Document) error {
	content, err := json.MarshalIndent(doc, "", jsonIndent)
	if err != nil {
		return err
	}
	return os.WriteFile(path, append(content, '\n'), fileMode)
}
