# NL-046: Run commands in a namespace

- Milestone: Use the lab
- Depends on: NL-041
- Size: M

## Scope
The draft labs ping, curl, run a server, and watch packets with tcpdump. Add these as typed worker ops, run with `ip netns exec nl-<name>` (or in the root namespace for a `host` node):
- `Ping`: target IP, count 1 to 10.
- `Curl`: target IP, port, path `/`, timeout 5 seconds, response text capped.
- `StartServer` and `StopServer`: a simple HTTP server on a port inside the namespace (simplest: `python3 -m http.server <port>` in an empty temp directory). The worker tracks the processes and kills them on `DeleteOwned`.
- `Tcpdump`: interface name from the lab, `-nn -c <1 to 50>`, text output only.
- `POST /run` takes a node id and a typed command. It resolves the node name from the last deployed lab (NL-037). Anything else is refused.
- UI: a "Run" tab with a namespace picker, a command picker, its fields, and the output below.

## Acceptance
In the sandbox, deploy `direct-link` (NL-077): start a server in one namespace, `curl` it from the other and see 200, `ping` works, `tcpdump -c 3` on the server side shows the ping. Reset leaves no server process.
