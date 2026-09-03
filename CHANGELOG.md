# Changelog

All notable changes to Contractor Control Room are documented here.

## [0.1.0] - 2026-09-03

### Added

- static contractor project-finance dashboard;
- deterministic cost, margin, cash, receivables, payment-timing, and scenario calculations;
- seven WebMCP tools for read, simulation, risk analysis, and explicit project-state changes;
- browser-local persistence with non-destructive scenario state;
- Node test suite for financial calculations, WebMCP registration, and untrusted-text escaping;
- CI on Node.js 20 and 22;
- MIT license, contribution policy, security policy, provenance audit, and maintenance policy.

### Security

- escape agent-controlled activity text and scenario finish-date values before rendering them through `innerHTML`.
