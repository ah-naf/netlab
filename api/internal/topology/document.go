package topology

import (
	"encoding/json"
	"os"
)

const (
	JSONIndent = "  "
	FileMode   = 0o644
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
	content, err := Marshal(doc)
	if err != nil {
		return err
	}
	return os.WriteFile(path, content, FileMode)
}

// Marshal returns the document as indented JSON with a trailing newline.
func Marshal(doc Document) ([]byte, error) {
	content, err := json.MarshalIndent(doc, "", JSONIndent)
	return append(content, '\n'), err
}
