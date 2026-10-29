package topology

// Document is the saved lab. Unknown fields are ignored on read and dropped on save.
type Document struct {
	SchemaVersion int                 `json:"schemaVersion"`
	Lab           Lab                 `json:"lab"`
	Nodes         []Node              `json:"nodes"`
	Interfaces    []Interface         `json:"interfaces"`
	Links         []Link              `json:"links"`
	Layout        map[string]Position `json:"layout,omitempty"`
}

type Lab struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

type Node struct {
	ID       string          `json:"id"`
	Name     string          `json:"name"`
	Type     NodeType        `json:"type"`
	Role     Role            `json:"role,omitempty"`
	Router   *RouterSettings `json:"router,omitempty"`
	NatRules []NatRule       `json:"natRules,omitempty"`
	Routes   []Route         `json:"routes,omitempty"`
	Bridge   *BridgeSettings `json:"bridge,omitempty"`
}

type Interface struct {
	ID        string    `json:"id"`
	NodeID    string    `json:"nodeId"`
	Name      string    `json:"name"`
	MTU       int       `json:"mtu"`
	State     State     `json:"state"`
	Addresses []Address `json:"addresses,omitempty"`
}

type Link struct {
	ID        string   `json:"id"`
	EndpointA string   `json:"endpointA"`
	EndpointB string   `json:"endpointB"`
	Kind      LinkKind `json:"kind"`
	MTU       int      `json:"mtu"`
	State     State    `json:"state"`
}

type Address struct {
	CIDR string `json:"cidr"`
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}
