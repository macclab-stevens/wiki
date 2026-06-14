# Introduction to srsRAN, ZeroMQ, and Fuzz Testing

> Source: *MACC: Intro to srsRAN* (S. Korczuk, 2022)

This is the conceptual introduction. For the hands-on procedure, see [Overview of Fuzz Testing](srsran-fuzz-testing.md).

## srsRAN

srsRAN is a 4G and 5G software radio suite. It includes:

### srsUE
A full-stack 4G and 5G NSA/SA UE application.

- **NSA** — non-standalone (5G built on top of an existing 4G infrastructure)
- **UE** — user equipment

### srsENB
- **eNodeB** — element in the E-UTRA of LTE; hardware connected to the mobile network that communicates wirelessly with handsets
- **gNodeB** — a 3GPP-compliant implementation of the 5G-NR base station

### srsEPC
A lightweight 4G EPC implementation with MME, HSS, and S/P-GW.

---

## ZeroMQ (ZMQ)

A high-performance asynchronous messaging library. It provides a message queue and can run without a dedicated message broker.

**The four "zeros":**

- Zero broker
- Zero latency
- Zero cost
- Zero administration

`libzmq` is the low-level library behind most language bindings.

---

## Fuzz Testing

Fuzz testing generates and injects random or unexpected inputs ("fuzzed" inputs) — similar in spirit to brute-force testing. The goal is to observe how the system reacts; an adverse reaction signals a possible vulnerability.

In this work, fuzz testing is applied to 5G wireless systems to surface vulnerabilities.

---

## Next Steps

Once you're familiar with the components above, move on to:

- [Overview of Fuzz Testing](srsran-fuzz-testing.md) — how to run before- and after-fuzz tests against srsRAN

---

## References

- [LTE Setup Guide — srsRAN 22.04.1 documentation](https://docs.srsran.com/projects/4g/en/latest/app_notes/source/zeromq/source/index.html)
- [ZeroMQ — Get Started](https://zeromq.org/get-started/)
- [Fuzz Testing Architecture Used for Vulnerability Detection in Wireless Systems](https://vtechworks.lib.vt.edu/server/api/core/bitstreams/3be5d061-041e-48da-81e0-e54c45cde529/content)
- [WinSCP](https://winscp.net/eng/index.php)
