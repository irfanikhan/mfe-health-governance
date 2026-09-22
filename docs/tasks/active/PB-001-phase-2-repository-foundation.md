# PB-001 — Phase 2 Repository Foundation

## Objective

Prepare the Pulseboard repository for modular Phase 2 development without changing the current product behavior.

## Why

Phase 1 is primarily a single Next.js application. Phase 2 introduces independent domain areas such as contracts, persistence, collector logic, policy evaluation, GitHub integration, and shared test fixtures.

The repository needs clear boundaries before those capabilities are implemented.

## Dependencies

None.

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`

## In scope

- Inspect the existing repository structure and scripts.
- Introduce the minimum repository/package structure needed for Phase 2.
- Preserve the existing Next.js application and Phase 1 UI.
- Establish shared TypeScript/package boundaries suitable for future:
  - contracts;
  - database/persistence;
  - collector;
  - policy engine;
  - GitHub integration;
  - test fixtures.
- Ensure root-level validation commands can run or clearly delegate to the correct workspace/package commands.
- Update repository documentation only where required by the structure change.

## Out of scope

Do **not** implement:

- PostgreSQL;
- Drizzle or Prisma;
- Application database schema;
- Connect Application UI;
- collector logic;
- GitHub App integration;
- policy engine;
- background jobs;
- authentication.

Do not perform unrelated UI redesigns.

## Functional requirements

1. The existing Pulseboard application still starts and builds successfully.
2. The repository has clear package boundaries for future Phase 2 modules.
3. Existing imports continue to work or are migrated cleanly.
4. Root scripts provide a predictable validation workflow.
5. No Phase 2 business capability is implemented in this task.

## Architecture constraints

- Do not move business logic into UI components while restructuring.
- Avoid premature package creation if a package would contain no meaningful code yet.
- Prefer incremental migration over a large destructive rewrite.
- If Turborepo is introduced, configure only what the current repository actually needs.

## Suggested target shape

Adapt to the existing repository where necessary.

```text
apps/
  web/

packages/
  contracts/
  db/
  collector/
  policy-engine/
  github/
  test-fixtures/
  config/
```

Empty placeholder packages are not required if they create unnecessary noise. It is acceptable to establish the workspace and create packages as subsequent tasks need them.

## Acceptance criteria

- [ ] Existing Pulseboard UI behavior remains intact.
- [ ] The repository has an explicit workspace/package strategy.
- [ ] The Next.js application builds successfully from the new structure.
- [ ] TypeScript resolution works across established packages.
- [ ] Root validation commands are documented and usable.
- [ ] No database, collector, policy, or GitHub functionality is introduced.
- [ ] The diff is primarily structural/configurational.

## Tests

- Run existing tests.
- Add structural/configuration tests only if the repository already has a suitable mechanism.

## Validation

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If workspace migration changes commands, document the exact equivalent commands used.

## Definition of done

The repository is ready for PB-002 without altering Pulseboard's user-facing Phase 1 behavior.

## Completion report

Include:

- final repository layout;
- package/workspace tooling introduced;
- scripts changed;
- files moved;
- validation results;
- migration risks or follow-up cleanup.
