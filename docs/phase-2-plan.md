# Phase 2 — Connected Measurement and PR Governance

## Outcome

Phase 2 turns Pulseboard from a realistic governance prototype into a working pilot system. It will collect repeatable evidence from real MFE builds, preserve historical results, compare pull-request changes with an approved baseline, and publish an advisory release decision that engineering leads can audit.

The release remains advisory. Merge blocking is intentionally deferred until the team has enough baseline data to prove that policies are stable and do not create avoidable delivery friction.

## Product goals

1. Onboard an MFE with ownership, repository, routes, budgets, and test-flow configuration.
2. Measure bundle composition, dependency footprint, synthetic UI performance, mount timing, and selected API response times.
3. Attribute every measurement to an MFE, route, environment, release, commit, collector version, and time window.
4. Compare pull-request head results with the base branch and the most recent healthy production baseline.
5. Explain every warning or failure with the observed value, threshold, regression, evidence source, and recommended owner.
6. Show historical trends and scan reliability so leaders can distinguish a real regression from noisy or incomplete evidence.
7. Publish an advisory GitHub Check with a link back to the full Pulseboard report.

## Phase 2 scope

### P0 — required for the pilot

- MFE registry with repository, team, routes, budgets, and active status.
- Versioned measurement contracts shared by collectors, API routes, policy evaluation, and UI.
- Node-based collector that runs in GitHub Actions for both the base and head commits.
- Bundle and dependency collection from build output, lockfiles, and package manifests.
- Lighthouse-based synthetic route checks with separate lab metrics.
- Scripted API probes for explicitly configured customer journeys.
- Authenticated ingestion API with idempotency and payload validation.
- PostgreSQL persistence for MFEs, releases, scans, metrics, findings, policies, and PR evaluations.
- Explainable policy evaluation with pass, warning, error, and insufficient-evidence outcomes.
- Portfolio, application, scan, and pull-request detail pages backed by stored data.
- Advisory GitHub Check and pull-request summary.
- Collector status, last successful scan, failure reason, and data freshness indicators.

### P1 — include when the pilot foundation is stable

- Baseline approval and rollback to a previous baseline.
- Policy overrides with owner, reason, scope, and expiration date.
- Scheduled main-branch scans and weekly health reports.
- Bundle treemap and duplicate dependency evidence.
- Scan retry and partial-result handling.
- CSV/JSON export for governance reviews.

### Deferred to Phase 3

- Merge blocking enabled by default.
- Full real-user monitoring and browser SDK attribution across all MFEs.
- Automated remediation pull requests.
- Multi-provider source control support.
- Enterprise SSO, billing, and complex organization tenancy.

## Recommended architecture

```text
GitHub pull request / scheduled workflow
            |
            v
   Pulseboard collector CLI
   - base and head builds
   - bundle + dependency evidence
   - Lighthouse route checks
   - configured API probes
            |
            v
   Signed ingestion API
   - schema validation
   - idempotency
   - evidence normalization
            |
            +--------------------+
            |                    |
            v                    v
      PostgreSQL           Policy engine
      history + state      thresholds + regressions
            |                    |
            +---------+----------+
                      v
             Pulseboard web app
                      |
                      v
              GitHub advisory Check
```

### Repository shape

```text
app/                         Next.js product UI and API routes
packages/contracts/          Versioned event and API contracts
packages/collector/          CI-friendly measurement CLI
packages/policy-engine/      Deterministic evaluation rules
packages/github/             Check-run and pull-request adapters
packages/test-fixtures/      Contract and policy fixtures
```

The first collector should run inside each source repository's GitHub Actions workflow. This avoids operating a separate build farm during the pilot and ensures it uses the same install and build context as the MFE. Pulseboard receives normalized evidence rather than arbitrary source code.

## Core data model

| Entity | Purpose |
| --- | --- |
| `Organization` | Governance boundary and retention settings |
| `Mfe` | Name, repository, routes, owner, framework, and lifecycle state |
| `PolicySet` | Versioned budgets and regression thresholds |
| `Release` | Commit, branch, version, environment, deployment, and timestamp |
| `Scan` | Collector run, status, trigger, evidence completeness, and duration |
| `Measurement` | Metric name, value, unit, source, route, percentile, and time window |
| `Artifact` | Bundle, dependency, Lighthouse, and probe evidence metadata |
| `Finding` | Explainable policy outcome and ownership |
| `PrEvaluation` | Base/head comparison and advisory conclusion |
| `Override` | Temporary exception with approver, reason, and expiry |

Large raw artifacts should stay outside relational rows. Store only metadata and a content-addressed reference in PostgreSQL; use GitHub artifacts or object storage for the underlying file when retention is required.

## Measurement and policy rules

- Keep lab, build, synthetic API, and future real-user measurements as distinct evidence sources.
- Evaluate both absolute budgets and regressions against the base or approved production baseline.
- Return `insufficient_evidence` instead of passing when required data is missing or stale.
- Record the collector and policy versions used for every evaluation.
- Start with warning-only decisions for the pilot; a critical finding is visible but does not block the merge.
- Require a minimum sample count and configured variance allowance before evaluating noisy measurements.

