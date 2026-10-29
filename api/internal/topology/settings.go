package topology

type RouterSettings struct {
	Forwarding bool `json:"forwarding"`
}

type NatRule struct {
	ID          string  `json:"id"`
	Kind        NatKind `json:"kind"`
	InterfaceID string  `json:"interfaceId"`
	Protocol    string  `json:"protocol,omitempty"`
	Port        int     `json:"port,omitempty"`
	ToAddress   string  `json:"toAddress,omitempty"`
	ToPort      int     `json:"toPort,omitempty"`
}

type Route struct {
	Destination string `json:"destination"`
	Gateway     string `json:"gateway,omitempty"`
	InterfaceID string `json:"interfaceId,omitempty"`
	Metric      int    `json:"metric,omitempty"`
}

type BridgeSettings struct {
	STP         bool          `json:"stp"`
	STPPriority int           `json:"stpPriority,omitempty"`
	VLAN        *VlanSettings `json:"vlan,omitempty"`
}

type VlanSettings struct {
	Filtering     bool `json:"filtering"`
	DefaultVlanID int  `json:"defaultVlanId,omitempty"`
}
