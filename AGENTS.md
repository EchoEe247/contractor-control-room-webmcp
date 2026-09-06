# AGENTS.md

This file is the operating handoff for fresh ChatGPT or agent sessions working in Contractor Control Room.

## Project authority

Use the current repository, release, tests, live-site state, and maintained documentation as the authority for what the project is and what it currently supports.

The project began as a WebMCP Challenge entry, but it is maintained after the challenge. Do not treat challenge-era wording as current project posture when newer repository evidence says otherwise.

Current release authority is `v0.1.1` until a later release is actually published.

## Angel wording integration

For Angel-owned project communication, use `EchoEe247/Chatgpt-Angel-wording-refinement` as the wording/refinement authority.

Keep the boundary clear:

- Contractor Control Room defines **what the application does, its WebMCP tool surface, project-state behavior, release state, and security/maintenance rules**;
- `Chatgpt-Angel-wording-refinement` defines **how Angel-owned communication about the project should be refined and expressed**.

For routine wording work, load that repository's `prompts/SESSION_BOOTSTRAP.md`. For important or ambiguous technical, maintenance, release, security, website, or public-project wording, also load the full system spec, relevant context profile, and meaning-preservation rules.

Default to Angel-refined. Use Angel-professional for serious technical, security, maintenance, and release documentation. Website/product copy can use the website/product profile while preserving the same project truth.

Project truth always outranks style.

## Core project distinctions

Preserve these unless a later reviewed project decision changes them:

- the contractor and browser agent work from the same live browser project state;
- scenario analysis stays separate from baseline state until explicitly applied;
- read-only/scenario tools remain distinguishable from state-changing tools;
- the human dashboard remains useful even when WebMCP is unavailable;
- the application is client-side and does not add a backend database, authentication system, payment system, or external financial mutation;
- state remains browser-local under the documented design;
- agent-controlled text remains untrusted before rendering;
- deterministic finance/state invariants stay covered by tests;
- the project prefers a small zero-dependency architecture unless a dependency solves a real correctness, compatibility, security, or maintenance problem.

## Historical evidence boundary

`docs/PROVENANCE.md` and `docs/POST_RELEASE_AUDIT.md` are historical evidence. Do not rewrite them to sound current merely because wording elsewhere changes.

Update living documentation when current project behavior changes and preserve old audits as records of what was checked at the time.