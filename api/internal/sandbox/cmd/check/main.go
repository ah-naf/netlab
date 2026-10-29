// Command check exits with an error unless the process may run privileged code.
package main

import (
	"fmt"
	"os"

	"netlab/api/internal/sandbox"
)

func main() {
	if err := sandbox.RequireSandbox(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println("ok to start")
}
