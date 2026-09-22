# PB-003 — Application Registry Domain

## Objective

Define and persist the core `Application` domain model used by Pulseboard Phase 2.

## Why

`Application` is the root governed entity. Pulseboard must know what it governs before it can connect repositories, collect scans, establish baselines, or evaluate policies.

## Dependencies

- PB-002 — Database Foundation

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- Any data-model ADR accepted before this task.

## In scope

Define the minimum persistent domain model for an application, including:

- stable application ID;
- display name;
- architecture type;
- repository owner;
- repository name;
- optional workspace path;
- owning team;
- framework;
- bundler;
- optional production URL;
- lifecycle state;
- created/updated timestamps.

Support architecture types:

```ts
type ApplicationArchitecture =
  | "mfe-host"
  | "mfe-remote"
  | "monolith";
```

Add route metadata in a representation that supports multiple routes per application.

Introduce a repository/data-access abstraction for application persistence.

Add domain validation rules for fields owned by this task.

## Out of scope

Do **not** implement:

- HTTP API routes;
- Connect Application UI;
- GitHub repository verification;
- GitHub installation state;
- collector configuration;
- scans;
- policy sets;
- baselines;
- application-to-application MFE relationship UI;
- authentication/authorization.

Do not add fields only because they may be useful someday.

## Functional requirements

1. Applications can be created, retrieved, listed, and updated through the internal repository abstraction.
2. Architecture type is constrained to accepted values.
3. Repository identity is stored separately from display name.
4. Workspace path is optional to support both single-repo and monorepo applications.
5. Multiple routes can be associated with one application.
6. Lifecycle state is explicit.
7. Duplicate constraints are deliberate and documented.

## Architecture constraints

- Keep domain types separate from raw database row types where useful.
- Do not expose ORM models as external contracts.
- Avoid free-form JSON for stable first-class fields.
- Use explicit enums/unions for architecture and lifecycle concepts.
- Preserve room for future GitHub installation and scan relationships without implementing them now.

## Suggested domain shape

Conceptual only; adapt to established project conventions.

```ts
interface Application {
  id: string;
  name: string;
  architecture: "mfe-host" | "mfe-remote" | "monolith";

  repository: {
    owner: string;
    name: string;
    workspacePath?: string | null;
  };

  ownership: {
    team: string;
  };

  framework: string;
  bundler: "vite" | "webpack" | "other" | "unknown";

  productionUrl?: string | null;
  lifecycle: "active" | "experimental" | "deprecated";

  routes: ApplicationRoute[];

  createdAt: string;
  updatedAt: string;
}
```

## Acceptance criteria

- [ ] Database migrations for the Application Registry domain are present.
- [ ] Application architecture and lifecycle values are constrained.
- [ ] Repository identity and optional workspace path are persisted.
- [ ] Owner/team information is persisted.
- [ ] Multiple application routes are supported.
- [ ] Internal repository operations are tested.
- [ ] No HTTP/UI/GitHub behavior is implemented.
- [ ] Existing Phase 1 application still builds.

## Tests

At minimum cover:

- creating an MFE remote;
- creating a monolith;
- optional workspace path;
- multiple routes;
- invalid architecture/lifecycle values;
- repository uniqueness behavior;
- update/read/list repository operations.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Also run database migration/schema validation introduced by PB-002.

## Definition of done

The `Application` domain is stable enough for PB-004 to expose through an API without redefining its core shape.

## Completion report

Include:

- domain model;
- tables/migrations added;
- constraints/indexes;
- repository interface;
- assumptions;
- tests;
- validation results.
