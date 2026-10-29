// Command worker is the privileged networking worker (placeholder until NL-032).
package main

import (
	"fmt"
	"os"

	"netlab/api/internal/sandbox"
)

const notImplementedMessage = "worker not implemented yet (NL-032)"

func main() {
	if err := sandbox.RequireSandbox(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println(notImplementedMessage)
}
