# Pulseboard Architecture

## 1. Purpose

Pulseboard is an engineering-governance platform for microfrontend and web application ecosystems.

Its job is to turn engineering evidence into explainable release guidance.

Pulseboard should help engineering leads, architects, and managers answer questions such as:

- Which applications or MFEs are healthy, degrading, or critical?
- Did a pull request introduce a measurable regression?
- Did JavaScript bundle size increase?
- Which dependencies contribute to shipped or installed footprint?
- Are multiple versions of the same dependency present?
- How long does an MFE take to load, initialize, and mount?
- Which routes have poor performance?
- Which backend APIs are slowing a customer journey?
- Who owns the affected application, route, or finding?
- Is the available evidence recent, comparable, and reliable enough to make a decision?
- Should a pull request receive a healthy, warning, critical, or insufficient-evidence advisory?

Pulseboard is not intended to replace general-purpose monitoring platforms. Its distinguishing responsibility is governance:

```text
measurement
    ↓
evidence quality
    ↓
baseline
    ↓
policy
    ↓
finding
    ↓
advisory decision
```

Every important decision should be traceable back through this chain.

---

## 2. Current product stage

### Phase 1

Phase 1 is an interactive prototype using realistic mock data.

It validates:

- information architecture;
- portfolio-level reporting;
- application/MFE health views;
- PR governance concepts;
- bundle and dependency reporting;
- explainable findings;
- overall visual direction.

Phase 1 does not provide authoritative measurements.

### Phase 2

Phase 2 converts Pulseboard into a working pilot.

Phase 2 must:

1. register real applications and ownership;
2. collect repeatable evidence from real builds and controlled runtime checks;
3. persist scan and measurement history;
4. compare PR head evidence against appropriate baselines;
5. evaluate deterministic governance policies;
6. publish advisory results to GitHub;
7. expose enough evidence for an engineering lead to understand a result without reading raw CI logs.

Phase 2 remains advisory. Merge blocking is out of scope until baselines and measurement variance are understood.

---

## 3. Product scope

### In scope for Phase 2

- application registry;
- ownership and route metadata;
- MFE and monolith support;
- build evidence;
- dependency evidence;
- lab performance evidence;
- synthetic runtime/API evidence where explicitly configured;
- scan persistence;
- evidence freshness and quality;
- PR base/head comparison;
- approved production baselines;
- deterministic policies;
- GitHub advisory checks;
- history;
- overrides;
- auditability;
- Pulseboard's own operational telemetry.

### Explicitly out of scope unless a later task changes this

- public URL-only scanning as the primary onboarding model;
- arbitrary website scanning;
- merge blocking;
- automatic code changes in governed repositories;
- unrestricted source-code ingestion;
- production data mutation for synthetic probes;
- treating Lighthouse lab data as real-user field data;
- AI-based policy decisions;
- full production RUM platform.

---

## 4. Root domain concept: Application

`Application` is the root governed entity.

Current architecture types:

```ts
type ApplicationArchitecture =
  | "mfe-host"
  | "mfe-remote"
  | "monolith";
```

This keeps the platform useful beyond microfrontends while preserving MFE-specific capabilities.

An application may contain or reference:

- name;
- repository identity;
- workspace path for monorepos;
- architecture type;
- framework;
- bundler;
- owning team;
- lifecycle state;
- runtime environments;
- routes;
- MFE relationships;
- applicable policy set;
- latest approved baseline.

### MFE relationships

Pulseboard should be able to model relationships such as:

```text
Bedrock Shell
├── Catalog
├── Product Information
├── Cart
├── Checkout
└── Phygital
```

This relationship model will later support shared-runtime and cross-MFE impact analysis.

---

## 5. Application onboarding

Phase 2 uses **Connect Application**.

There is no URL-only quick-scan flow in the current product scope.

The conceptual onboarding lifecycle is:

```text
Registered
    ↓
Repository Connected
    ↓
Collector Configured
    ↓
First Scan Received
    ↓
Baseline Established
    ↓
Governed
```

Initial registration should capture application identity and configuration before GitHub integration or collector execution is required.

Example configuration:

```yaml
name: Catalog
architecture: mfe-remote

repository:
  owner: company
  name: catalog
  workspacePath: null

ownership:
  team: Catalog Experience

build:
  bundler: vite
  command: npm run build

runtime:
  productionUrl: https://shop.example.com
  routes:
    - /search
    - /category/:slug
```

