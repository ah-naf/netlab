package topology

// nodeIndex maps an id to the first node with that id (duplicates are reported elsewhere).
func nodeIndex(doc Document) map[string]Node {
	index := make(map[string]Node, len(doc.Nodes))
	for _, node := range doc.Nodes {
		if _, seen := index[node.ID]; !seen {
			index[node.ID] = node
		}
	}
	return index
}

// interfaceIndex maps an id to the first interface with that id.
func interfaceIndex(doc Document) map[string]Interface {
	index := make(map[string]Interface, len(doc.Interfaces))
	for _, iface := range doc.Interfaces {
		if _, seen := index[iface.ID]; !seen {
			index[iface.ID] = iface
		}
	}
	return index
}

// ownedBy reports whether an interface with this id belongs to the node.
func ownedBy(doc Document, node Node, interfaceID string) bool {
	for _, iface := range doc.Interfaces {
		if iface.ID == interfaceID && iface.NodeID == node.ID {
			return true
		}
	}
	return false
}
