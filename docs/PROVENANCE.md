# Provenance and Release Audit

Audit date: 2026-09-03

Release candidate: `v0.1.0`

## Scope

This audit covers the repository's complete pre-release Git history from the initial commit `d6c9fe0` through `67ff0b1`, plus the current release-hygiene branch.

The pre-release history contains 12 linear commits. The source, tests, documentation, license, and deployment configuration were introduced directly in this repository; the audited history contains no merge commits, vendored source trees, generated bundles, submodules, or imported package lockfiles.

## Repository boundary

The release contains only the standalone Contractor Control Room application and project-level OSS files:

- static HTML/CSS/JavaScript;
- deterministic project-finance calculations;
- WebMCP registration code;
- fictional demonstration data;
- Node.js tests using only built-in modules;
- static hosting configuration;
- OSS documentation and CI configuration.

The audited tree does not contain commercial storefront code, spreadsheet products, fulfillment infrastructure, payment credentials, customer records, private repository assets, or environment-specific secrets.

## Dependency and license audit

Runtime dependencies: **none**.

Development/test dependencies: **none**. Tests use the Node.js standard library (`node:test` and `node:assert`).

Browser assets: no external JavaScript libraries, CSS frameworks, web fonts, images, or CDN assets are bundled or fetched by the application.

Repository license: MIT. Because the release contains no bundled third-party dependency or asset requiring an additional notice, no third-party license file is required for `v0.1.0`.

## Secret and privacy review

Every pre-release commit diff was inspected. No credential-shaped literals, API keys, access tokens, passwords, private keys, payment secrets, or customer datasets were found in the audited history.

The default project data is fictional demonstration data. Application state is stored in browser `localStorage`; the application has no API backend and performs no external network mutation.

## Security finding resolved before release

The audit found that agent-controlled activity notes and a tool-controlled finish-date string could reach `innerHTML`. The release branch adds a shared HTML-escaping utility and regression tests so untrusted text is encoded before HTML rendering.

## Provenance limits

This audit establishes provenance from the repository's own Git history and current tree. It is not a universe-wide code-similarity or plagiarism search, and Git authorship metadata alone does not establish which editor, generator, or AI-assisted tooling may have been used during development.

Future contributions must identify imported third-party code/assets and confirm that contributors have the right to license their submissions under MIT. See `CONTRIBUTING.md`.
