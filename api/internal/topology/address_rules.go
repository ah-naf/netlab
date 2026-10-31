package topology

import "net/netip"

// segmentKey groups one address inside one layer-2 segment.
type segmentKey struct {
	segment string
	addr    netip.Addr
}

func invalidCIDRIssues(doc Document) []Issue {
	var issues []Issue
	for _, iface := range doc.Interfaces {
		for _, address := range iface.Addresses {
			if _, err := netip.ParsePrefix(address.CIDR); err != nil {
				issues = append(issues, newIssue(CodeInvalidCIDR, iface.ID, iface.Name))
			}
		}
	}
	return issues
}

// reachable reports whether the gateway is inside a prefix of the given interfaces.
func reachable(doc Document, node Node, route Route, gateway netip.Addr) bool {
	for _, iface := range doc.Interfaces {
		if iface.NodeID != node.ID || (route.InterfaceID != "" && iface.ID != route.InterfaceID) {
			continue
		}
		for _, address := range iface.Addresses {
			if prefix, err := netip.ParsePrefix(address.CIDR); err == nil && prefix.Masked().Contains(gateway) {
				return true
			}
		}
	}
	return false
}

func unreachableRouteIssues(doc Document) []Issue {
	var issues []Issue
	for _, node := range doc.Nodes {
		for _, route := range node.Routes {
			if route.Gateway == "" || (route.InterfaceID != "" && !ownedBy(doc, node, route.InterfaceID)) {
				continue
			}
			gateway, err := netip.ParseAddr(route.Gateway)
			if err != nil || !reachable(doc, node, route, gateway) {
				issues = append(issues, newIssue(CodeRouteGatewayUnreachable, node.ID, node.Name))
				break
			}
		}
	}
	return issues
}

// segments is a union-find over interface ids.
type segments map[string]string

func (s segments) find(id string) string {
	parent, known := s[id]
	if !known || parent == id {
		return id
	}
	root := s.find(parent)
	s[id] = root
	return root
}

func (s segments) join(a, b string) { s[s.find(a)] = s.find(b) }

// layer2Segments joins both ends of every link and all ports of every bridge.
func layer2Segments(doc Document) segments {
	s := segments{}
	ifaces := interfaceIndex(doc)
	for _, link := range doc.Links {
		_, foundA := ifaces[link.EndpointA]
		_, foundB := ifaces[link.EndpointB]
		if foundA && foundB {
			s.join(link.EndpointA, link.EndpointB)
		}
	}
	for _, node := range doc.Nodes {
		if node.Type != NodeTypeBridge {
			continue
		}
		first := ""
		for _, iface := range doc.Interfaces {
			if iface.NodeID != node.ID {
				continue
			}
			if first == "" {
				first = iface.ID
			}
			s.join(first, iface.ID)
		}
	}
	return s
}

func duplicateAddressIssues(doc Document) []Issue {
	s := layer2Segments(doc)
	holders := map[segmentKey][]int{}
	var order []segmentKey
	for i, iface := range doc.Interfaces {
		for _, address := range iface.Addresses {
			prefix, err := netip.ParsePrefix(address.CIDR)
			if err != nil {
				continue
			}
			key := segmentKey{segment: s.find(iface.ID), addr: prefix.Addr()}
			list := holders[key]
			if len(list) == 0 {
				order = append(order, key)
			}
			if len(list) == 0 || list[len(list)-1] != i {
				holders[key] = append(list, i)
			}
		}
	}
	var issues []Issue
	for _, key := range order {
		list := holders[key]
		first := doc.Interfaces[list[0]]
		for _, i := range list[1:] {
			iface := doc.Interfaces[i]
			issues = append(issues, newIssue(CodeDuplicateIPOnSegment, iface.ID, iface.Name, first.ID))
		}
	}
	return issues
}

func addressRules(doc Document, _ Options) []Issue {
	issues := invalidCIDRIssues(doc)
	issues = append(issues, unreachableRouteIssues(doc)...)
	return append(issues, duplicateAddressIssues(doc)...)
}
