package topology

import (
	"fmt"
	"hash/fnv"
)

const (
	linuxNamePrefix      = "nl-"
	linuxNameLabIDLength = 4
	linuxNameMax         = 15
	linuxNameHashDigits  = 4
	linuxNameSeparator   = "-"
	linuxNameHashMask    = 0xffff
	linuxNameHashFormat  = "%04x"
)

func fnv1a32(name string) uint32 {
	hash := fnv.New32a()
	_, _ = hash.Write([]byte(name))
	return hash.Sum32()
}

func prefixWithin(text string, limit int) string {
	return text[:min(len(text), limit)]
}

// LabPrefix is "nl-", the lab id part (at most 4 characters), and "-".
func LabPrefix(labID string) string {
	return linuxNamePrefix + prefixWithin(labID, linuxNameLabIDLength) + linuxNameSeparator
}

// LinuxName is the deploy-time name of a node: always at most 15 characters, same rule as the editor.
func LinuxName(labID, name string) string {
	base := LabPrefix(labID)
	if len(base)+len(name) <= linuxNameMax {
		return base + name
	}
	room := linuxNameMax - len(base) - linuxNameHashDigits - len(linuxNameSeparator)
	hash := fmt.Sprintf(linuxNameHashFormat, fnv1a32(name)&linuxNameHashMask)
	return base + prefixWithin(name, room) + linuxNameSeparator + hash
}
