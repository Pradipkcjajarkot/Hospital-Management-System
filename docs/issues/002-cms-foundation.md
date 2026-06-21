## What to build

Content Management System foundation that powers the public website. Build as database-driven CMS within the Laravel admin panel.

1. **Page Management** — CRUD for static pages (title, slug, content, status, template). Slug-based routing with fallback.
2. **Dynamic Content Blocks** — Reusable widgets (hero banners, testimonials, feature sections) with ordering and status toggle
3. **Media Library** — Upload images, videos, documents with thumbnails, categories, and file manager UI
4. **Navigation Menu Management** — Drag-drop menu builder with nested items, custom/external links
5. **SEO Management** — Meta title, description, OG image, canonical URL per page
6. **Page Templates** — Layout selection (full-width, sidebar, homepage)
7. **Cache layer** — Public-facing CMS pages cached with Laravel cache (invalidated on update)

## Acceptance criteria

- [ ] Admin can create/edit/publish pages from admin panel; pages render on public URLs
- [ ] Admin can manage content blocks and arrange order
- [ ] Media library supports upload, delete, and folder organization
- [ ] Menu builder creates multi-level navigation menus
- [ ] Each page has SEO fields that render in `<head>` on public view
- [ ] Cache invalidates when content is updated

## Blocked by

#1 (Project Scaffolding)
