# Pulseboard — MFE Health Governance

Pulseboard is an MFE health governance system for engineering leads. It gives teams a portfolio-level view of UI health, bundle budgets, API performance, installed dependency weight, ownership, and pull-request release decisions.

## Phase 1 scope

- MFE registry and ownership catalog
- Portfolio and per-MFE health scorecards
- UI metrics: LCP, INP, CLS, mount time and route health
- Bundle composition, installed package footprint and duplication
- Pull-request base/head comparisons
- Policy results with pass, warning and blocking outcomes
- Weekly engineering health reporting

The current app uses realistic mock measurements from the ecommerce MFE platform. Collector and GitHub App integrations are intentionally represented as contracts for the next implementation step.

## Phase 2

Phase 2 connects the dashboard to repeatable build and synthetic measurements, stores historical evidence, and publishes advisory pull-request decisions back to GitHub. See the [Phase 2 delivery plan](docs/phase-2-plan.md) for scope, architecture, milestones, and acceptance criteria.

## Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

The HTML test starts the production server, so build before running it. Root scripts delegate to the `@pulseboard/web` workspace. You can also run a web command directly with `npm run <command> --workspace @pulseboard/web`.

## Repository layout

- `apps/web/` — existing Next.js governance dashboard and its server-rendering test
- `tsconfig.base.json` — shared strict TypeScript settings for workspaces
- `packages/db/` — PostgreSQL access and migration tooling
- `packages/*` — workspace pattern for later Phase 2 packages, added when they contain implementation

The root `package.json` uses npm workspaces (`apps/*` and `packages/*`). The root lockfile remains the single dependency lockfile. New packages should declare their own dependencies and extend the shared TypeScript configuration where appropriate.

## Database foundation

`packages/db` is the PostgreSQL access boundary. [ADR 0001](docs/adr/0001-postgresql-access.md) records the Drizzle ORM, `pg`, and Drizzle Kit choice. The package has no application tables yet; PB-003 will add the first persistence schema.

Set `DATABASE_URL` to a local or CI PostgreSQL database URL. `.env.example` shows the format; keep real credentials in an ignored local file or your environment. Database commands read the process environment, so export the variable before running them. The Next.js app still uses Phase 1 mock data and does not require a database to render.

```bash
npm run db:health    # connect and run SELECT 1
npm run db:generate  # generate reviewable SQL after a schema change
npm run db:check     # check migration history for conflicts
npm run db:migrate   # apply committed migrations to the configured database
```

Review generated SQL in `packages/db/migrations/` before applying it. CI can run `npm run db:check` without database credentials and run `npm run db:health` and `npm run db:migrate` when a disposable PostgreSQL service and `DATABASE_URL` are available. No schema migration exists until a persistence table is defined.