Repository verification, GitHub App installation, collector setup, first scan, and baseline establishment should remain separate steps.

---

## 6. High-level system architecture

```text
                   Governed Repository
                         │
                  GitHub Actions
                         │
                Pulseboard Collector
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   build evidence   dependency data   lab/synthetic
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                authenticated ingestion
                         │
                         ▼
                  normalization layer
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
           persistence       background work
                │                 │
                │          policy evaluation
                │          aggregation
                │          GitHub publishing
                │                 │
                └────────┬────────┘
                         ▼
                  Pulseboard APIs
                         │
                         ▼
                    Dashboard
```

The collector runs in the governed repository's CI environment during the pilot.

Pulseboard receives normalized evidence rather than arbitrary source code.

---

## 7. Repository architecture

Target Phase 2 structure:

```text
apps/
  web/
    Next.js application, dashboard, application routes, and API boundaries

packages/
  contracts/
    Versioned external and internal schemas

  db/
    Database schema, migrations, repositories, and persistence utilities

  collector/
    CI-friendly evidence collector

  policy-engine/
    Deterministic policy evaluation

  github/
    GitHub App, webhook, Check Run, and installation adapters

  observability/
    Logging, tracing, metrics, and correlation helpers

  test-fixtures/
    Shared contract, collector, and policy fixtures

  config/
    Shared TypeScript, lint, and build configuration
```

The existing application may migrate toward this structure incrementally. A task must not perform a repository-wide restructure unless that restructure is explicitly in scope.

---

## 8. Architectural dependency direction

Preferred dependency direction:

```text
presentation
    ↓
application services
    ↓
domain / contracts
    ↓
repositories / adapters
    ↓
external systems
```

Important constraints:

- React UI must not contain policy rules.
- The policy engine must not depend on React.
- The policy engine must not depend on Webpack or Vite data structures.
- The policy engine must not depend directly on GitHub APIs.
- Collectors must normalize bundler-specific data into versioned Pulseboard contracts.
- Database models must not become the public ingestion contract.
- GitHub payload models must not leak into core domain policy logic.

---

## 9. Evidence classes

Pulseboard treats evidence classes separately.

```ts
type EvidenceClass =
  | "build"
  | "lab"
  | "synthetic"
  | "field";
```

### Build evidence

Examples:

- emitted JavaScript bytes;
- entry/chunk sizes;
- module attribution;
- installed dependency versions;
- emitted dependency versions;
- duplicate dependency versions;
- build duration.

Build evidence is generally deterministic relative to the same source, lockfile, build configuration, and toolchain.

### Lab evidence

Examples:

- Lighthouse LCP;
- Lighthouse CLS;
- Lighthouse TBT;
- scripted lab interaction metrics.

Lab evidence is controlled but variable. It must include its execution profile and sample information.

### Synthetic evidence

Examples:

- configured API probes;
- remote entry availability;
- MFE load/initialize/mount timings;
- controlled user journeys.

Synthetic evidence must not be presented as real-user telemetry.

### Field evidence

Examples:

- real-user LCP;
- real-user INP;
- real-user CLS;
- production remote-loading failure rates.

Field/RUM evidence is not a Phase 2 requirement.

### Measurement separation rule

Never silently combine evidence classes under one metric label.

For example:

```text
lab LCP != field LCP
synthetic API latency != production server tracing
installed dependency footprint != shipped JavaScript footprint
```

---

## 10. Measurement model

A measurement should carry enough context to remain interpretable later.

Conceptually:

```ts
interface Measurement {
  id: string;
  scanId: string;

  metric: string;
  value: number;
  unit: string;

  evidenceClass: EvidenceClass;
  source: string;

  applicationId: string;
  route?: string;
  environment: string;

  commitSha: string;
  releaseId?: string;

  percentile?: string;
  sampleCount?: number;
  timeWindow?: {
    start: string;
    end: string;
  };

  measurementProfileId?: string;

  collectedAt: string;
}
```

Exact schemas belong in `packages/contracts`.

---

## 11. Measurement profiles and comparability

Performance numbers are only meaningful when compared under sufficiently equivalent conditions.

A `MeasurementProfile` should describe relevant execution conditions such as:

- collector version;
- Node.js version;
- browser version;
- Lighthouse version;
- build mode;
- viewport;
- CPU/network throttling;
- environment;
- route configuration;
- authentication/test-data profile.

PR regressions should not be treated as authoritative if base and head evidence are materially incompatible.

