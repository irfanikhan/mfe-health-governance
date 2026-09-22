# PB-002 — Database Foundation

## Objective

Introduce the Phase 2 PostgreSQL persistence foundation and database access boundary without yet implementing the full Application Registry domain.

## Why

Pulseboard currently depends on in-memory/mock data. Phase 2 requires durable state, migrations, repository abstractions, and a safe path for schema evolution.

## Dependencies

- PB-001 — Phase 2 Repository Foundation

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- Relevant accepted ADRs for database provider and ORM/query layer, if present.

If the repository does not yet contain an accepted database/ORM ADR, do not silently invent a long-term provider decision. Implement only what is explicitly approved in current project documentation.

## In scope

- Add the approved PostgreSQL client/ORM/query layer.
- Configure environment-based database connectivity.
- Establish database schema/migration locations.
- Add migration commands.
- Add a database health/connectivity path suitable for local development and CI.
- Introduce a database access module that future repositories/services can depend on.
- Add safe local-development environment documentation.
- Ensure secrets are not committed.

## Out of scope

Do **not** implement:

- the complete Application entity;
- Application CRUD APIs;
- Connect Application UI;
- collector/scan tables;
- policies;
- GitHub integration;
- authentication/authorization.

A minimal migration metadata or health-check table may be used only if the selected database tooling requires it.

## Functional requirements

1. The application can connect to PostgreSQL using environment configuration.
2. Database migrations can be generated/applied using documented commands.
3. CI/local validation can detect schema or migration errors.
4. Application code does not instantiate ad hoc database connections throughout the codebase.
5. Database credentials never appear in source-controlled files.

## Architecture constraints

- Database models are persistence representations, not public API contracts.
- Keep connection/configuration code centralized.
- Prefer explicit migrations that can be reviewed in pull requests.
- Do not create application-specific schema until PB-003.

## Suggested implementation areas

```text
packages/db/
  src/
  migrations/

.env.example
```

Adapt paths to the actual repository structure established by PB-001.

## Acceptance criteria

- [ ] Approved PostgreSQL tooling is installed and configured.
- [ ] A database connection can be established in local/test configuration.
- [ ] Migration generation/application is documented.
- [ ] Migration files are source controlled where appropriate.
- [ ] No secrets are committed.
- [ ] Existing application behavior still works.
- [ ] No Application Registry business behavior is implemented yet.

## Tests

Cover:

- database configuration validation;
- connection/bootstrap behavior where practical;
- migration/schema smoke test if CI infrastructure supports it.

## Validation

Run repository validation plus any database-specific check introduced by this task.

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Definition of done

PB-003 can define and persist the Application domain using an established database boundary.

## Completion report

Include:

- database/ORM tooling used;
- environment variables introduced;
- migration commands;
- files added;
- tests;
- validation results;
- unresolved infrastructure assumptions.
