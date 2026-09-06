# Security Policy

Contractor Control Room is intentionally client-side and small, but that does not make the browser/tool boundary harmless. WebMCP input, persisted project state, and state-changing tools still need to be treated carefully because the agent and human operate on the same live workspace.

## Supported versions

Security fixes target the latest released version and `main`.

## Reporting a vulnerability

Do not publish exploit details, credentials, personal data, customer information, or real project financials in a public GitHub issue.

Use GitHub's private vulnerability reporting feature for this repository when available. If private reporting is unavailable, open a minimal public issue asking for a private contact path without disclosing the vulnerability itself.

A useful report includes:

- affected version or commit;
- browser/runtime involved;
- minimal reproduction steps using synthetic data;
- impact;
- whether user interaction is required;
- suggested remediation, if known.

## Security boundaries

Contractor Control Room does **not** perform:

- payments or banking operations;
- contract execution;
- authentication;
- server-side project storage;
- external financial/account mutation.

The hosted demo does not change that architecture; it serves the same static application.

Within the browser, preserve these boundaries:

- agent-controlled strings remain untrusted before rendering;
- untrusted values are not inserted into executable HTML without escaping;
- read-only/scenario operations remain distinguishable from baseline-changing operations;
- scenario analysis does not silently rewrite the live project;
- malformed or impossible persisted state is not accepted as trustworthy state;
- WebMCP unavailability should not break the normal human dashboard.

A report showing that a tool marked or presented as non-destructive can unexpectedly mutate the baseline is security/correctness relevant even if no external network action occurs.

## Disclosure

Give the project enough opportunity to reproduce the issue, fix it, add regression coverage, and verify the affected release path before public disclosure. A fix should not be called complete merely because the code changed; the relevant behavior needs to be validated.