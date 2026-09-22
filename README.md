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
- `packages/` — reserved by the npm workspace pattern for future Phase 2 packages; packages are added when they contain implementation

The root `package.json` uses npm workspaces (`apps/*` and `packages/*`). The root lockfile remains the single dependency lockfile. New packages should declare their own dependencies and extend the shared TypeScript configuration where appropriate.
