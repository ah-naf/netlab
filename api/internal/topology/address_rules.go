package topology

import "net/netip"

func addressRules(doc Document) []Issue {
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
