// Command genschema writes the JSON Schema of the lab document.
package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/invopop/jsonschema"

	"netlab/api/internal/topology"
)

const (
	usage         = "usage: genschema <output.json>"
	documentTitle = "Document"
	jsonIndent    = "  "
	fileMode      = 0o644
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	if len(os.Args) != 2 {
		return fmt.Errorf(usage)
	}
	schema := documentSchema()
	content, err := json.MarshalIndent(schema, "", jsonIndent)
	if err != nil {
		return err
	}
	return os.WriteFile(os.Args[1], append(content, '\n'), fileMode)
}

// documentSchema describes the saved document and also defines the runtime-only CaptureSession.
func documentSchema() *jsonschema.Schema {
	schema := (&jsonschema.Reflector{ExpandedStruct: true}).Reflect(&topology.Document{})
	schema.Title = documentTitle
	for name, definition := range (&jsonschema.Reflector{}).Reflect(&topology.CaptureSession{}).Definitions {
		schema.Definitions[name] = definition
	}
	return schema
}
