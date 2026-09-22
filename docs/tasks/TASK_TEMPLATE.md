# PB-XXX — Task Title

## Objective

Describe the single primary outcome this task must deliver.

## Why

Explain why this task exists and what product or architecture capability it unlocks.

## Dependencies

- PB-XXX — dependency name
- Or: None

Do not begin implementation if a required dependency is incomplete unless the task explicitly allows a temporary stub.

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- Add only the product, architecture, ADR, or contract docs relevant to this task.

## In scope

- Concrete change 1
- Concrete change 2
- Concrete change 3

## Out of scope

Do **not** implement:

- Future capability 1
- Future capability 2
- Unrelated refactors

## Functional requirements

1. Requirement
2. Requirement
3. Requirement

## Architecture constraints

- State any task-specific constraints here.
- Do not duplicate all rules from `AGENTS.md` or `ARCHITECTURE.md`.

## Suggested implementation areas

These are guidance, not a requirement to create files that do not fit the existing repository.

```text
path/
path/
```

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] Existing relevant behavior is not regressed.

## Tests

At minimum cover:

- happy path;
- validation or failure path;
- important domain behavior introduced by this task.

## Validation

Run the relevant repository checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If a command does not exist yet, report that fact rather than fabricating success.

## Definition of done

This task is complete only when:

- all acceptance criteria are satisfied;
- relevant tests pass;
- relevant validation has been run;
- documentation/contracts are updated if this task changes them;
- scope deviations and remaining risks are reported.

## Completion report

Report:

- summary;
- files changed;
- tests added/updated;
- validation commands and results;
- assumptions;
- risks/follow-ups;
- any scope deviation.
