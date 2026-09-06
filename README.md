# Contractor Control Room

[![CI](https://github.com/EchoEe247/contractor-control-room-webmcp/actions/workflows/ci.yml/badge.svg)](https://github.com/EchoEe247/contractor-control-room-webmcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Contractor Control Room is a small project-finance workspace where a contractor and a browser agent work from the **same live project state**.

The human gets a normal dashboard. A WebMCP-capable browser agent gets deterministic tools for reading that state, modeling what-if scenarios, identifying project risks, and making explicit state changes when the user actually wants them applied.

The main point is that the agent should not need a separate hidden backend view of the project. The dashboard and the agent operate on the same state and the same application actions, so what the agent analyzes is what the contractor can see.

The project started as a 2026 WebMCP Challenge entry, but it is maintained as a standalone open-source application after the challenge. The current release is **v0.1.1**.

## Live demo

**https://contractor-control-room-webmcp.onrender.com/**

The demo is a static deployment of this repository's `main` branch. State stays browser-local. Hosting the app does **not** add a backend database, authentication system, payment surface, or external project-state mutation.

That distinction matters: this is a client-side project workspace with browser-agent tooling, not a hosted financial system.

## What it does

The dashboard tracks:

- contract value;
- projected final cost;
- margin;
- cash exposure;
- receivables;
- payment timing;
- finish date.

A browser agent can inspect the same state and model changes without silently replacing the baseline.

The normal collaboration loop is:

1. The contractor edits project assumptions visually.
2. The agent reads the same live state.
3. The agent creates a non-destructive scenario.
4. The dashboard shows the current baseline, scenario, and deltas.
5. The contractor can ask for more analysis or clear the scenario.
6. A state-changing tool applies the scenario only when the user wants that scenario adopted.

No LLM backend, database, authentication system, or payment integration is required. The browser agent supplies reasoning; Contractor Control Room supplies deterministic project-finance operations.

## WebMCP tool surface

The current public tool surface is:

- `get_project_state` — read baseline and active scenario.
- `configure_project` — update provided live project assumptions.
- `record_job_costs` — record labor, material, or other real costs.
- `simulate_scenario` — model labor overruns, added material/other costs, payment delays, and finish-date delays without changing baseline state.
- `identify_risks` — analyze budget, margin, cash, receivables, and payment timing.
- `apply_scenario` — commit the active scenario to the live project.
- `clear_scenario` — discard the active scenario.

Read operations carry `readOnlyHint: true`. Mutations are marked non-read-only. Tool callbacks reuse the same application actions used by the visible human controls instead of creating a second hidden behavior path for the agent.

## Demo prompts

Examples:

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

Baseline project state is persisted in browser `localStorage`. Scenario state is intentionally separate and ephemeral until `apply_scenario` is invoked.

That separation is important: asking “what if?” should not quietly rewrite the real project.

## Run locally

Serve the repository over HTTP(S) with any static server, then open it in a WebMCP-capable browser.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

In a browser without WebMCP support, the human dashboard should still work and show a clear `WebMCP unavailable` status. WebMCP availability is an enhancement to the workspace, not a requirement for the page to function as a normal dashboard.

## Tests

The test suite requires Node.js 20+ and the project has no npm dependencies.

```bash
npm test
```

The suite covers financial derivation, non-destructive scenarios, date/payment delays, risk thresholds, WebMCP registration/read-only annotations, persisted-state invariants, and escaping of agent-controlled text.

## Privacy and security

- Demo data is fictional.
- Project state remains in the browser unless a hosting platform records ordinary HTTP metadata.
- The app has no backend API and performs no payment, banking, contract, or other external network mutation.
- Agent-provided strings are untrusted before HTML rendering.
- State-changing tools remain distinct from read-only/scenario operations.
- Security reports should follow [`SECURITY.md`](SECURITY.md).

## Provenance and licensing

The repository is licensed under the [MIT License](LICENSE).

It has no runtime or development dependencies and bundles no third-party JavaScript, CSS framework, font, image, or other vendor asset.

The `v0.1.0` provenance/release audit is preserved in [`docs/PROVENANCE.md`](docs/PROVENANCE.md). That document is historical evidence for the original release boundary; current release history is recorded in [`CHANGELOG.md`](CHANGELOG.md).

## Contributing and maintenance

Contributions are welcome when they keep the project useful and understandable rather than adding complexity for its own sake.

See:

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — development, WebMCP, safety, and provenance expectations.
- [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) — versioning, support, and release policy.
- [`CHANGELOG.md`](CHANGELOG.md) — release history.

The project is intentionally small. A larger framework or dependency can still make sense, but it should solve a real correctness, compatibility, or maintenance problem that the current static architecture cannot reasonably handle.