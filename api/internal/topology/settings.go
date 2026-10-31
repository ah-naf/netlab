package topology

type RouterSettings struct {
	Forwarding bool `json:"forwarding"`
}

// NatRule masquerades traffic leaving through InterfaceID.
type NatRule struct {
	ID          string `json:"id"`
	InterfaceID string `json:"interfaceId"`
}

type Route struct {
	Destination string `json:"destination"`
	Gateway     string `json:"gateway,omitempty"`
	InterfaceID string `json:"interfaceId,omitempty"`
	Metric      int    `json:"metric,omitempty"`
}
