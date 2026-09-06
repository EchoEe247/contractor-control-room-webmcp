## What changed

Describe the user-visible or maintainer-visible problem and the focused change that addresses it.

## Why

Link the issue when one exists. Explain why this belongs in Contractor Control Room's intentionally small architecture.

## Validation

- [ ] `npm test` passes.
- [ ] Relevant browser behavior was checked when the change affects UI, persistence, or WebMCP registration.
- [ ] New or changed calculations have focused regression coverage.
- [ ] State-changing behavior remains explicit and distinct from read-only/scenario behavior.
- [ ] Untrusted text remains escaped before HTML rendering.

List any additional validation performed:

```text
<commands / browser build / result>
```

## Scope and compatibility

- [ ] No unrelated dependency/framework churn is included.
- [ ] Browser-local state compatibility was considered if persistence changed.
- [ ] WebMCP-unavailable browsers still retain a functioning normal dashboard unless this PR intentionally changes that boundary.
- [ ] No credentials, customer data, or real project-finance data are included in tests, fixtures, screenshots, or logs.

## Notes for review

Call out known limitations, follow-up work, or behavior that could not be tested in the current environment.
