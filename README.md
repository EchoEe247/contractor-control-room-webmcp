# Contractor Control Room

[![CI](https://github.com/EchoEe247/contractor-control-room-webmcp/actions/workflows/ci.yml/badge.svg)](https://github.com/EchoEe247/contractor-control-room-webmcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Contractor Control Room is an agent-native project-finance workspace for small contractors. A contractor and a browser agent work on the same live project state: the human sees a dashboard while the agent gets deterministic WebMCP tools for inspection, what-if analysis, risk detection, and explicit state changes.

The project began as a 2026 WebMCP Challenge entry and is maintained as a standalone open-source application after the challenge.

## What it does

The dashboard tracks contract value, projected final cost, margin, cash exposure, receivables, payment timing, and finish date. A browser agent can inspect the same state and model scenarios without silently changing the baseline.

The collaboration loop is:

1. Human edits project assumptions visually.
2. Agent reads the same live state.
3. Agent creates a non-destructive scenario.
4. Dashboard shows baseline, scenario, and deltas.
5. Human can request another analysis or clear the scenario.
6. A state-changing tool applies the scenario only when the user wants it adopted.

No LLM backend, database, authentication system, or payment integration is required. The browser agent supplies reasoning; the site supplies deterministic domain operations.

## WebMCP tool surface

- `get_project_state` — read baseline and active scenario.
- `configure_project` — update provided live project assumptions.
- `record_job_costs` — record labor, material, or other real costs.
- `simulate_scenario` — model labor overruns, added material/other costs, payment delays, and finish-date delays without changing baseline state.
- `identify_risks` — analyze budget, margin, cash, receivables, and payment timing.
- `apply_scenario` — commit the active scenario to the live project.
- `clear_scenario` — discard the active scenario.

Read operations carry `readOnlyHint: true`; mutations are marked non-read-only. Tool callbacks reuse the same application actions as the visible human controls.

## Demo prompts

- “Inspect this project and tell me the biggest risks.”
- “Model a 15% labor overrun and delay the next customer payment by 14 days.”
- “Add another $4,200 of material cost to that scenario. What happens to margin?”
- “Clear that scenario; don’t change the real project.”
- “Record a $1,250 labor cost for framing.”
- “Apply the current scenario to the live project.”

## Architecture

```text
index.html              visible workspace
styles.css              responsive interface
app.js                  shared human/agent state + UI actions
calculations.js         deterministic finance/risk calculations
text.js                 untrusted-text escaping
webmcp.js               WebMCP tool registrations
tests/                  Node calculation/security/tool-surface tests
.github/workflows/      CI
```

State is persisted in browser `localStorage`. Scenario state is intentionally ephemeral and separate from the baseline until `apply_scenario` is invoked.

## Run locally

Serve the repository over HTTP(S) with any static server, then open it in a WebMCP-capable browser.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

In unsupported browsers the human dashboard still works and displays a clear `WebMCP unavailable` status.

## Tests

Requires Node.js 20+ and has no npm dependencies.

```bash
npm test
```

The suite covers financial derivation, non-destructive scenarios, date/payment delays, risk thresholds, WebMCP registration/read-only annotations, and escaping of agent-controlled text.

## Privacy and security

- Demo data is fictional.
- State remains in the browser unless a hosting platform logs normal HTTP metadata.
- The app has no backend API and performs no payment, banking, contract, or other external network mutation.
- Agent-provided strings are treated as untrusted before HTML rendering.
- Security reports should follow [`SECURITY.md`](SECURITY.md).

## Provenance and licensing

The repository is licensed under the [MIT License](LICENSE). It has no runtime or development dependencies and bundles no third-party JavaScript, CSS frameworks, fonts, images, or other vendor assets.

The `v0.1.0` release audit and its limitations are documented in [`docs/PROVENANCE.md`](docs/PROVENANCE.md).

## Contributing and maintenance

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the development and provenance requirements, [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) for versioning/support/release policy, and [`CHANGELOG.md`](CHANGELOG.md) for release history.
