package topology

// laterDuplicates reports each item whose id was already seen earlier in the same list.
func laterDuplicates(ids, names []string) []Issue {
	seen := make(map[string]bool, len(ids))
	var issues []Issue
	for i, id := range ids {
		if seen[id] {
			issues = append(issues, newIssue(CodeDuplicateID, id, names[i]))
		}
		seen[id] = true
	}
	return issues
}

func idRules(doc Document, _ Options) []Issue {
	nodeIDs, nodeNames := make([]string, len(doc.Nodes)), make([]string, len(doc.Nodes))
	for i, node := range doc.Nodes {
		nodeIDs[i], nodeNames[i] = node.ID, node.Name
	}
	ifaceIDs, ifaceNames := make([]string, len(doc.Interfaces)), make([]string, len(doc.Interfaces))
	for i, iface := range doc.Interfaces {
		ifaceIDs[i], ifaceNames[i] = iface.ID, iface.Name
	}
	linkIDs := make([]string, len(doc.Links))
	for i, link := range doc.Links {
		linkIDs[i] = link.ID
	}
	issues := laterDuplicates(nodeIDs, nodeNames)
	issues = append(issues, laterDuplicates(ifaceIDs, ifaceNames)...)
	return append(issues, laterDuplicates(linkIDs, linkIDs)...)
}
