# PB-006 — Application Detail and Onboarding State

## Objective

Create a persisted application detail view that clearly shows the registered application's configuration and its current onboarding state.

## Why

After registration, users need a stable destination representing the application before repository integration and scan ingestion exist.

The detail page becomes the future home for scans, baselines, findings, ownership, policies, and history.

## Dependencies

- PB-004 — Application Registry API
- PB-005 — Connect Application UI

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- Existing Phase 1 per-MFE detail UI
- PB-004 API contract

## In scope

Create/update the application detail route to load persisted application data.

Display:

- application name;
- architecture type;
- repository identity;
- workspace path when present;
- owner team;
- framework;
- bundler;
- production URL when present;
- routes;
- lifecycle state.

Represent the Phase 2 onboarding lifecycle:

```text
Registered
→ Repository Connected
→ Collector Configured
→ First Scan Received
→ Baseline Established
→ Governed
```

For this task, only `Registered` is expected to be real unless the repository already contains explicitly implemented later states.

Show future onboarding steps as pending, not as working functionality.

## Out of scope

Do **not** implement:

- GitHub installation;
- repository verification;
- collector setup;
- scan execution;
- scan history;
- policy evaluation;
- baselines;
- fake completion states.

Do not populate the page with fabricated real measurements.

## Functional requirements

1. A newly created application has a working detail page.
2. Data is loaded from the persisted Application Registry.
3. The current onboarding state is clearly visible.
4. Future steps are distinguishable from completed steps.
5. Missing optional fields render cleanly.
6. Unknown application IDs have a proper not-found experience.

## Architecture constraints

- Do not reintroduce direct mock-array lookup for the primary application identity.
- UI must distinguish persisted registry facts from future/unavailable evidence.
- The onboarding status model should be explicit enough to evolve later.

## Acceptance criteria

- [ ] Registered application detail route works.
- [ ] Primary identity/configuration comes from persisted data.
- [ ] `Registered` state is represented correctly.
- [ ] Future onboarding steps are shown only as pending/planned.
- [ ] No fake scan/health status is generated for newly connected apps.
- [ ] Not-found behavior works.
- [ ] Existing Phase 1 design language is preserved where useful.

## Tests

At minimum cover:

- loading an application;
- optional fields absent;
- application not found;
- onboarding state rendering.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Definition of done

PB-007 can migrate the existing six portfolio applications into persisted registry state and have each render through the same application detail mechanism.

## Completion report

Include:

- route changes;
- data-loading path;
- onboarding state representation;
- tests;
- validation results;
- any remaining mock-data dependency on the page.
