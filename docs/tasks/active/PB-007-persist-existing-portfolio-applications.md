# PB-007 — Persist the Six Existing Portfolio Applications

## Objective

Move the six existing Pulseboard portfolio applications from primary hardcoded/mock registry data into persisted Application Registry records.

## Why

This is the Phase 1 → Phase 2 transition point for portfolio identity.

After this task, Pulseboard's primary application list should represent real persisted registry records rather than directly imported mock application arrays.

The six current applications are:

- Bedrock Shell
- Catalog
- Product Information / PIP
- Cart
- Checkout
- Phygital

## Dependencies

- PB-003 — Application Registry Domain
- PB-004 — Application Registry API
- PB-006 — Application Detail

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- Existing Phase 1 mock dataset
- PB-003 registry model

## In scope

- Create an idempotent seed mechanism for the six current applications.
- Map existing known identity/ownership/configuration fields into the registry.
- Update the portfolio application list/table to read primary application identity from persisted registry data.
- Update navigation/detail links to use persisted application IDs or stable identifiers.
- Keep existing Phase 1 health/demo metrics available only where clearly identified as prototype/demo data.
- Remove direct mock-array dependency for primary application registry identity.

## Out of scope

Do **not**:

- pretend existing mock health metrics are real scans;
- create fake Releases, Scans, Measurements, Findings, or Baselines to preserve the UI;
- connect GitHub repositories;
- run collectors;
- evaluate real policies;
- delete all Phase 1 demo data if some UI still needs it temporarily.

This task migrates **application identity/configuration**, not measurement truth.

## Functional requirements

1. All six applications exist as persisted registry records.
2. Seeding can run repeatedly without creating duplicates.
3. The main portfolio application list obtains application identity from persisted state.
4. Application detail routes use persisted records.
5. Prototype metrics are visually/data-model-wise distinguishable from persisted registry facts.
6. No UI claims that mock metrics are collected evidence.

## Architecture constraints

- Do not create fake scan history to satisfy existing UI components.
- If the current dashboard requires mock health metrics, adapt the presentation layer to combine:
  - persisted application identity;
  - explicitly labeled prototype/demo metric data.
- The migration should make later removal of remaining mock metric data straightforward.

## Seed guidance

Use stable repository/configuration values only when they are actually known from project context.

If a field is unknown, use a deliberate nullable/unknown value instead of inventing a production fact.

## Acceptance criteria

- [ ] Bedrock Shell is persisted.
- [ ] Catalog is persisted.
- [ ] Product Information / PIP is persisted.
- [ ] Cart is persisted.
- [ ] Checkout is persisted.
- [ ] Phygital is persisted.
- [ ] Seed operation is idempotent.
- [ ] Main application list reads registry identity from persisted records.
- [ ] Detail pages read persisted application records.
- [ ] No real-scan claim is made for Phase 1 mock health data.
- [ ] The primary application dataset is no longer imported directly from a mock array.

## Tests

At minimum cover:

- first seed;
- repeated seed;
- expected six records;
- stable IDs/uniqueness behavior;
- portfolio list loading persisted records.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If a database seed command is introduced, run it against the task's test/development environment and report the result.

## Definition of done

Pulseboard is now a persisted application registry rather than a UI whose application identities are defined by hardcoded arrays.

The next major development stream can begin: versioned evidence contracts and collector integration.

## Completion report

Include:

- seed strategy;
- data migrated;
- mock data still remaining and why;
- main UI queries changed;
- tests;
- validation results;
- any unknown portfolio metadata intentionally left blank.
