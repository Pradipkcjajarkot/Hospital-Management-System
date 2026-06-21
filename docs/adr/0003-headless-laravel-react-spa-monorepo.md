# ADR 0003: Headless Laravel API + React SPA Monorepo

**Status:** Accepted  
**Date:** June 21, 2026  
**Supersedes:** ADR 0001 (Monolithic Laravel Architecture)

## Context

The Hospital Management System requires a rich, responsive user interface across 20 admin modules and 14 public-facing features. The initial architecture (ADR 0001) chose monolithic Laravel with Blade templates. However, further analysis revealed:

- The admin panel requires complex interactive UI patterns (drag-and-drop calendars, real-time dashboards, rich text editors, multi-step forms) that are more naturally implemented as an SPA.
- A headless architecture provides a clear API contract that can serve both the web SPA and future mobile applications.
- Separate frontend and backend packages in a monorepo enable parallel development and specialized tooling per layer.
- The team has stronger React expertise for complex UI work.

## Decision

Adopt a **monorepo architecture** with:

1. **`packages/backend`** — Laravel application serving a RESTful JSON API with Sanctum authentication, Eloquent ORM, Spatie RBAC, queues, caching, and all business logic.
2. **`packages/frontend`** — React 18+ SPA (Vite + TypeScript) consuming the Laravel API, handling all UI rendering, client-side routing, and state management.

## Consequences

### Positive

- Clear separation of concerns: backend owns business logic, frontend owns UI.
- API layer enables future mobile app development without rebuilding backend.
- React SPA provides richer interactivity than Blade for complex workflows.
- Monorepo structure shares tooling configs and enables coordinated CI/CD.
- Frontend and backend can be developed and tested independently.

### Negative

- Increased initial setup complexity compared to monolithic Blade.
- Two build pipelines to maintain (PHP + Node.js).
- API versioning discipline required to avoid breaking frontend-backend coupling.
- SPA adds client-side routing complexity and SEO considerations (SSR may be needed later).

### Mitigations

- Monorepo scripts (`dev`, `build`, `test`, `lint`) at root level orchestrate both packages.
- API versioning via URL prefix (`/api/v1/`) from the start.
- SEO-critical public pages can use Laravel's Blade for initial render if needed, or add React SSR later.
- Testing at the API seam (HTTP tests) validates the contract between frontend and backend.

## Compliance

This decision supersedes ADR 0001. Existing ADR 0002 (MySQL Database Design) remains in effect.
