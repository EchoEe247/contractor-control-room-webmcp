# Post-release audit

Date: 2026-09-03
Release reviewed: `v0.1.0`
Maintenance release published: `v0.1.1`

## Purpose

Validate the first public release from the published tag boundary and turn reproducible post-release findings into reviewed, tested maintenance work rather than repository-count or activity-only changes.

## v0.1.0 release-boundary checks

- `v0.1.0` is an annotated tag.
- The tag resolves to commit `890e177a34f9361cac7912321667e07685d2e587`.
- The tagged tree contains the application source, Node tests, MIT license, security/contribution/maintenance/provenance documentation, CI workflow, and release workflow.
- `package.json` at the tag declares version `0.1.0`, MIT licensing, Node.js `>=20`, and no runtime or development dependencies.
- The README provides a static-server path and documents behavior when WebMCP is unavailable.
- The GitHub release is public, non-draft, and non-prerelease, with synchronized changelog notes.

## Maintenance findings and resolutions

### 1. GitHub Actions runtime majors

The v0.1.0 CI emitted a GitHub-hosted runner warning that `actions/checkout@v4` targets the deprecated Node 20 action runtime. Upstream verification on 2026-09-03 found `actions/checkout@v7.0.1` and `actions/setup-node@v7.0.0`.

Resolution:
- issue #5;
- PR #6;
- PR CI run `33756021033`, Node 20 and 22 passed;
- squash merge `9538f080c270c63ec4e007cdfc84a3b79a7ee66f`;
- post-merge main CI and release synchronization passed.

### 2. Finish-date drift in UTC+13/+14

Date-only arithmetic used a local-noon `Date` and then serialized to UTC. In `Pacific/Kiritimati` (UTC+14), a zero-day adjustment could move `2026-09-03` to `2026-09-02`.

Resolution:
- issue #7;
- PR #8;
- date arithmetic now uses UTC calendar operations;
- regression coverage includes UTC+14 and year rollover;
- PR CI run `33756323185`, Node 20 and 22 passed;
- squash merge `50576d8fad4af952044ef9bc8949a6abf29b52de`.

### 3. Negative scenario state

Schema-valid negative scenario adjustments could produce negative remaining cost buckets or negative `nextPaymentDays`, and `apply_scenario` could persist those impossible values despite `configure_project` declaring the fields nonnegative.

Resolution:
- issue #9;
- PR #10;
- scenario calculation logic now enforces nonnegative live-state invariants independently of WebMCP schema validation;
- PR CI run `33756662680` passed;
- squash merge `fbdcec81c91b8fcd1e5edb0d6590bb81810e5d86`.

### 4. Invalid finish dates could be persisted

`configure_project.finishDate` was declared only as a string, allowing values such as `not-a-date` or impossible calendar dates to reach browser persistence and later break scenario date arithmetic.

Resolution:
- issue #11;
- PR #12;
- canonical real `YYYY-MM-DD` validation is now authoritative in runtime logic;
- the WebMCP schema also constrains the string shape;
- regression coverage includes malformed/impossible dates and valid leap-day handling;
- PR CI run `33757003696`, Node 20 and 22 passed;
- squash merge `564f2768b2fbcf26172b8e59072a6de2f2d0d0e1`.

### 5. Invalid legacy browser state survived upgrades

Because v0.1.0 stores project data in `localStorage`, state written before the fixes above could remain invalid after loading newer source. The old loader only recovered malformed JSON, not malformed values.

Resolution:
- issue #13;
- PR #14;
- persisted project state is normalized on load and rewritten when possible;
- valid signed cash values are preserved, invalid nonnegative/date fields fall back safely, and unknown keys are dropped;
- PR CI run `33757367746`, Node 20 and 22 passed;
- squash merge `f2b8b0831d061952a9543992646a77d96cd40c84`.

## v0.1.1 maintenance release

The five maintenance resolutions above were packaged through issue #15 / PR #16.

Release evidence:
- release-preparation PR CI run `33757670227`, Node 20 and 22 passed;
- release merge commit `e973df38f0d7467af51d8c86c661247773723eb8`;
- post-merge main CI run `33757830386`, Node 20 and 22 passed;
- release workflow run `33757875849` passed;
- public GitHub release ID `382019760` is non-draft and non-prerelease;
- annotated tag object `f62068c9dc0491560b4af11c6cf55385296ce55d` points to release commit `e973df38f0d7467af51d8c86c661247773723eb8`;
- the original `v0.1.0` annotated tag remains unchanged.

## Published archive execution

Issue #17 closed the final executable-release evidence gap with PR #18 and a dedicated `Release archive smoke` workflow.

The workflow runs only after successful `CI` on `main`. It resolves the latest public release, downloads the GitHub ZIP archive through the repository API into a fresh GitHub-hosted runner workspace, extracts it, verifies its package version and dependency boundary, and runs the documented checks from the extracted archive rather than from a working-tree checkout.

First successful evidence run:
- PR #18 merge commit: `30a1b83d1dc079b91ffac5e90adfb2279ac35d1c`;
- post-merge main CI run: `33793871803`, Node 20 and 22 passed;
- archive-smoke run: `33793906340`, job `100776852592`, passed;
- runner: Ubuntu 24.04 (`ubuntu-24.04`), Node `20.20.2`, npm `10.8.2`;
- release resolved: `v0.1.1`;
- archived package version: `0.1.1`;
- archive size: `28,207` bytes;
- archive SHA-256: `b54371b8145d273085622196bf69e5939729318ad978825ad775672be37bf05e`;
- extracted archive contained no preexisting `node_modules` directory;
- `npm run check` passed from the extracted archive;
- test result: 11 passed, 0 failed, 0 skipped, 0 cancelled.

## Scope note

The environment used for the original v0.1.0 audit could not itself resolve/download GitHub archives, so the first audit correctly recorded tagged-tree inspection plus GitHub CI rather than claiming an independent archive execution. That historical limitation is now closed for `v0.1.1`: a fresh GitHub-hosted runner downloaded the actual published ZIP through the repository API and executed the documented check suite from the extraction. This remains GitHub-hosted verification, not evidence from an unrelated third-party network or operating system.
