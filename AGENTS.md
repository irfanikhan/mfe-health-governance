# Pulseboard Agent Guide

Pulseboard is an engineering-governance platform for microfrontend and web application ecosystems.

This file defines how coding agents should work in this repository. Product and architecture details belong in the referenced documentation, not in this file.

## Mission

Build an explainable governance system that helps engineering leaders make release decisions using trustworthy engineering evidence.

Pulseboard must not hide important decisions behind opaque scores.

## Read order

Before making changes:

1. Read `AGENTS.md`.
2. Read `ARCHITECTURE.md`.
3. Read the active task specification under `docs/tasks/active/`.
4. Read only the product, architecture, ADR, or contract documents referenced by that task.
5. Inspect the existing implementation before proposing or writing changes.

Do not assume previous chat history is available or authoritative. The repository is the source of truth.

## Non-negotiable product rules

1. Pulseboard is an engineering-governance platform, not a generic monitoring dashboard.
2. `Application` is the root governed domain concept.
3. An application may currently be:
   - `mfe-host`
   - `mfe-remote`
   - `monolith`
4. Phase 2 onboarding uses **Connect Application**. Do not add a public URL-only scan flow unless a task explicitly introduces it.
5. Every finding must be explainable through its underlying evidence.
6. Build, lab, synthetic, and field measurements are different evidence classes and must not be silently mixed.
7. Missing, stale, incompatible, or unreliable required evidence must never become a pass.
8. Phase 2 policy outcomes are advisory. Do not introduce merge blocking unless a future task explicitly changes this rule.
9. Prefer PR/base regressions and approved baselines over isolated scores when evaluating change.
10. Collector integrations submit normalized evidence and metadata. Pulseboard must not require arbitrary repository source code for normal scan ingestion.
11. Policy evaluation must be deterministic and reproducible.
12. Historical evidence must remain attributable to the commit, release, environment, collector version, policy version, route, and time window that produced it when applicable.

## Architectural boundaries

Keep these concerns separate:

- UI and presentation
- application registry and ownership
- contracts and validation
- collector logic
- ingestion
- persistence
- policy evaluation
- GitHub integration
- background processing
- observability

Do not place domain or policy logic inside React components.

Do not couple the policy engine to Vite, Webpack, GitHub, or database-specific representations. Normalize external evidence before policy evaluation.

Do not make one subsystem reach directly into another subsystem's internal storage or implementation details when a contract or repository abstraction exists.

## Development rules

- Use TypeScript strict mode.
- Avoid `any`. If unavoidable at an external boundary, narrow it immediately and document why.
- Validate all external input at trust boundaries.
- Prefer explicit domain types over loosely shaped objects.
- Keep functions small enough to test independently.
- Keep side effects at system boundaries.
- Add tests for domain behavior and regression-prone logic.
- Preserve backward compatibility for versioned contracts unless the task explicitly introduces a new version.
- Never silently weaken validation, authentication, policy thresholds, or evidence requirements to make tests pass.
- Never commit secrets, tokens, credentials, production payloads, or sensitive customer data.
- Avoid unrelated refactors while implementing a scoped task.
- Do not implement functionality outside the active task unless required to make the task correct; report such deviations explicitly.

## Task execution workflow

For every task:

1. Read the task's objective, dependencies, scope, out-of-scope section, and acceptance criteria.
2. Inspect affected code and existing tests.
3. Identify any architecture conflict before implementation.
4. Implement the smallest coherent change that satisfies the task.
5. Add or update tests.
6. Run relevant validation.
7. Review the diff for unintended changes.
8. Report completion status and remaining risks.

If the task conflicts with `ARCHITECTURE.md`, an accepted ADR, or a versioned contract, do not silently choose one. Surface the conflict in the completion report.

## Validation

Run the checks relevant to the changed area. The default repository validation target is:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If a command does not yet exist, do not invent a successful result. State that the check is unavailable.

Package-specific tasks may define additional required checks.

## Definition of done

A task is complete only when:

- the stated acceptance criteria are satisfied;
- relevant tests are present and passing;
- relevant validation has been run;
- no known critical regression was introduced;
- documentation/contracts are updated when the task changes them;
- scope deviations and unresolved risks are reported.

## Completion report

When finishing a task, report:

- summary of what changed;
- files added or modified;
- tests added or modified;
- validation commands run and their results;
- assumptions made;
- remaining risks or follow-up work;
- any deviation from the task scope.

Do not claim success for checks that were not run.
