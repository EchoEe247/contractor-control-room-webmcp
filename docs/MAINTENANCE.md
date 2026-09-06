# Maintenance and Release Policy

Contractor Control Room is maintained as a small standalone OSS project. The WebMCP Challenge is part of its origin, not a reason to freeze the repository at the challenge submission.

The maintenance goal is practical: keep the application easy to run, keep the finance/scenario behavior trustworthy, and adapt the WebMCP integration when the experimental browser surface changes without turning a small static project into unnecessary infrastructure.

## Maintenance scope

Keep these surfaces working:

- the static human dashboard in current evergreen browsers;
- deterministic finance and scenario calculations;
- the documented WebMCP tool surface as browser support evolves;
- browser-local state behavior and invariants;
- the zero-dependency Node.js test suite on supported Node versions;
- the canonical public live demo when hosting remains available.

Compatibility or API changes in experimental WebMCP implementations may require follow-up releases.

A browser without WebMCP support should still get the normal human dashboard and a clear unavailable status. The agent integration is important, but it should not become a reason for the base application to fail.

## Versioning

Use semantic versioning where practical:

- **patch** — fixes, tests, documentation, compatibility/security hardening, and maintenance changes that do not intentionally break the public tool/state contract;
- **minor** — backward-compatible tools/features or additional project-finance behavior;
- **major** — intentional breaking changes to tool names, schemas, persisted-state compatibility, or public behavior.

Do not hide a real compatibility break inside a patch simply because the project is still small.

## Support policy

Security fixes target the latest released version and `main`. Older releases may not receive backports.

The current canonical release is `v0.1.1` until a later release is actually published.

## Release checklist

Before a tag is created:

1. Review the complete diff since the prior release.
2. Confirm no secrets, private business data, customer data, or incompatible third-party material are present.
3. Re-check dependency and license changes.
4. Run the full current project check (`npm run check`) on a supported Node.js version and require CI to pass.
5. Update `CHANGELOG.md` and package version when needed.
6. Confirm README, live-site wording, contribution guidance, security guidance, and documented WebMCP behavior match the candidate.
7. Tag the exact tested commit as `vX.Y.Z` and create release notes from the changelog.
8. Verify the published GitHub release archive through the clean archive-smoke path.
9. When the hosted demo is part of current project distribution, verify that the public site still serves/renders the expected application.

A release is not complete just because a tag exists. The released archive and the user-visible project surfaces should still match what the repository says was shipped.

## Dependency policy

The default preference is zero runtime and development dependencies because the current project does not need them.

That is a preference, not a purity rule. A dependency is justified when it solves a concrete correctness, compatibility, security, or maintenance problem that is not reasonably handled with the browser platform or Node.js standard library, and its license/provenance fits MIT distribution.

Do not add a framework solely to make the repository look more substantial.