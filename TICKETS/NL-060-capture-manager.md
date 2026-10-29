# NL-060: Capture manager

- Milestone: 4
- Depends on: NL-033, NL-042, NL-000
- Size: L

## Scope
`internal/capture` (worker side) with a supervisor per capture session. Start capture on one lab-owned interface (resolved from the interface id, never a client-supplied name). Configuration is typed: interface id, BPF filter (validated by a conservative grammar or by a compile check through libpcap, never passed through unchecked), max packets, max duration, max snapshot length, max bytes. Capture session ownership is tied to the lab and owner. Concurrency limit.
- Runs `tcpdump -i <iface> -nn -l -U -s <snaplen> -c <n> -w -` inside the namespace through the runner, using fixed args, and reads the pcap stream (NL-061). If tcpdump is not installed, report a clear capability error (this machine has no tcpdump today; the sandbox check script says so).
- Lifecycle: start, status, stop, automatic stop on limits, kill process group on stop, cleanup on lab delete, worker shutdown, and API disconnect. No zombie processes.

## Acceptance
Sandbox tests: start, observe traffic, stop; limits end the capture; deleting the lab kills the capture process (verified by process table); capturing an interface outside the lab is refused; arbitrary tcpdump arguments cannot be injected.
