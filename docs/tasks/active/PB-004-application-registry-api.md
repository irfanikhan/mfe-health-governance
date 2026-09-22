# PB-004 — Application Registry API

## Objective

Expose the persisted Application Registry through validated server-side APIs for the Pulseboard web application.

## Why

The Connect Application flow and application detail pages need a stable server boundary. UI code must not access the database directly.

## Dependencies

- PB-003 — Application Registry Domain

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- PB-003 domain/repository implementation
- Any API conventions already established in the repository

## In scope

Implement APIs for the current UI needs:

- create application;
- list applications;
- get application by ID;
- update application.

Validate request data at the API boundary.

Return stable API response DTOs rather than raw database rows.

Use the Application repository/data-access abstraction introduced by PB-003.

Provide clear validation and not-found behavior.

## Out of scope

Do **not** implement:

- delete application unless explicitly required by current UI;
- GitHub repository verification;
- GitHub App installation;
- collector configuration;
- scans;
- policies;
- authentication/authorization beyond any existing repository-wide mechanism;
- public URL scanning.

Do not let route handlers contain business logic that belongs in domain/application services.

## Functional requirements

1. A valid application can be created.
2. Applications can be listed.
3. A single application can be retrieved by ID.
4. Supported fields can be updated.
5. Invalid payloads produce an explicit client error.
6. Unknown IDs produce a not-found response.
7. Internal database details are not leaked to clients.

## Architecture constraints

- Validate external input before it reaches persistence.
- Route handlers should orchestrate, not contain domain rules.
- Preserve a future path for authorization checks.
- API response shape should be deliberate and versionable.

## Suggested routes

Adapt to current Next.js conventions.

```text
POST  /api/applications
GET   /api/applications
GET   /api/applications/:id
PATCH /api/applications/:id
```

## Acceptance criteria

- [ ] Create/list/get/update endpoints work against persisted data.
- [ ] Input validation covers all current registry fields.
- [ ] Errors have a consistent shape.
- [ ] Database rows are not returned blindly.
- [ ] API tests cover success and failure paths.
- [ ] Existing dashboard functionality does not regress.

## Tests

At minimum cover:

- successful create;
- invalid architecture;
- invalid/malformed repository data;
- list response;
- get existing/non-existing ID;
- update valid field;
- update validation failure.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Definition of done

PB-005 can implement Connect Application entirely through the API boundary without direct database access.

## Completion report

Include:

- routes added;
- DTO/contracts added;
- validation strategy;
- test coverage;
- validation results;
- unresolved API-versioning concerns.