Incompatible evidence should result in insufficient evidence rather than a false pass.

---

## 12. Collector architecture

The collector is a CI-friendly CLI/package executed in the governed application's repository.

Responsibilities:

- identify repository and commit metadata;
- invoke or inspect the application's configured build;
- collect bundle evidence;
- collect dependency evidence;
- run configured lab checks;
- run configured non-destructive synthetic probes;
- validate collected evidence;
- submit normalized scan evidence.

The collector is adapter-based.

Conceptual interfaces:

```ts
interface BuildAdapter {
  detect(context: RepositoryContext): Promise<boolean>;
  collect(context: BuildContext): Promise<BundleEvidence>;
}

interface DependencyAdapter {
  collect(context: RepositoryContext): Promise<DependencyEvidence>;
}

interface LabPerformanceAdapter {
  run(target: PerformanceTarget): Promise<LabEvidence>;
}

interface ApiProbeAdapter {
  run(probe: ApiProbeDefinition): Promise<ApiEvidence>;
}
```

Bundler-specific structures must be normalized before leaving the collector boundary.

### Webpack

Prefer Webpack-native build/statistics data as the canonical evidence source.

### Vite

Prefer Vite plugin/build output metadata as the canonical evidence source.

Cross-bundler visualization tools may be used as diagnostics but should not define the core evidence contract.

---

## 13. Dependency governance

Pulseboard should distinguish at least these concepts:

```text
installed dependency footprint
bundled/emitted dependency footprint
runtime-shared dependency configuration
observed runtime dependency behavior (later)
```

Installed packages are not automatically equivalent to JavaScript shipped to customers.

For Module Federation applications, shared dependency configuration must be modeled separately from the package manager's installed graph.

---

## 14. Runtime and MFE timing

MFE load/mount timing should use explicit instrumentation rather than vague page-level timing.

Example:

```ts
performance.mark("pulseboard:catalog:mount:start");

// mount application

performance.mark("pulseboard:catalog:mount:end");

performance.measure(
  "pulseboard:catalog:mount",
  "pulseboard:catalog:mount:start",
  "pulseboard:catalog:mount:end",
);
```

Where possible, distinguish:

```text
remote fetch
remote initialization
framework bootstrap
MFE mount
meaningful application render
```

Do not collapse all of these into one measurement unless the metric contract explicitly defines that behavior.

---

## 15. Ingestion architecture

The ingestion boundary should remain intentionally small.

Conceptual request flow:

```text
authenticate
    ↓
validate contract/schema version
    ↓
validate payload limits
    ↓
validate repository/run identity
    ↓
apply replay/idempotency checks
    ↓
persist scan envelope
    ↓
schedule downstream processing
    ↓
return accepted result
```

Ingestion should not synchronously perform all policy evaluation, reporting, history aggregation, and GitHub publishing.

### Trust boundary

Treat collector input as untrusted until:

- authentication succeeds;
- schema validation succeeds;
- repository/run identity is accepted;
- payload size/count constraints pass;
- idempotency/replay requirements pass.

---

## 16. Scan state model

A scan should represent its lifecycle explicitly.

Example:

```ts
type ScanStatus =
  | "received"
  | "processing"
  | "completed"
  | "partial"
  | "failed";
```

A partial or failed scan must be distinguishable from a completed scan.

The UI must not infer health from absence of evidence.

---

## 17. Evidence quality

Evidence quality is a first-class domain concern.

Examples of reasons evidence may be unsuitable:

- required metric missing;
- insufficient samples;
- stale production baseline;
- incompatible measurement profile;
- collector failure;
- partial scan;
- excessive variance;
- invalid artifact hash;
- unsupported toolchain.

These conditions must be available to policy evaluation and visible to users.

---

## 18. Policy engine

The policy engine is deterministic.

Inputs:

```text
normalized evidence
baseline(s)
policy set
evidence quality
evaluation context
```

Outputs:

```text
findings
advisory status
explanation
```

Current evaluation statuses:

```ts
type EvaluationStatus =
  | "healthy"
  | "needs_attention"
  | "critical"
  | "insufficient_evidence";
```

General precedence:

```text
known critical violation
    → critical

otherwise required evidence missing/unreliable
    → insufficient_evidence

otherwise warning-level finding
    → needs_attention

otherwise
    → healthy
```

A known critical violation should not disappear merely because unrelated evidence is missing. Findings should retain per-rule evidence quality.

### Advisory-only rule

