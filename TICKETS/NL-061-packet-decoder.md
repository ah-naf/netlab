# NL-061: Packet decoder

- Milestone: 4
- Depends on: NL-000
- Size: M

## Scope
`internal/capture/decode`: pcap stream reader and decoder (gopacket) into the `PacketEvent` schema from DRAFT.md section 9: event id, capture id, lab id, timestamp, interface id and name, direction if reliably known, sequence number, MAC, IP, ports, protocol, length, TCP flags, ICMP type and code, decode status, truncation flag, plus a bounded copy of raw bytes (size-limited, base64 in JSON) and a decoded layer tree for the detail view (Ethernet, IPv4/IPv6, ICMP, TCP, UDP, ARP, DNS at minimum). Never parse human-readable tcpdump text. Malformed packets produce a `decode_error` status, not a panic.
- Raw payload is not persisted by default; only the bounded in-flight copy exists.

## Acceptance
Unit tests with sample pcaps in `testdata/pcap/` (ICMP echo, ARP, TCP SYN, UDP DNS, truncated, malformed, VLAN-tagged). Fuzz test on the reader.
