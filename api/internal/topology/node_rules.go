package topology

func hasNamespaceFields(node Node) bool {
	return node.Role != "" || node.Router != nil || len(node.NatRules) > 0 || len(node.Routes) > 0
}

// nodeIssues checks what a node holds: its type-specific fields and its references.
func nodeIssues(doc Document, node Node) []Issue {
	var issues []Issue
	add := func(code Code) { issues = append(issues, newIssue(code, node.ID, node.Name)) }
	if node.Type == NodeTypeBridge && hasNamespaceFields(node) {
		add(CodeBridgeHasNamespaceFields)
	}
	if node.Type == NodeTypeNamespace && node.Bridge != nil {
		add(CodeNamespaceHasBridgeFields)
	}
	for _, rule := range node.NatRules {
		if !ownedBy(doc, node, rule.InterfaceID) {
			add(CodeNATInterfaceNotOnNode)
			break
		}
	}
	for _, route := range node.Routes {
		if route.InterfaceID != "" && !ownedBy(doc, node, route.InterfaceID) {
			add(CodeRouteInterfaceMissing)
			break
		}
	}
	return issues
}

func nodeRules(doc Document, _ Options) []Issue {
	nodes := nodeIndex(doc)
	var issues []Issue
	for _, iface := range doc.Interfaces {
		if _, found := nodes[iface.NodeID]; !found {
			issues = append(issues, newIssue(CodeInterfaceNodeMissing, iface.ID, iface.Name))
		}
	}
	for _, node := range doc.Nodes {
		issues = append(issues, nodeIssues(doc, node)...)
	}
	return issues
}