## Delivery plan

### Milestone 1 — contracts and registry

- Extract Phase 1 mock types into versioned contracts.
- Define registry, scan, measurement, finding, and PR evaluation schemas.
- Add registry and application detail APIs.
- Build the first PostgreSQL migration and seed the current six MFEs.
- Replace hard-coded ownership and routes with registry data.

**Exit criteria:** the dashboard renders the six MFEs from persisted registry and seeded measurement records; contract fixtures pass in CI.

### Milestone 2 — collector and ingestion

- Build the collector CLI with manifest, dependency, and bundle adapters.
- Add Lighthouse route collection and configured API probes.
- Add signed, idempotent ingestion and scan lifecycle endpoints.
- Publish a reusable GitHub Actions workflow for pilot repositories.
- Surface scan progress, failures, and evidence completeness.

**Exit criteria:** three pilot MFEs can submit repeatable scans for a commit, and rerunning the same scan does not duplicate data.

### Milestone 3 — policies and PR comparison

- Implement deterministic absolute-budget and regression rules.
- Compare base and head scans using the same collector configuration.
- Add insufficient-evidence and expired-baseline outcomes.
- Create PR evaluation detail UI with findings and evidence links.
- Publish an advisory GitHub Check.

**Exit criteria:** a pilot PR receives an explainable advisory decision within ten minutes, including base/head values and a deep link to Pulseboard.

### Milestone 4 — history, operations, and pilot hardening

- Add application and metric history views.
- Add baseline approval, policy override, and audit history.
- Add scheduled scans, retry handling, and stale-data indicators.
- Add service telemetry, security review, retention, and backup procedures.
- Run a two-week pilot and tune policies from observed variance.

**Exit criteria:** engineering leads can make a release decision from Pulseboard without inspecting raw CI logs, and the team has documented evidence for whether merge blocking is safe to consider in Phase 3.

## Suggested timeline

| Sprint | Focus | Demonstrable result |
| --- | --- | --- |
| 1 | Contracts, database, registry | Persisted MFE catalog and seeded history |
| 2 | Collector and ingestion | Real bundle/dependency scans from one pilot MFE |
| 3 | Synthetic/UI/API evidence | Repeatable route and journey measurements for three MFEs |
| 4 | Policy engine and GitHub Check | Advisory base/head decision on pull requests |
| 5 | Trends, overrides, hardening | Two-week pilot ready for engineering teams |

Assumption: two engineers plus part-time platform/security support. With one engineer, keep the milestones but expect approximately eight to ten weeks.

## Phase 2 success measures

- At least three pilot MFEs onboarded with named owners and approved budgets.
- At least 95% of valid scans finish within ten minutes.
- Every displayed score can be traced to measurements, thresholds, source, commit, and collector version.
- Duplicate submissions are idempotent and do not change an existing completed scan.
- Production dependency and bundle measurements are within 5% of independently verified build output.
- A failed or incomplete collector never produces a false pass.
- GitHub Check delivery succeeds for at least 99% of completed PR evaluations.
- Pilot users can identify the owning team and primary regression from a PR report in under two minutes.

## Security and operational guardrails

- Use a GitHub App with least-privilege access to checks, pull requests, and repository metadata.
- Use short-lived installation tokens; never store repository access tokens in scan payloads.
- Sign ingestion requests and scope credentials to an organization or repository.
- Validate payload size, schema version, commit identity, and artifact hashes.
- Sanitize stored URLs, branch names, package names, and collector logs before rendering.
- Keep policy changes, baseline approvals, and overrides in an immutable audit trail.
- Default retention to 90 days for detailed measurements and one year for weekly aggregates during the pilot.

## Decisions to confirm before Milestone 1

1. **Pilot repositories:** recommended default is Bedrock Shell, Catalog, and Checkout because they cover composition, discovery, and a business-critical journey.
2. **Repository topology:** confirm whether the ecommerce MFEs live in one monorepo or independent repositories; the collector supports both, but workflow configuration differs.
3. **PostgreSQL provider:** recommended default is a managed PostgreSQL instance connected to Vercel, while keeping the application provider-neutral.
4. **GitHub ownership:** identify the GitHub organization and account that will own the GitHub App.
5. **API probes:** choose two or three non-destructive endpoints or journeys per pilot MFE and provide safe test credentials where needed.
6. **Policy ownership:** nominate one engineering lead to approve initial budgets and all temporary overrides.

## First implementation slice

The first pull request should create `packages/contracts`, add the registry and scan schemas with fixtures, introduce PostgreSQL migrations for `Mfe`, `Release`, `Scan`, and `Measurement`, and render the existing portfolio from an API-backed repository interface. Seed data may still come from the current mock dataset, but the UI must no longer import it directly.