During Phase 2, evaluation outcomes are advisory. A critical Pulseboard result must not automatically become a required merge-blocking status unless a later architecture decision explicitly enables that behavior.

---

## 19. Policy versioning

Policy configuration must be versioned and reproducible.

An evaluation should store or reference:

- policy set ID;
- policy version;
- immutable policy content hash;
- policy-engine version.

Policy changes must not retroactively alter the historical meaning of previously completed evaluations.

Application teams should not be able to silently weaken central governance policy in the same PR being evaluated.

Temporary exceptions belong in explicit overrides.

---

## 20. Baselines

Phase 2 uses two baseline concepts.

### PR base baseline

Answers:

> What did this change introduce?

Prefer an exact base/merge-base build when practical.

### Approved production baseline

Answers:

> Is this application healthy relative to the currently approved production state?

Both may be evaluated.

Example:

```text
base → head regression: healthy
absolute production budget: critical
```

is a valid outcome.

### Baseline requirements

A baseline should record:

- application;
- commit;
- environment;
- measurement profile;
- approval state;
- creation/approval time;
- evidence freshness;
- applicable metric set.

Stale or incompatible baselines must not produce false confidence.

---

## 21. Pull-request evaluation

A PR evaluation should connect:

```text
PR
├── base scan
├── head scan
├── approved production baseline
├── policy set
├── evidence quality
└── findings
```

Every finding should be able to answer:

```text
what changed?
where?
base value?
head value?
absolute threshold?
regression threshold?
which evidence source?
which commit?
which collector version?
which policy version?
which owner?
how fresh/reliable is the evidence?
```

---

## 22. GitHub integration

GitHub integration has two different responsibilities:

### Collector identity

The collector should use short-lived repository/workflow identity where possible rather than distributing long-lived shared ingestion secrets.

### GitHub App

The GitHub App is responsible for repository/PR integration and advisory Check publishing.

The app should be organization-owned for a real pilot and use least privilege.

Do not broaden permissions simply to simplify implementation.

GitHub-specific logic belongs behind adapters in `packages/github`.

---

## 23. Background processing

Downstream processing should be asynchronous where failure/retry is expected.

Typical asynchronous work:

- evidence normalization after acceptance;
- policy evaluation;
- history aggregation;
- GitHub Check publishing;
- scheduled reports;
- retry handling;
- retention cleanup.

Workers/consumers must be idempotent.

The specific queue/provider is an infrastructure decision and should remain behind an abstraction where practical.

---

## 24. Artifact storage

Large raw artifacts should not be stored directly in relational rows.

PostgreSQL stores:

- metadata;
- hashes;
- content-addressed references;
- retention metadata.

Phase 2 may retain raw reports in CI artifact storage initially.

If centralized object storage is later introduced, the relational model should not need to change materially.

---

## 25. Persistence model

Core entities:

```text
Organization
Application
ApplicationRelationship
Team / Ownership
PolicySet
Release
Scan
MeasurementProfile
Measurement
Artifact
EvidenceQuality
Finding
PrEvaluation
Baseline
Override
AuditEvent
GitHubInstallation
OutboxEvent
```

Exact table layout is owned by the database design/ADR, but these domain concepts should remain recognizable.

### Immutability principle

Historical measurements and completed evaluations should be treated as immutable evidence.

If normalization or policy logic changes, create a new processing/evaluation version rather than rewriting history silently.

---

## 26. Authentication and authorization

Dashboard access requires authenticated users.

Initial authorization model should support roles such as:

```text
Viewer
Engineering Lead
Governance Admin
```

Authorization belongs in a centralized server-side boundary/data-access layer, not only in client-side UI checks.

Examples:

### Viewer

- read portfolio/application data;
- inspect scans and findings.

### Engineering Lead

- viewer capabilities;
- approve application baselines where authorized;
- manage application-level actions defined by policy.

### Governance Admin

- manage registry/governance configuration;
- manage policy sets;
- approve overrides;
- access governance audit functions.

Exact identity provider selection belongs in an ADR/task.

---

## 27. Security principles

Phase 2 must follow:

- least privilege;
- short-lived credentials where possible;
- strict schema validation;
- replay protection;
- idempotent ingestion;
- explicit payload limits;
- output encoding/sanitization;
- auditability for governance actions;
- expiring overrides;
- no arbitrary server-side URL fetching;
- no production data mutation from generic probes;
- no repository tokens inside evidence payloads.

