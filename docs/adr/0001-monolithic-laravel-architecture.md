# ADR 0001: Monolithic Laravel Architecture for Hospital Management System

## Status
Accepted

## Context
We need to build a comprehensive Hospital Management System with:
- Admin panel (20 modules)
- Public-facing website (14 feature areas)
- Content management system
- 8 re-engineered business workflows
- 11 user roles with RBAC

The alternatives considered were:
1. **Headless CMS** (Laravel API + separate frontend) — more flexible but doubles development effort
2. **Monolithic Laravel (Blade)** — single codebase, faster development, easier deployment
3. **Microservices** — each module as separate service — overkill for a single-hospital system

## Decision
Use **Monolithic Laravel architecture with Blade templating** for both admin and public panels.

Reasons:
- Single codebase to maintain — all 20 admin modules share the same models, migrations, and services
- Blade templating with layout inheritance provides reusable components
- Laravel's built-in authorization (Gates/Policies) maps naturally to the 11-role RBAC model
- Eloquent ORM handles the complex relational model (patients ↔ appointments ↔ doctors ↔ billing)
- Faster time-to-market — no need to build and maintain a separate API layer
- Sufficient for a single multi-speciality hospital (200+ beds) — not a hospital chain
- Laravel's queue system handles SMS/email notifications without external dependencies

## Consequences
Positive:
- Faster development and deployment
- Simpler testing (feature tests cover full stack)
- Easier maintenance for a single team
- Lower hosting costs (single server)

Negative:
- Cannot easily swap frontend technology later
- Public panel is coupled to the backend (cannot serve as a standalone static site)
- May need to split if the system grows into a hospital chain

## Alternatives considered
- **Headless**: Rejected because our public panel needs are well-defined and don't require a separate SPA
- **Microservices**: Rejected — operational complexity outweighs benefits for a single-hospital system
