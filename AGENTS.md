# Pulseboard Agent Guide

## Mission

Build an explainable MFE governance system that helps engineering leaders make release decisions without hiding evidence behind an opaque score.

## Product principles

- Every health score must expose its contributing measurements, thresholds, environment, and time window.
- Attribute runtime signals to an MFE, release, route, owner, and commit whenever possible.
- Treat lab measurements and real-user measurements as separate evidence sources.
- Start with advisory policy outcomes; enable blocking only after baselines are stable.
- Prefer regressions against a known base over isolated absolute scores.

## Engineering rules

- Keep UI, collector, policy, and telemetry contracts independently testable.
- Use TypeScript for product and collector code.
- Preserve accessible keyboard behavior and responsive layouts.
- Do not introduce a datastore until a Phase 1 workflow requires durable records.
- Keep mock data clearly labeled until a real collector owns the measurement.
- Run `npm run build` and `npm test` before handing off changes.
