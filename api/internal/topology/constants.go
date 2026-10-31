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
)

type State string

const (
	StateUp   State = "up"
	StateDown State = "down"
)

type LinkKind string

const LinkKindVeth LinkKind = "veth"

func (NodeType) JSONSchema() *jsonschema.Schema {
	return enumSchema(NodeTypeNamespace, NodeTypeBridge)
}

func (Role) JSONSchema() *jsonschema.Schema {
	return enumSchema(RoleHost, RoleRouter)
}

func (State) JSONSchema() *jsonschema.Schema {
	return enumSchema(StateUp, StateDown)
}

func (LinkKind) JSONSchema() *jsonschema.Schema {
	return enumSchema(LinkKindVeth)
}

func enumSchema[T ~string](values ...T) *jsonschema.Schema {
	enum := make([]any, len(values))
	for i, value := range values {
		enum[i] = string(value)
	}
	return &jsonschema.Schema{Type: "string", Enum: enum}
}
