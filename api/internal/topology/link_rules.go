package topology

func supportedNodeType(nodeType NodeType) bool {
	return nodeType == NodeTypeNamespace || nodeType == NodeTypeBridge
}

// linkIssues checks one link's ends and kind.
func linkIssues(link Link, ifaces map[string]Interface, nodes map[string]Node) []Issue {
	var issues []Issue
	add := func(code Code) { issues = append(issues, newIssue(code, link.ID, link.ID)) }
	dangling, badEnd := false, false
	for _, id := range []string{link.EndpointA, link.EndpointB} {
		iface, found := ifaces[id]
		if !found {
			dangling = true
			continue
		}
		if node, ok := nodes[iface.NodeID]; !ok || !supportedNodeType(node.Type) {
			badEnd = true
		}
	}
	if dangling {
		add(CodeDanglingEndpoint)
	}
	if link.EndpointA == link.EndpointB {
		add(CodeLinkSameInterface)
	}
	if badEnd || link.Kind != LinkKindVeth {
		add(CodeLinkEndpointKind)
	}
	return issues
}

// sharedInterfaceIssues reports each interface used by more than one link.
func sharedInterfaceIssues(doc Document) []Issue {
	linksOf := make(map[string][]string)
	for _, link := range doc.Links {
		linksOf[link.EndpointA] = append(linksOf[link.EndpointA], link.ID)
		if link.EndpointB != link.EndpointA {
			linksOf[link.EndpointB] = append(linksOf[link.EndpointB], link.ID)
		}
	}
	var issues []Issue
	for _, iface := range doc.Interfaces {
		if links := linksOf[iface.ID]; len(links) > 1 {
			issues = append(issues, newIssue(CodeInterfaceInTwoLinks, iface.ID, iface.Name, links...))
		}
	}
	return issues
}

func linkRules(doc Document) []Issue {
	ifaces, nodes := interfaceIndex(doc), nodeIndex(doc)
	var issues []Issue
	for _, link := range doc.Links {
		issues = append(issues, linkIssues(link, ifaces, nodes)...)
	}
	return append(issues, sharedInterfaceIssues(doc)...)
}
