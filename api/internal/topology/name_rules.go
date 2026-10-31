package topology

import "strings"

const maxInterfaceNameLength = 15

func isPlainName(name string) bool {
	for i := 0; i < len(name); i++ {
		c := name[i]
		isLetterOrDigit := c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9'
		if !isLetterOrDigit && c != '-' && c != '_' {
			return false
		}
	}
	return true
}

// nodeNameIssues checks one node against the nodes before it; the later node is the one reported.
func nodeNameIssues(node Node, earlier []Node) []Issue {
	name := strings.TrimSpace(node.Name)
	if name == "" {
		return []Issue{newIssue(CodeNodeNameEmpty, node.ID, node.Name)}
	}
	if !isPlainName(name) {
		return []Issue{newIssue(CodeNodeNameChars, node.ID, node.Name)}
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
	if iface.Name == "" || len(iface.Name) > maxInterfaceNameLength {
		add(CodeInterfaceNameLength)
	}
	if !isPlainName(iface.Name) {
		add(CodeInterfaceNameChars)
	}
	for _, other := range earlier {
		if other.NodeID == iface.NodeID && other.Name == iface.Name {
			add(CodeDuplicateInterfaceName, other.ID)
			break
		}
	}
	return issues
}

func nameRules(doc Document) []Issue {
	var issues []Issue
	for i, node := range doc.Nodes {
		issues = append(issues, nodeNameIssues(node, doc.Nodes[:i])...)
	}
	for i, iface := range doc.Interfaces {
		issues = append(issues, interfaceNameIssues(iface, doc.Interfaces[:i])...)
	}
	return issues
}
