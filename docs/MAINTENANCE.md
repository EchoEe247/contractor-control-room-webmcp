# Maintenance and Release Policy

Contractor Control Room is maintained as a small standalone OSS project rather than a frozen challenge submission.

## Maintenance scope

The maintainer intends to keep the following surfaces working:

- the static human dashboard in current evergreen browsers;
- deterministic finance/scenario calculations;
- the documented WebMCP tool surface as browser support evolves;
- the zero-dependency Node.js test suite on supported Node versions.

Compatibility or API changes in experimental WebMCP implementations may require follow-up releases. Unsupported browsers should continue to provide the normal human dashboard and a clear unavailable status rather than failing the page.

## Versioning

Releases use semantic versioning where practical:

- patch: fixes, tests, documentation, security hardening without intentional public tool changes;
- minor: backward-compatible tools/features or additional project-finance behavior;
- major: intentional breaking changes to tool names, schemas, persisted state, or public behavior.

## Support policy

Security fixes target the latest released version and `main`. Older releases may not receive backports.

## Release checklist

Before a tag is created:

1. Review the complete diff since the prior release.
2. Confirm no secrets, private business data, customer data, or incompatible third-party material are present.
3. Re-check dependency/license changes.
4. Run `npm test` on a supported Node.js version and require CI to pass.
5. Update `CHANGELOG.md` and package version when needed.
6. Confirm README and contribution/security guidance match current behavior.
7. Tag the exact tested commit as `vX.Y.Z` and create release notes from the changelog.

## Dependency policy

The default preference is zero runtime dependencies. A new dependency should solve a concrete maintenance or correctness problem that is not reasonably addressed with the platform or Node standard library, and its license must be compatible with MIT distribution.
