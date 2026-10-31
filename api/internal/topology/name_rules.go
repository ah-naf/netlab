package topology

import (
	"strings"
	"unicode"
)

const (
	maxInterfaceNameBytes = 15
	pathSeparator         = "/"
)

var reservedNames = []string{".", ".."}

func hasSpace(name string) bool {
	return strings.IndexFunc(name, unicode.IsSpace) >= 0
}

func isReserved(name string) bool {
	for _, reserved := range reservedNames {
		if name == reserved {
			return true
		}
	}
	return false
}

// nodeNameIssues checks one node against the nodes before it; the later node is the one reported.
func nodeNameIssues(node Node, earlier []Node) []Issue {
	name := strings.TrimSpace(node.Name)
	if name == "" {
		return []Issue{newIssue(CodeNodeNameEmpty, node.ID, node.Name)}
	}
	for _, other := range earlier {
		if other.Name == name {
			return []Issue{newIssue(CodeDuplicateNodeName, node.ID, node.Name, other.ID)}
		}
	}
	return nil
}

// interfaceNameIssues checks one interface name; one issue per code, never one per character.
func interfaceNameIssues(iface Interface, earlier []Interface) []Issue {
	var issues []Issue
	add := func(code Code, related ...string) {
		issues = append(issues, newIssue(code, iface.ID, iface.Name, related...))
	}
	if iface.Name == "" || len(iface.Name) > maxInterfaceNameBytes {
		add(CodeInterfaceNameLength)
	}
	if strings.Contains(iface.Name, pathSeparator) || hasSpace(iface.Name) {
		add(CodeInterfaceNameChars)
	}
	if isReserved(iface.Name) {
		add(CodeInterfaceNameReserved)
	}
	for _, other := range earlier {
		if other.NodeID == iface.NodeID && other.Name == iface.Name {
			add(CodeDuplicateInterfaceName, other.ID)
			break
		}
	}
	return issues
}

func nameRules(doc Document, _ Options) []Issue {
	var issues []Issue
	for i, node := range doc.Nodes {
		issues = append(issues, nodeNameIssues(node, doc.Nodes[:i])...)
	}
	for i, iface := range doc.Interfaces {
		issues = append(issues, interfaceNameIssues(iface, doc.Interfaces[:i])...)
	}
	return issues
}
