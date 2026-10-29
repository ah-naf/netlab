// Command topocheck loads a lab document and prints it back as JSON.
package main

import (
	"fmt"
	"os"

	"netlab/api/internal/topology"
)

const usage = "usage: topocheck <document.json>"

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
	doc, err := topology.Load(os.Args[1])
	if err != nil {
		return err
	}
	content, err := topology.Marshal(doc)
	if err != nil {
		return err
	}
	fmt.Print(string(content))
	return nil
}
