# Post-release audit

Date: 2026-09-03
Release reviewed: `v0.1.0`

## Purpose

Validate the first public release from the published tag boundary and record maintenance findings that are based on reproducible evidence rather than repository-count or activity goals.

## Release-boundary checks

- `v0.1.0` is an annotated tag.
- The tag resolves to commit `890e177a34f9361cac7912321667e07685d2e587`.
- The tagged tree contains the application source, Node tests, MIT license, security/contribution/maintenance/provenance documentation, CI workflow, and release workflow.
- `package.json` declares version `0.1.0`, MIT licensing, Node.js `>=20`, and no runtime or development dependencies.
- The README provides a static-server path and documents behavior when WebMCP is unavailable.
- The GitHub release is public, non-draft, and non-prerelease, with synchronized changelog notes.

## Maintenance finding 1 — GitHub Actions runtime majors

The release CI emitted a GitHub-hosted runner warning that `actions/checkout@v4` targets the deprecated Node 20 action runtime. Current upstream releases are `actions/checkout@v7.0.1` and `actions/setup-node@v7.0.0`, while this repository still uses v4 in CI and release workflows.

Action: update the workflow action majors through a reviewed pull request and confirm the repository still passes its Node 20/22 application test matrix.

## Scope note

This audit validates repository/release metadata and the published tagged tree through GitHub. The execution environment used for this audit cannot directly download the public archive from GitHub, so the existing successful CI on the tagged commit remains the execution evidence for `npm run check`; this limitation is recorded rather than silently treating a reconstructed tree as an independently downloaded archive.
