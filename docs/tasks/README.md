# Pulseboard Phase 2 — Active Development Tasks

These tasks define the first implementation sequence for moving Pulseboard from a mock-data prototype to a persisted application registry with a real **Connect Application** workflow.

## Execution rule

Each task should normally be implemented in its own Codex thread and produce one reviewable change set.

Before implementation, Codex must read:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. the selected task file
4. only the additional docs referenced by that task

The repository—not previous chat history—is the source of truth.

## Current sequence

```text
PB-001 Phase 2 Repository Foundation
        ↓
PB-002 Database Foundation
        ↓
PB-003 Application Registry Domain
        ↓
PB-004 Application Registry API
        ↓
PB-005 Connect Application UI
        ↓
PB-006 Application Detail
        ↓
PB-007 Persist the Six Existing Portfolio Applications
```

## Parallelization

Do not parallelize tasks whose domain contracts are still being defined.

After PB-003 stabilizes the `Application` domain model, PB-004 and selected UI preparation work may proceed separately if they do not independently redefine the same contract.

## Task sizing rule

A task should have one primary responsibility and should be reviewable without understanding several unrelated subsystems.

Prefer:

- "Implement Application Registry API"

over:

- "Build registry, collector, policies, GitHub integration, and dashboard"

Future phases should continue this pattern.
