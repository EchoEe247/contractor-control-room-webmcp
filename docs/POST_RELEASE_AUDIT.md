# Post-release audit

Date: 2026-09-03
Release reviewed: `v0.1.0`
Maintenance release prepared: `v0.1.1`

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

## v0.1.1 maintenance release gate

The `v0.1.1` release candidate contains the five completed maintenance resolutions above, preserves the zero-dependency architecture, and retains the Node.js 20/22 application test matrix. The release remains gated on the release-preparation PR, post-merge main CI, and automated annotated-tag/GitHub-release creation.

## Scope note

This audit validates repository/release metadata and the published tagged tree through GitHub. The execution environment used for the original v0.1.0 audit could not directly download the public archive from GitHub, so tagged-tree inspection plus successful GitHub CI are used as executable release evidence; that limitation is recorded rather than overstated as an independently downloaded archive execution.