The collector should run configured probes rather than instructing Pulseboard servers to fetch arbitrary user-controlled URLs.

This reduces SSRF risk.

---

## 28. Data minimization and privacy

Phase 2 should avoid collecting customer or end-user data.

Do not intentionally store:

- customer IDs;
- names;
- email addresses;
- authorization headers;
- cookies;
- request bodies;
- response bodies;
- production query strings containing user data;
- IP addresses unless explicitly required and reviewed.

Prefer normalized route templates such as:

```text
/products/:id
```

over full customer-specific URLs.

Real-user telemetry requires a separate privacy and data-governance review before becoming part of the platform.

---

## 29. Observability for Pulseboard

Pulseboard must instrument itself.

Important operational signals include:

### Ingestion

- request count;
- authentication rejection count;
- schema rejection count;
- duplicate submissions;
- payload sizes;
- latency.

### Collector

- scan duration;
- build duration;
- lab-test duration;
- failed adapters;
- partial scan rate.

### Background processing

- queue lag;
- retries;
- failures/dead jobs;
- processing duration.

### Policy engine

- evaluation duration;
- findings by severity;
- insufficient-evidence rate;
- override rate.

### GitHub

- Check publish success/failure;
- publish latency;
- API errors/rate limiting.

### Persistence

- query latency;
- connection errors;
- transaction retries.

Use correlation identifiers such as:

```text
organizationId
applicationId
scanId
evaluationId
repositoryId
githubRunId
commitSha
```

---

## 30. Deployment model

Current application hosting target is Vercel.

Conceptually:

```text
Vercel
├── Next.js web/API application
├── background consumers/jobs
└── observability integration

PostgreSQL
└── application/governance state

GitHub
├── governed repositories
├── GitHub Actions collectors
├── raw CI artifacts
└── GitHub App / advisory checks
```

The specific PostgreSQL provider, ORM, background provider, and authentication provider should be recorded in ADRs before they become hard dependencies.

---

## 31. Current architecture decisions

Accepted product/architecture direction:

1. Pulseboard is governance-first, not monitoring-first.
2. `Application` is the root domain concept.
3. MFE host, MFE remote, and monolith are supported architecture types.
4. Phase 2 uses Connect Application rather than URL-only scanning.
5. The collector runs inside governed repository CI during the pilot.
6. Build, lab, synthetic, and field evidence remain distinct.
7. Phase 2 policies are advisory.
8. Missing/unreliable required evidence can produce `insufficient_evidence`.
9. Policy evaluation is deterministic.
10. PR regression and approved-production baselines are separate concepts.
11. Normalized evidence crosses the collector → Pulseboard boundary.
12. Historical evidence must remain explainable and attributable.

---

## 32. Decisions requiring ADRs

Before implementation depends on them, record decisions for:

- repository/monorepo tooling;
- PostgreSQL provider;
- ORM/query layer;
- authentication provider;
- ingestion authentication mechanism;
- queue/background processing provider;
- raw artifact storage;
- GitHub App ownership and permissions;
- policy configuration storage/versioning;
- baseline approval rules;
- retention defaults;
- observability backend.

An ADR should contain:

```text
Context
Decision
Alternatives considered
Consequences
Risks
Migration/reversal strategy
Status
```

---

## 33. Phase 2 implementation sequence

Recommended capability order:

```text
Repository/agent foundation
        ↓
Application Registry
        ↓
Connect Application
        ↓
Versioned contracts
        ↓
Collector foundation
        ↓
Build/dependency adapters
        ↓
Authenticated ingestion
        ↓
Scan persistence
        ↓
Lab/synthetic evidence
        ↓
Evidence quality
        ↓
Policy engine
        ↓
Baselines
        ↓
PR evaluation
        ↓
GitHub advisory Check
        ↓
History / overrides / audit
        ↓
Pilot hardening
```

Do not start multiple implementations of the same domain contract before that contract is agreed and versioned.

---

## 34. Architecture quality test

A Pulseboard feature is architecturally aligned when an engineering lead can eventually answer:

```text
WHAT happened?
WHERE did it happen?
WHEN did it happen?
WHICH commit/release produced it?
HOW was it measured?
HOW reliable/fresh is that evidence?
WHAT baseline was used?
WHICH policy was evaluated?
WHY did the policy produce this finding?
WHO owns the affected area?
WHAT action should be investigated?
```

If a score or status cannot answer these questions, it should not be treated as authoritative governance evidence.
