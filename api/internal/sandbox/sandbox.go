// Package sandbox tells privileged code whether it runs inside the throwaway sandbox.
package sandbox

import (
	"errors"
	"fmt"
	"os"
	"strings"
	"syscall"
)

const (
	HostOverrideEnv   = "NETLAB_ALLOW_HOST"
	hostOverrideValue = "1"

	// HostOverrideWarning is printed whenever the override lets a program run outside the sandbox.
	HostOverrideWarning = "WARNING: " + HostOverrideEnv + "=1 runs privileged code on this machine. Use it on a disposable VM only."

	uidMapPath     = "/proc/self/uid_map"
	identityUIDMap = "0 0 4294967295"
	selfUserNSPath = "/proc/self/ns/user"
	selfNetNSPath  = "/proc/self/ns/net"

	// ioctl that returns a file descriptor for the user namespace owning a namespace.
	nsGetUserNS = 0xb701
)

// ErrNotInSandbox is returned when privileged code starts outside the sandbox without the override.
var ErrNotInSandbox = errors.New("not in sandbox: run through scripts/sandbox.sh")

// HostOverrideEnabled reports whether NETLAB_ALLOW_HOST is exactly "1".
func HostOverrideEnabled() bool {
	return os.Getenv(HostOverrideEnv) == hostOverrideValue
}

// InSandbox reports whether the process runs in a user and network namespace created by the sandbox.
func InSandbox() bool {
	return hasUserMapping() && netNSOwnedBySelf()
}

// RequireSandbox lets a privileged program start only inside the sandbox, or with the host override (with a warning).
func RequireSandbox() error {
	if InSandbox() {
		return nil
	}
	if HostOverrideEnabled() {
		fmt.Fprintln(os.Stderr, HostOverrideWarning)
		return nil
	}
	return ErrNotInSandbox
}

func hasUserMapping() bool {
	content, err := os.ReadFile(uidMapPath)
	return err == nil && strings.Join(strings.Fields(string(content)), " ") != identityUIDMap
}

func netNSOwnedBySelf() bool {
	netNS, err := os.Open(selfNetNSPath)
	if err != nil {
		return false
	}
	defer netNS.Close()

	ownerFD, _, errno := syscall.Syscall(syscall.SYS_IOCTL, netNS.Fd(), nsGetUserNS, 0)
	if errno != 0 {
		return false
	}
	defer syscall.Close(int(ownerFD))

	owner, self := inode(int(ownerFD)), inodeOfPath(selfUserNSPath)
	return owner != 0 && owner == self
}

func inode(fd int) uint64 {
	var stat syscall.Stat_t
	if syscall.Fstat(fd, &stat) != nil {
		return 0
	}
	return stat.Ino
}

func inodeOfPath(path string) uint64 {
	var stat syscall.Stat_t
	if syscall.Stat(path, &stat) != nil {
		return 0
	}
	return stat.Ino
}
