# Contributing

Contractor Control Room is intentionally small: static browser code, deterministic project-finance logic, and a focused WebMCP tool surface.

That simplicity is useful. A contribution does not need to make the project more complicated to make it better. Larger dependencies or abstractions are fine when they solve a real correctness, compatibility, or maintenance problem that the current design cannot reasonably handle.

## Development setup

Requirements:

- Node.js 20 or newer for tests;
- any static HTTP server for browser testing.

Run the automated checks:

```bash
npm test
```

Run the app locally, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Pull requests

A good pull request should make one project behavior easier to understand, safer, more correct, or more useful without hiding unrelated changes in the same diff.

Before opening a PR:

1. Keep the change focused.
2. Add or update tests for deterministic logic, state invariants, text-safety behavior, or the WebMCP registration surface when applicable.
3. Run `npm test` and report the actual result.
4. Do not commit credentials, customer data, real project financials, payment configuration, proprietary business assets, generated build output, or vendored dependencies.
5. Identify third-party code or assets and confirm that their license is compatible with this repository's MIT license.
6. Update `CHANGELOG.md` for user-visible changes.

If something could not be tested in your environment, say that directly instead of presenting an unrun check as passing.

## WebMCP changes

The WebMCP surface is part of the public behavior of the project. When changing `webmcp.js`:

- preserve explicit `readOnlyHint` annotations;
- keep read/scenario behavior separate from baseline-changing behavior;
- keep input schemas narrow and bounded;
- use the same underlying application actions that the human interface uses;
- update `tests/webmcp.test.mjs` when the public tool surface changes;
- keep unsupported-browser behavior graceful rather than making WebMCP mandatory for the human dashboard.

The main distinction to preserve is simple: **analysis and simulation should not silently become project-state mutation**.

## Project-state invariants

Changes that touch finance or persisted state should preserve the existing correctness rules, including:

- date-only finish dates remain timezone-safe;
- malformed or impossible dates are rejected before persistence;
- remaining cost/payment-timing fields do not become impossible negative live state;
- legacy/invalid browser-local state is repaired or rejected safely;
- scenario state stays separate from baseline state until explicitly applied.

Do not loosen an invariant merely to make an edge case easier to implement.

## Security and untrusted text

Treat agent-provided strings as untrusted input.

Do not interpolate unescaped tool input into `innerHTML`. Prefer `textContent`; when HTML string rendering is actually required, use the shared `escapeHtml` path and keep regression coverage around it.

The application does not need real credentials, payment secrets, customer records, or private project data for development/testing. Do not introduce them into fixtures.

Report security issues using `SECURITY.md` rather than publishing exploit details in a public issue.

## Provenance

By contributing, you represent that you have the right to submit the material under the MIT license.

If code or assets came from another project, model output, generator, template, or external source, disclose that when its provenance or licensing is not obvious. The goal is not to ban assisted development; the goal is to keep the repository's legal and technical provenance understandable.

## AI-assisted contributions

AI-assisted development is allowed. The contributor still owns the result they submit.

Before opening the PR, verify that referenced APIs and browser behavior are real, remove speculative/generated noise, run the checks you claim, and make sure no private or credential-bearing material entered the diff.