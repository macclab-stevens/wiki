# Overview of Fuzz Testing

> Source: *MACC: Intro to Fuzz Testing* (S. Korczuk, 2022)

> **Prerequisites:** This guide assumes you've read [Introduction to srsRAN, ZeroMQ, and Fuzz Testing](srsran-intro.md).

## Tools You'll Need

- A Linux terminal (Windows PowerShell, Ubuntu, etc.)
- [WinSCP](https://winscp.net/eng/index.php) — for editing source files on the remote host

---

## Running the Tests

There are two types of fuzz tests:

### Before-Fuzzing
Modify the **identifier in the caller functions** — i.e. change what the sender is encoding before it goes out.

### After-Fuzzing
Listen on the **inputs of the send functions** — observe what's actually being transmitted.

### Workflow

1. Edit the relevant C++ file via WinSCP to inject the before- or after-fuzz encoding change.
2. Rebuild — `make` into your build folder so the change takes effect.
3. Run the Python test harness against srsRAN.

---

## What to Look For in the Output

The server will print connection-state lines. Watch for these:

| Log line | Meaning |
|---|---|
| `[UsEq][hh:mm:ss]: RRC NR reconfiguration successful` | UE reconfigured cleanly |
| `[UsEq][hh:mm:ss]: Received RRC Reject` | UE rejected — fuzzed input triggered an RRC refusal |
| `[UsEq][hh:mm:ss]: Failed to setup/configure GW interface` | GW interface didn't come up |
| `[eNoB][hh:mm:ss]: connect(): Connection refused` | eNB can't reach the core network — config is wrong, discard the result |

---

## Common Problems

**Before-encoding**

- Watch out for **binary vs. decimal** mismatches. Keep the representation consistent across the call chain, or you'll see failed connections from out-of-range values.
- Some fields have hard bounds. For example, `sr_N_offset` must be greater than 0 — otherwise configuration fails at setup.

**After-encoding**

- Mind the variable types. For example, `dl_ccch_msg` is of type `dl_ccch_msg_s`, not a plain `char` or `int`. Casting it will produce a compile or runtime error.

**Test runs**

- If you see `[eNoB][hh:mm:ss]: connect(): Connection refused`, the eNB can't talk to the core network. The configuration is wrong — discard the run and fix the config before re-testing.

---

## References

- [LTE Setup Guide — srsRAN 22.04.1 documentation](https://docs.srsran.com/projects/4g/en/latest/app_notes/source/zeromq/source/index.html)
- [ZeroMQ — Get Started](https://zeromq.org/get-started/)
- [Fuzz Testing Architecture Used for Vulnerability Detection in Wireless Systems](https://vtechworks.lib.vt.edu/server/api/core/bitstreams/3be5d061-041e-48da-81e0-e54c45cde529/content)
- [WinSCP](https://winscp.net/eng/index.php)
