// Command vectorcheck runs the shared validation vectors against the Go validator.
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"

	"netlab/api/internal/topology"
)

const (
	usage            = "usage: vectorcheck <vectors folder>"
	backendFolder    = "backend"
	jsonExtension    = ".json"
	failSuffix       = "-fail"
	okSuffix         = "-ok"
	speedLimit       = time.Second
	speedNodes       = 70
	speedInterfaces  = 100
	speedLinks       = 30
	speedMTU         = 1500
	vectorOKFormat   = "ok    %s\n"
	vectorFailFormat = "FAIL  %s: expected %v got %v\n"
)

type vector struct {
	Description   string                  `json:"description"`
	Document      topology.Document       `json:"document"`
	ExpectedCodes []string                `json:"expectedCodes"`
	ExistingNames []topology.ExistingName `json:"existingNames"`
}

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
	root := os.Args[1]
	failed := 0
	for _, folder := range []string{root, filepath.Join(root, backendFolder)} {
		count, err := checkFolder(folder)
		if err != nil {
			return err
		}
		failed += count
	}
	failed += reportMissing(root)
	failed += checkSpeed()
	if failed > 0 {
		return fmt.Errorf("%d problems", failed)
	}
	return nil
}

// jsonFiles lists the vector files of one folder, sorted; a missing folder has none.
func jsonFiles(folder string) []string {
	entries, err := os.ReadDir(folder)
	if err != nil {
		return nil
	}
	var names []string
	for _, entry := range entries {
		if !entry.IsDir() && filepath.Ext(entry.Name()) == jsonExtension {
			names = append(names, entry.Name())
		}
	}
	return names
}

func checkFolder(folder string) (int, error) {
	failed := 0
	for _, name := range jsonFiles(folder) {
		content, err := os.ReadFile(filepath.Join(folder, name))
		if err != nil {
			return 0, err
		}
		var v vector
		if err := json.Unmarshal(content, &v); err != nil {
			return 0, fmt.Errorf("%s: %w", name, err)
		}
		if !checkVector(filepath.Join(filepath.Base(folder), name), v) {
			failed++
		}
	}
	return failed, nil
}

func codesOf(issues []topology.Issue) []string {
	codes := make([]string, len(issues))
	for i, issue := range issues {
		codes[i] = string(issue.Code)
	}
	slices.Sort(codes)
	return codes
}

func checkVector(label string, v vector) bool {
	actual := codesOf(topology.Validate(v.Document, topology.Options{ExistingNames: v.ExistingNames}))
	expected := slices.Clone(v.ExpectedCodes)
	slices.Sort(expected)
	if slices.Equal(actual, expected) {
		fmt.Printf(vectorOKFormat, label)
		return true
	}
	fmt.Printf(vectorFailFormat, label, expected, actual)
	return false
}

func kebab(code topology.Code) string {
	return strings.ToLower(strings.ReplaceAll(string(code), "_", "-"))
}

func hasVector(folder, prefix string) bool {
	for _, name := range jsonFiles(folder) {
		if strings.HasPrefix(name, prefix) {
			return true
		}
	}
	return false
}

// reportMissing prints a line for each code that lacks a failing or a clean vector.
func reportMissing(root string) int {
	missing := 0
	for _, code := range topology.AllCodes() {
		folder := root
		if topology.BackendOnly(code) {
			folder = filepath.Join(root, backendFolder)
		}
		for _, suffix := range []string{failSuffix, okSuffix} {
			if !hasVector(folder, kebab(code)+suffix) {
				fmt.Printf("MISSING vector %s%s\n", kebab(code), suffix)
				missing++
			}
		}
	}
	return missing
}

// speedLab is a valid lab of 200 resources: 70 nodes, 100 interfaces, 30 links.
func speedLab() topology.Document {
	doc := topology.Document{SchemaVersion: topology.CurrentVersion, Lab: topology.Lab{ID: "a1b2", Name: "big"}}
	for i := 0; i < speedNodes; i++ {
		doc.Nodes = append(doc.Nodes, topology.Node{ID: fmt.Sprintf("n%d", i), Name: fmt.Sprintf("ns%d", i), Type: topology.NodeTypeNamespace})
	}
	for i := 0; i < speedInterfaces; i++ {
		doc.Interfaces = append(doc.Interfaces, topology.Interface{
			ID: fmt.Sprintf("i%d", i), NodeID: fmt.Sprintf("n%d", i%speedNodes),
			Name: fmt.Sprintf("eth%d", i/speedNodes), MTU: speedMTU, State: topology.StateUp,
		})
	}
	for i := 0; i < speedLinks; i++ {
		doc.Links = append(doc.Links, topology.Link{
			ID: fmt.Sprintf("l%d", i), EndpointA: fmt.Sprintf("i%d", i), EndpointB: fmt.Sprintf("i%d", i+speedLinks),
			Kind: topology.LinkKindVeth, MTU: speedMTU, State: topology.StateUp,
		})
	}
	return doc
}

func checkSpeed() int {
	doc := speedLab()
	start := time.Now()
	issues := topology.Validate(doc, topology.Options{})
	elapsed := time.Since(start)
	fmt.Printf("speed: %.1f ms for %d resources, %d issues\n",
		float64(elapsed.Microseconds())/1000, len(doc.Nodes)+len(doc.Interfaces)+len(doc.Links), len(issues))
	if elapsed >= speedLimit || len(issues) > 0 {
		return 1
	}
	return 0
}
