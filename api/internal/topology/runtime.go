package topology

// CaptureSession is a runtime record. It is never part of Document.
type CaptureSession struct {
	ID          string       `json:"id"`
	InterfaceID string       `json:"interfaceId"`
	Filter      string       `json:"filter,omitempty"`
	MaxPackets  int          `json:"maxPackets,omitempty"`
	MaxSeconds  int          `json:"maxSeconds,omitempty"`
	State       CaptureState `json:"state"`
}
