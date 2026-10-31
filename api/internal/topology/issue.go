package topology

type Severity string

const (
	SeverityError   Severity = "error"
	SeverityWarning Severity = "warning"
)

// Code is a stable issue code. The values are shared with the editor's validator.
type Code string

const (
	CodeDuplicateID              Code = "DUPLICATE_ID"
	CodeNodeNameEmpty            Code = "NODE_NAME_EMPTY"
	CodeDuplicateNodeName        Code = "DUPLICATE_NODE_NAME"
	CodeDuplicateInterfaceName   Code = "DUPLICATE_INTERFACE_NAME"
	CodeInterfaceNameLength      Code = "INTERFACE_NAME_LENGTH"
	CodeInterfaceNameChars       Code = "INTERFACE_NAME_CHARS"
	CodeInterfaceNameReserved    Code = "INTERFACE_NAME_RESERVED"
	CodeLinuxNameCollision       Code = "LINUX_NAME_COLLISION"
	CodeInvalidCIDR              Code = "INVALID_CIDR"
	CodeInterfaceNodeMissing     Code = "INTERFACE_NODE_MISSING"
	CodeDanglingEndpoint         Code = "DANGLING_ENDPOINT"
	CodeLinkSameInterface        Code = "LINK_SAME_INTERFACE"
	CodeInterfaceInTwoLinks      Code = "INTERFACE_IN_TWO_LINKS"
	CodeLinkEndpointKind         Code = "LINK_ENDPOINT_KIND"
	CodeBridgeHasNamespaceFields Code = "BRIDGE_HAS_NAMESPACE_FIELDS"
	CodeNamespaceHasBridgeFields Code = "NAMESPACE_HAS_BRIDGE_FIELDS"
	CodeNATInterfaceNotOnNode    Code = "NAT_INTERFACE_NOT_ON_NODE"
	CodeRouteInterfaceMissing    Code = "ROUTE_INTERFACE_MISSING"
	CodeRouteGatewayUnreachable  Code = "ROUTE_GATEWAY_UNREACHABLE"
	CodeDuplicateIPOnSegment     Code = "DUPLICATE_IP_ON_SEGMENT"

	// Backend only: the editor does not produce these two.
	CodeUnsupportedNodeType  Code = "UNSUPPORTED_NODE_TYPE"
	CodeNameConflictExisting Code = "NAME_CONFLICT_EXISTING"
)

// codeOrder is the tie-break order in the issue list.
var codeOrder = []Code{
	CodeDuplicateID,
	CodeNodeNameEmpty,
	CodeDuplicateNodeName,
	CodeDuplicateInterfaceName,
	CodeInterfaceNameLength,
	CodeInterfaceNameChars,
	CodeInterfaceNameReserved,
	CodeLinuxNameCollision,
	CodeInvalidCIDR,
	CodeInterfaceNodeMissing,
	CodeDanglingEndpoint,
	CodeLinkSameInterface,
	CodeInterfaceInTwoLinks,
	CodeLinkEndpointKind,
	CodeBridgeHasNamespaceFields,
	CodeNamespaceHasBridgeFields,
	CodeNATInterfaceNotOnNode,
	CodeRouteInterfaceMissing,
	CodeRouteGatewayUnreachable,
	CodeDuplicateIPOnSegment,
	CodeUnsupportedNodeType,
	CodeNameConflictExisting,
}

// messageOf holds one plain message per code.
var messageOf = map[Code]string{
	CodeDuplicateID:              "Two resources of the same kind share an id",
	CodeNodeNameEmpty:            "Name cannot be empty",
	CodeDuplicateNodeName:        "Another node already uses this name",
	CodeDuplicateInterfaceName:   "Another interface on this node uses this name",
	CodeInterfaceNameLength:      "Name must be 1 to 15 bytes",
	CodeInterfaceNameChars:       "Name cannot contain a slash or spaces",
	CodeInterfaceNameReserved:    "Name cannot be . or ..",
	CodeLinuxNameCollision:       "Another node would get the same deploy-time name",
	CodeInvalidCIDR:              "Enter an address like 10.0.0.5/24 or fd00::1/64",
	CodeInterfaceNodeMissing:     "The interface belongs to a node that does not exist",
	CodeDanglingEndpoint:         "A link end points to an interface that does not exist",
	CodeLinkSameInterface:        "A link cannot join an interface to itself",
	CodeInterfaceInTwoLinks:      "This interface is used by more than one link",
	CodeLinkEndpointKind:         "A link end or the link type is not supported",
	CodeBridgeHasNamespaceFields: "A bridge cannot have a role, routes, or NAT rules",
	CodeNamespaceHasBridgeFields: "A namespace cannot have bridge settings",
	CodeNATInterfaceNotOnNode:    "A NAT rule uses an interface of another node",
	CodeRouteInterfaceMissing:    "A route uses an interface that is not on this node",
	CodeRouteGatewayUnreachable:  "A route gateway is not inside a directly connected network",
	CodeDuplicateIPOnSegment:     "Two interfaces on one segment share an address",
	CodeUnsupportedNodeType:      "This node type is not supported",
	CodeNameConflictExisting:     "A resource with the same deploy-time name already exists",
}

// Issue is one finding. RelatedIDs is never nil, so it marshals as [].
type Issue struct {
	Severity     Severity `json:"severity"`
	Code         Code     `json:"code"`
	ResourceID   string   `json:"resourceId"`
	ResourceName string   `json:"resourceName"`
	Message      string   `json:"message"`
	RelatedIDs   []string `json:"relatedIds"`
}

func severityOf(code Code) Severity {
	if code == CodeDuplicateIPOnSegment {
		return SeverityWarning
	}
	return SeverityError
}

// newIssue fills severity and message; an empty name falls back to the id.
func newIssue(code Code, id, name string, related ...string) Issue {
	if name == "" {
		name = id
	}
	if related == nil {
		related = []string{}
	}
	return Issue{
		Severity:     severityOf(code),
		Code:         code,
		ResourceID:   id,
		ResourceName: name,
		Message:      messageOf[code],
		RelatedIDs:   related,
	}
}

// HasErrors reports whether any issue is an error; warnings alone never refuse a lab.
func HasErrors(issues []Issue) bool {
	for _, issue := range issues {
		if issue.Severity == SeverityError {
			return true
		}
	}
	return false
}
