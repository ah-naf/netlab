package topology

import "github.com/invopop/jsonschema"

// CurrentVersion is the only document version this code reads and writes.
const CurrentVersion = 1

type NodeType string

const (
	NodeTypeNamespace NodeType = "namespace"
	NodeTypeBridge    NodeType = "bridge"
)

type Role string

const (
	RoleHost   Role = "host"
	RoleRouter Role = "router"
	RoleNAT    Role = "nat"
)

type State string

const (
	StateUp   State = "up"
	StateDown State = "down"
)

type LinkKind string

const LinkKindVeth LinkKind = "veth"

type NatKind string

const (
	NatKindMasquerade NatKind = "masquerade"
	NatKindDNAT       NatKind = "dnat"
)

type CaptureState string

const (
	CaptureStateRunning CaptureState = "running"
	CaptureStateStopped CaptureState = "stopped"
)

func (NodeType) JSONSchema() *jsonschema.Schema {
	return enumSchema(NodeTypeNamespace, NodeTypeBridge)
}

func (Role) JSONSchema() *jsonschema.Schema {
	return enumSchema(RoleHost, RoleRouter, RoleNAT)
}

func (State) JSONSchema() *jsonschema.Schema {
	return enumSchema(StateUp, StateDown)
}

func (LinkKind) JSONSchema() *jsonschema.Schema {
	return enumSchema(LinkKindVeth)
}

func (NatKind) JSONSchema() *jsonschema.Schema {
	return enumSchema(NatKindMasquerade, NatKindDNAT)
}

func (CaptureState) JSONSchema() *jsonschema.Schema {
	return enumSchema(CaptureStateRunning, CaptureStateStopped)
}

func enumSchema[T ~string](values ...T) *jsonschema.Schema {
	enum := make([]any, len(values))
	for i, value := range values {
		enum[i] = string(value)
	}
	return &jsonschema.Schema{Type: "string", Enum: enum}
}
