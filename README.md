# Contractor Control Room — WebMCP Challenge

Contractor Control Room is an agent-native project-finance workspace for small contractors. A contractor and a browser agent work on the same live project state: the human sees a dashboard while the agent gets deterministic WebMCP tools for inspection, what-if analysis, risk detection, and approved state changes.

## Why WebMCP

Without WebMCP, a browser agent would need to infer labels, scrape values, click controls, and reconstruct application state from presentation. This app instead exposes the domain actions directly with `document.modelContext.registerTool(...)` while preserving a normal human interface.

The collaboration loop is:

1. Human edits project assumptions visually.
2. Agent reads the same live state.
3. Agent creates a non-destructive scenario.
4. Dashboard shows baseline, scenario, and deltas.
5. Human can modify assumptions or ask for another analysis.
6. Agent only commits a scenario when the user wants it applied.

No LLM backend is required. The browser agent provides reasoning; the site provides deterministic contractor-domain operations.

## WebMCP tool surface

- `get_project_state` — read baseline and active scenario.
- `configure_project` — update provided live project assumptions.
- `record_job_costs` — record labor, material, or other real costs.
- `simulate_scenario` — model labor overruns, material/other increases, payment delays, and finish-date delays without changing baseline state.
- `identify_risks` — analyze budget, margin, cash, receivables, and payment timing.
- `apply_scenario` — commit the active scenario to the live project.
- `clear_scenario` — discard the active scenario.

Read operations carry `readOnlyHint: true`; mutations are marked non-read-only. All tool callbacks reuse the same client-side actions as the visible human controls.

## Demo prompts

- “Inspect this project and tell me the biggest risks.”
- “Model a 15% labor overrun and delay the next customer payment by 14 days.”
- “Add another $4,200 of material cost to that scenario. What happens to margin?”
- “Clear that scenario; don’t change the real project.”
- “Record a $1,250 labor cost for framing.”
- “Apply the current scenario to the live project.”

## Architecture

```text
index.html          visible workspace
styles.css          responsive interface
app.js              shared human/agent state + UI actions
calculations.js     deterministic finance/risk calculations
webmcp.js           WebMCP tool registrations
tests/              Node calculation tests
```

State is persisted in browser `localStorage`. Scenario state is intentionally ephemeral and separate from the baseline until `apply_scenario` is invoked.

## Run locally

Serve the repository over HTTP(S) with any static server, then open it in a WebMCP-capable browser.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

In unsupported browsers the human dashboard still works and displays a clear “WebMCP unavailable” status.

## Tests

Requires Node.js 20+.

```bash
npm test
```

The suite covers baseline financial derivation, non-destructive scenario behavior, date/payment delays, and risk threshold detection.

## Challenge scope / provenance

This public repository was created specifically for the 2026 WebMCP Challenge. It is a standalone open-source application. It uses general contractor-domain concepts informed by prior work, but it does **not** include commercial storefront code, encrypted spreadsheet products, fulfillment infrastructure, customer data, payment secrets, or private repository assets.

## Privacy and safety

- Demo data is fictional.
- Data remains in the browser unless a hosting platform logs normal HTTP metadata.
- Scenarios do not alter baseline state until explicitly applied.
- The app performs no payments, bank operations, contract execution, or external network mutations.

## License

MIT
