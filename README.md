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
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate

```bash
npm run build
npm test
```

## Planned technical shape

- `app/` — governance dashboard
- future `packages/contracts` — normalized health event schemas
- future `packages/collector` — bundle, SBOM and synthetic collectors
- future `packages/policy-engine` — release decision rules
- future `packages/browser-sdk` — per-MFE runtime attribution
