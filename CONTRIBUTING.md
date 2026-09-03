# Contributing

Contractor Control Room is intentionally small: static browser code, deterministic project-finance logic, and a focused WebMCP tool surface. Contributions should preserve that simplicity unless a larger dependency is clearly justified.

## Development setup

Requirements:

- Node.js 20 or newer for tests
- any static HTTP server for browser testing

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

Before opening a PR:

1. Keep the change focused.
2. Add or update tests for deterministic logic, text-safety behavior, or the WebMCP registration surface when applicable.
3. Run `npm test` and report the result.
4. Do not commit credentials, customer data, real project financials, payment configuration, proprietary business assets, generated build output, or vendored dependencies.
5. Identify any third-party code or assets and confirm their license is compatible with this repository's MIT license.
6. Update `CHANGELOG.md` for user-visible changes.

## WebMCP changes

For changes to `webmcp.js`:

- preserve explicit `readOnlyHint` annotations;
- keep destructive or baseline-changing behavior clearly separated from scenario/read operations;
- keep input schemas narrow and bounded;
- ensure tool output is derived from the same application actions used by the human interface;
- update `tests/webmcp.test.mjs` when the public tool surface changes.

## Security and untrusted text

Treat agent-provided strings as untrusted input. Do not interpolate unescaped tool input into `innerHTML`. Prefer `textContent`; when string rendering through HTML is unavoidable, use the shared `escapeHtml` helper.

Report security issues using the process in `SECURITY.md` rather than publishing exploit details in a public issue.

## Provenance

By contributing, you represent that you have the right to submit the material under the MIT license. If code or assets came from another project, model output, generator, template, or external source, disclose that when its provenance or licensing is not obvious.
