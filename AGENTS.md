## Agent skills

### Issue tracker

Issues and PRDs live in GitHub Issues (`gh` CLI). External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` at repo root + `docs/adr/`. See `docs/agents/domain.md`.

## Anchored Summary

**Session**: Build out the Hospital Management System (Laravel + Vite + React)

### Goal
Build a full-featured HMS with backend/frontend for hospital administration, public website, and patient portal.

### Progress done
- **5 CRUD modules**: Beds & Wards, Laboratory, Pharmacy, Billing & Finance, Reports & Analytics — migrations, models, controllers, routes
- **3 management pages**: Users (roles/permissions), Settings (system config + email), Notifications (in-app + broadcast)
- **Public Website & Patient Portal (Phase 7 Backend)**: Migrations for `blog_posts`, `gallery_items`, `events`, `testimonials`; Models, admin CRUD controllers, `PublicController` with home/doctors/departments/blog/gallery/events/contact endpoints, public API routes
- **Public Website Frontend**: `PublicLayout` (sticky nav, footer, mobile menu), `HomePage` (hero, stats cards, departments grid, doctors grid, testimonials, blog preview, events preview, CTA), `DoctorDirectory` (search + department filter), `DepartmentPage`, `BlogList` (list + detail view), `GalleryPage` (grid + lightbox), `EventsPage` (upcoming/past), `ContactPage` (form + contact info)
- **Full Vite build**: 1853 modules, no errors

### Key decisions
- Monorepo → single Laravel app (backend + Vite-built React SPA)
- Session-based auth (default Laravel)
- React SPA for frontend, Blade only for entry point
- Public website routes are public (no auth), admin routes inside auth group
- CSRF exemption list in `bootstrap/app.php`
- PLAN.md drives phase progression

### Next steps
- Phase 8 — Patient Portal (dashboard, appointments, medical records, billing)
- Phase 9 — Testing & QA
- Phase 10 — Deployment

### Relevant files
- `routes/web.php` — all API routes (auth + public)
- `routes/web.php` — admin CRUD routes inside auth group
- `routes/web.php` — public routes outside auth group
- `app/Http/Controllers/` — all controllers
- `app/Models/` — all models
- `database/migrations/` — all migrations
- `resources/views/welcome.blade.php` — React SPA entry
- `resources/js/app.tsx` — root React component with all page routing
- `resources/js/components/PublicLayout.tsx` — public website shell
- `resources/js/components/HomePage.tsx` — landing page with hero, stats, sections
- `resources/js/components/DoctorDirectory.tsx` — doctor search + filter
- `resources/js/components/DepartmentPage.tsx` — departments grid
- `resources/js/components/BlogList.tsx` — blog list + detail
- `resources/js/components/GalleryPage.tsx` — gallery grid + lightbox
- `resources/js/components/EventsPage.tsx` — upcoming/past events
- `resources/js/components/ContactPage.tsx` — contact form
- `bootstrap/app.php` — middleware config, CSRF exceptions
