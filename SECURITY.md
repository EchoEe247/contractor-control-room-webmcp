# Security Policy

## Supported versions

Security fixes are applied to the latest released version and `main`.

## Reporting a vulnerability

Do not include exploit details, credentials, personal data, or customer information in a public GitHub issue.

Use GitHub's private vulnerability reporting feature for this repository when available. If private reporting is unavailable, open a minimal public issue requesting a private contact path without disclosing the vulnerability details.

A useful report includes:

- affected version or commit;
- browser/runtime involved;
- reproduction steps that do not expose real secrets or customer data;
- impact and whether user interaction is required;
- suggested remediation, if known.

## Security boundaries

Contractor Control Room is a client-side demonstration application. It does not perform payments, banking operations, contract execution, authentication, or server-side storage.

WebMCP tool inputs must still be treated as untrusted. Agent-controlled strings must not be inserted into executable HTML without escaping, and state-changing tools must remain distinguishable from read-only operations.
