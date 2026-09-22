# PB-005 — Connect Application UI

## Objective

Allow a user to register a real application in Pulseboard through a dedicated **Connect Application** flow.

## Why

Phase 2 onboarding begins by explicitly registering an application. Pulseboard is not using a Lighthouse-style public URL scan as its onboarding model.

This task creates the first user-facing Phase 2 workflow.

## Dependencies

- PB-004 — Application Registry API

## Read before implementation

- `AGENTS.md`
- `ARCHITECTURE.md`
- PB-004 API contract
- Existing Pulseboard visual system/components

## In scope

Create a user-facing Connect Application flow.

Fields:

- application name;
- architecture:
  - MFE Host
  - MFE Remote
  - Monolith
- repository owner;
- repository name;
- optional workspace path;
- owner team;
- framework;
- bundler;
- optional production URL;
- routes;
- lifecycle state if the current product requires user selection, otherwise default it intentionally.

Submit through the Application Registry API.

After successful creation, navigate to the registered application's detail/onboarding destination.

Show meaningful validation and API errors.

Preserve Pulseboard's established visual language and responsive behavior.

## Out of scope

Do **not** implement:

- Quick URL Scan;
- GitHub OAuth or GitHub App installation;
- repository existence verification;
- collector installation;
- first scan;
- Lighthouse execution;
- policies;
- baseline creation;
- automatic framework/bundler detection.

Do not silently turn free-form user inputs into trusted GitHub configuration.

## Functional requirements

1. User can open Connect Application from the appropriate application/dashboard entry point.
2. Required fields are clearly marked and validated.
3. Multiple routes can be entered.
4. Optional monorepo workspace path is supported.
5. Form submission calls the registry API.
6. API validation errors are understandable.
7. Duplicate/conflict errors are handled without losing entered form state where practical.
8. Successful creation transitions to the next application view.
9. UI works at desktop and mobile widths.

## Architecture constraints

- No direct database calls from React components.
- Reuse established UI components rather than duplicating patterns.
- Keep form/domain transformation logic testable.
- Do not encode future GitHub/collector behavior into this task.

## Suggested UX

Conceptually:

```text
Connect Application

Application
  Name
  Architecture

Repository
  Owner
  Repository
  Workspace path (optional)

Ownership
  Team

Technology
  Framework
  Bundler

Runtime
  Production URL (optional)
  Routes

[Connect Application]
```

The primary CTA is "Connect Application" or equivalent product language. It does not run a scan.

## Acceptance criteria

- [ ] Connect Application screen exists and is reachable.
- [ ] All in-scope fields are represented.
- [ ] Required field validation works.
- [ ] Multiple routes are supported.
- [ ] Successful submission persists through PB-004.
- [ ] Error states are visible and usable.
- [ ] Success navigation works.
- [ ] No URL-only scanning experience is introduced.
- [ ] Desktop and mobile layouts remain usable.
- [ ] Existing Phase 1 dashboard behavior is not regressed.

## Tests

At minimum cover:

- initial rendering;
- required-field validation;
- architecture selection;
- multiple routes;
- successful submission;
- server/API error;
- redirect/navigation on success.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Also manually verify the flow at desktop and mobile widths if the repository's test tooling does not cover responsive UI.

## Definition of done

A user can register a new application in persisted Pulseboard state without GitHub or collector setup.

## Completion report

Include:

- route/page added;
- components added/changed;
- form validation approach;
- API interaction;
- tests;
- desktop/mobile verification;
- remaining onboarding steps intentionally not implemented.
