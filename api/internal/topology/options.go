package topology

// ExistingName is a lab-owned Linux name already on the machine, with its owner lab id.
type ExistingName struct {
	Name  string `json:"name"`
	LabID string `json:"labId"`
}

// Options carries what only the caller knows. A nil or empty list skips the existing-name check.
type Options struct {
	ExistingNames []ExistingName
}
