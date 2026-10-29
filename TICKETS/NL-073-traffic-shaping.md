# NL-073: Traffic shaping with tc

- Milestone: 5
- Depends on: NL-044
- Size: M

## Scope
Typed `SetShaping` op on a lab interface: delay, jitter, loss, rate limit through `tc qdisc` (`netem`, `tbf`) using validated numeric parameters only. Link inspector fields, inspection of the qdisc through `tc -j qdisc show` and drift handling. Requires `tc` on the machine; if missing, the feature reports a capability error and the check script flags it.

## Acceptance
Sandbox test: add 100 ms delay on a link and measure ping latency above 100 ms; removal restores it. Skipped with a clear message if `tc` is absent.
