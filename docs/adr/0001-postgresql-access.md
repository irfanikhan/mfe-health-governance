# ADR 0001: PostgreSQL access and migrations

## Status

Accepted for PB-002 on 2026-09-23.

## Context

Pulseboard needs durable PostgreSQL state. The repository has no database access boundary or migration workflow. PB-002 must establish those without defining Application Registry tables or selecting a managed PostgreSQL provider.

## Decision

Use Drizzle ORM with the `pg` (node-postgres) driver in `packages/db`. Use Drizzle Kit to generate reviewable SQL migrations from package-local persistence schemas and apply them with `drizzle-kit migrate`. Keep database connections behind the `@pulseboard/db` module. Supply the PostgreSQL connection URL through `DATABASE_URL`; do not commit real credentials. No managed PostgreSQL provider is selected by this ADR.

## Alternatives considered

- Prisma: provides a schema and migration workflow, but introduces its own schema language and generated client.
- Direct `pg` queries with a separate SQL migration tool: smaller query layer, but requires more manual mapping as the persistence model grows.

## Consequences

- Database schema definitions and generated SQL migrations live in `packages/db`.
- Application code depends on the database module rather than opening its own pools.
- Generated SQL must be reviewed before application; schema changes are not applied with `push`.

## Risks

- Drizzle and Drizzle Kit versions must remain compatible.
- Live migration and connection checks require an external PostgreSQL instance in local development or CI.

## Migration/reversal strategy

Keep migrations as SQL and avoid leaking Drizzle types into public contracts. A replacement query layer can reuse or translate the SQL history behind the package boundary.
