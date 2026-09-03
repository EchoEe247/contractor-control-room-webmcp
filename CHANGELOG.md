# Changelog

All notable changes to Contractor Control Room are documented here.

## [0.1.1] - 2026-09-03

### Fixed

- make date-only finish-date arithmetic timezone invariant, including UTC+13/+14 environments;
- prevent scenario adjustments from producing negative remaining labor, materials, other costs, or payment timing;
- reject malformed and impossible project finish dates before live-state persistence, while constraining the WebMCP date schema;
- repair invalid browser-local project state written by earlier versions when the application loads.

### Maintenance

- update GitHub Actions checkout and Node setup actions to current v7 majors while preserving the Node.js 20 and 22 application test matrix.

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
