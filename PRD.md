# Hospital Management System — Product Requirements Document (PRD)

**Version:** 2.0  
**Status:** Draft  
**Language:** English  
**Last Updated:** June 21, 2026

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution](#2-solution)
3. [User Stories](#3-user-stories)
4. [Implementation Decisions](#4-implementation-decisions)
5. [Testing Decisions](#5-testing-decisions)
6. [Out of Scope](#6-out-of-scope)
7. [Further Notes](#7-further-notes)

---

## 1. Problem Statement

Multi-speciality hospitals with 200+ beds face critical operational challenges due to fragmented, paper-based, and disjointed digital systems:

- Patient data scattered across paper records and siloed software, forcing staff to waste time searching for information and leading to duplicate or lost records.
- Manual appointment scheduling via phone and walk-in creates long wait times, double-booking, and no-show rates of 15–20% without systematic reminders.
- Billing errors from manual calculation, delayed insurance claim processing, and lack of consolidated billing across departments cause revenue leakage and patient dissatisfaction.
- No real-time visibility into bed occupancy, inventory stock levels, lab result status, or financial performance — administrators rely on end-of-day reports that are already stale.
- Patients must physically visit the hospital to collect reports, pay bills, or schedule follow-ups, increasing non-clinical footfall and administrative overhead.
- No unified platform across 20+ operational areas (registration, pharmacy, lab, OT, blood bank, HR, etc.), forcing staff to context-switch between different tools or paper registers.

The existing documentation (v1.0 PRD) specified a monolithic Blade-based architecture. However, a headless architecture with a React SPA frontend is now preferred to enable a richer, more responsive user experience, better separation of concerns, and a foundation for future mobile app development using the same API layer.

---

## 2. Solution

A **monorepo** containing two packages:

1. **`packages/backend`** — A Laravel application serving as a RESTful JSON API with authentication (Laravel Sanctum for SPA auth), Eloquent ORM, Spatie RBAC, queues, caching, and all business logic.
2. **`packages/frontend`** — A React SPA (Vite-based) consuming the Laravel API, providing both the admin panel (20 modules) and the public-facing website (14 features) as distinct route groups within the same SPA.

The monorepo shares tooling configuration (ESLint, Prettier, TypeScript configs, CI/CD pipelines) at the root level. The Laravel backend handles all business logic, persistence, authorization, and async jobs. The React frontend handles all UI rendering, client-side routing, form validation, and state management.

MySQL 8+ remains the primary data store, accessed exclusively through the Laravel API.

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MONOREPO ROOT                                      │
│  ├── packages/frontend (React SPA)                                   │
│  │     ├── src/admin/       → 20 module admin panels                 │
│  │     ├── src/public/      → 14 public website feature pages        │
│  │     └── src/shared/      → UI components, hooks, API client       │
│  │                                                                   │
│  ├── packages/backend (Laravel API)                                  │
│  │     ├── app/Http/Controllers/Api/  → RESTful API controllers      │
│  │     ├── app/Services/              → Business logic               │
│  │     ├── app/Models/                → Eloquent models (60+)        │
│  │     └── routes/api.php             → API route definitions        │
│  │                                                                   │
│  └── root configs (ESLint, Prettier, CI, etc.)                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                              Laravel API (JSON)
                          Sanctum SPA Authentication
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        LARAVEL APPLICATION                           │
│                                                                      │
│  Middleware:  Auth → RBAC → Throttle → Logging                       │
│  Controllers: Api\Admin\* (20 modules) │ Api\Public\* (14 features) │
│  Services:    PatientService │ AppointmentService │ BillingService…  │
│  Models:      16 model groups → 60+ database tables                  │
│  Jobs:        Notifications │ ReportGeneration │ Backup              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                              MySQL 8+ (InnoDB)
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                                 │
│  SMS Provider │ Email (SMTP) │ Backup Storage                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. User Stories

### 3.1 Admin Users

1. As a **Super Admin**, I want to see a dashboard with real-time KPIs (bed occupancy, today's revenue, pending lab results), so that I can monitor hospital operations at a glance.
2. As a **Super Admin**, I want to manage all 20 admin modules with full CRUD access, so that I can configure and operate the entire system.
3. As a **Super Admin**, I want to configure system settings (hospital profile, notification templates, backup schedules), so that the system adapts to hospital policies.
4. As a **Super Admin**, I want to manage users, roles, and permissions through a matrix UI, so that staff access is secure and granular.
5. As a **Super Admin**, I want to view audit logs (user, action, timestamp, old/new values), so that I can track all data modifications for compliance.
6. As an **Admin**, I want to register a new patient in under 2 minutes with auto-generated Patient ID and duplicate detection, so that registration is fast and error-free.
7. As an **Admin**, I want to search patients by name, phone, ID, or date range, so that I can quickly locate patient records.
8. As an **Admin**, I want to manage doctor profiles (qualifications, schedule, leave, consultation fees), so that doctor information is always current.
9. As an **Admin**, I want to view and manage appointments across all doctors, so that I can oversee scheduling operations.
10. As an **Admin**, I want to manage IPD admissions (bed allocation, daily progress, discharge), so that inpatient care is coordinated.
11. As an **Admin**, I want to generate reports with date filters and export to PDF/Excel, so that I can share insights with stakeholders.
12. As an **Admin**, I want to manage CMS content (pages, blocks, media, menus, blog) for the public website, so that the website stays updated without developer involvement.
13. As a **Doctor**, I want to see my personalized dashboard with today's appointments and pending tasks on login, so that I can plan my day efficiently.
14. As a **Doctor**, I want to view patient history (past visits, diagnoses, prescriptions, lab reports) in chronological order, so that I have complete clinical context.
15. As a **Doctor**, I want to record OPD consultations (symptoms, diagnosis, vitals, prescriptions, lab/imaging orders), so that the medical record is complete and digital.
16. As a **Doctor**, I want to prescribe medicines with dosage, frequency, and duration, so that the pharmacy can dispense accurately.
17. As a **Doctor**, I want to order lab tests and imaging for a patient, so that diagnostic workflow is initiated from the consultation screen.
18. As a **Doctor**, I want to view lab and imaging results as soon as they are approved, so that I can make timely clinical decisions.
19. As a **Doctor**, I want to request surgery with procedure details and urgency, so that the OT team can schedule appropriately.
20. As a **Nurse**, I want to record patient vitals (BP, pulse, temp, SpO2) during OPD check-in, so that the doctor has baseline data.
21. As a **Nurse**, I want to manage IPD nursing notes (shift-wise vitals, input/output, observations), so that the patient's inpatient stay is documented.
22. As a **Nurse**, I want to view and execute medication administration records (MAR), so that patients receive correct medications on time.
23. As a **Nurse**, I want to view bed status across wards in real-time, so that I can allocate beds efficiently during admissions.
24. As a **Receptionist**, I want to register walk-in patients quickly with minimal fields, so that the patient journey starts without delay.
25. As a **Receptionist**, I want to book appointments across departments and doctors with real-time slot availability, so that double-booking is prevented.
26. As a **Receptionist**, I want to check in patients for appointments and generate tokens, so that queue management is streamlined.
27. As a **Receptionist**, I want to generate OPD and pharmacy bills, so that patients can pay and proceed.
28. As a **Lab Technician**, I want to view pending lab orders and collect samples with barcode printing, so that sample tracking is accurate.
29. As a **Lab Technician**, I want to enter test results with reference ranges and auto-flag abnormal values, so that reports are clinically useful.
30. As a **Lab Technician**, I want to batch-enter results for multiple orders, so that workflow efficiency improves.
31. As a **Pharmacist**, I want to view pending prescriptions from doctors in a queue, so that I can process them in order.
32. As a **Pharmacist**, I want to dispense medicines from specific batches (FIFO for near-expiry), so that inventory is managed efficiently.
33. As a **Pharmacist**, I want to manage the drug catalog (brand, generic, category, strength), so that the pharmacy database is comprehensive.
34. As a **Pharmacist**, I want to handle purchase orders (requisition → approval → PO → GRN), so that stock is replenished systematically.
35. As a **Pharmacist**, I want to view low stock alerts and expiry reports, so that I can take proactive action.
36. As an **Accountant**, I want to generate bills (OPD, IPD, pharmacy, lab, package) with auto-calculation, so that billing is accurate.
37. As an **Accountant**, I want to record payments in multiple modes (cash, card, UPI, bank transfer, insurance), so that all payment types are supported.
38. As an **Accountant**, I want to process refunds with reason and approval workflow, so that financial integrity is maintained.
39. As an **Accountant**, I want to manage insurance claims (submission, tracking, settlement), so that claim revenue is captured.
40. As an **Accountant**, I want to view daily collection reports and revenue breakdowns, so that financial reconciliation is straightforward.
41. As an **HR Manager**, I want to manage employee records (personal, employment, financial, documents), so that staff data is centralized.
42. As an **HR Manager**, I want to process monthly payroll with salary components and deductions, so that salaries are accurate and on time.
43. As an **HR Manager**, I want to manage leave applications (apply → approve → balance tracking), so that attendance is systematic.
44. As an **HR Manager**, I want to generate HR reports (attendance summary, payroll summary, employee turnover), so that workforce analytics are available.
45. As a **Department Head**, I want to view department-level dashboards and reports, so that I can monitor my department's performance.

### 3.2 Public Users (Patients & Visitors)

46. As a **Website Visitor**, I want to view the hospital's home page with hero banners, stats, and featured departments, so that I understand the hospital's offerings.
47. As a **Website Visitor**, I want to browse the doctor directory and view individual doctor profiles with schedules, so that I can choose a doctor.
48. As a **Website Visitor**, I want to book an appointment online through a 5-step guided flow, so that I can secure a slot without calling.
49. As a **Website Visitor**, I want to view department details, services, and OPD schedules, so that I can plan my visit.
50. As a **Website Visitor**, I want to view emergency information and live ER wait times, so that I can make informed decisions during emergencies.
51. As a **Website Visitor**, I want to submit a contact form or feedback, so that I can reach the hospital administration.
52. As a **Website Visitor**, I want to browse health blog articles, gallery, and events, so that I stay informed about hospital activities.
53. As a **Website Visitor**, I want to apply for jobs listed on the careers page, so that I can submit my application online.
54. As a **Website Visitor**, I want to view and book health packages, so that I can schedule preventive health checkups.
55. As a **Patient**, I want to log in to the patient portal, so that I can access my health information online.
56. As a **Patient**, I want to view my upcoming and past appointments, so that I can track my visit history.
57. As a **Patient**, I want to download my lab reports and prescriptions as PDF, so that I don't need to visit the hospital for copies.
58. As a **Patient**, I want to view my bills and payment history, so that I can track my expenses.
59. As a **Patient**, I want to cancel or reschedule an appointment online, so that I can manage my bookings without calling.
60. As a **Patient**, I want to receive SMS/email reminders for upcoming appointments, so that I don't forget my visits.

---

## 4. Implementation Decisions

### 4.1 Monorepo Structure

- **Root workspace** at `hospital-management-system/` with a `packages/` directory.
- Shared root-level configs: `.eslintrc.js`, `.prettierrc`, `tsconfig.base.json`, `.github/workflows/`, `composer.json` (for backend), `package.json` (root for workspace scripts).
- **`packages/backend`**: Full Laravel application with its own `artisan`, `composer.json`, `.env`.
- **`packages/frontend`**: Vite + React + TypeScript application with its own `package.json`, `vite.config.ts`, `tsconfig.json`.
- Workspace orchestration scripts at root level: `dev`, `build`, `test`, `lint` that run across both packages.

### 4.2 Laravel Backend (API-only)

- Laravel serves exclusively as a JSON API — **no Blade views** (except for error pages or a minimal SPA entry point).
- Laravel Sanctum for SPA cookie-based authentication (admin panel) and token-based auth (for future mobile clients).
- API routes under `routes/api.php` organized as:
  - `api/admin/*` — Admin module endpoints (prefixed with `api/admin`, protected by `auth:sanctum` + role middleware)
  - `api/public/*` — Public endpoints (appointment booking, doctor directory, blog, etc.)
  - `api/portal/*` — Patient portal endpoints (protected by `auth:sanctum`)
- Form Request validation for all API endpoints.
- API resource classes for consistent JSON responses.
- Spatie Laravel Permission for RBAC — permission checks in controllers/FormRequests.
- Laravel Queue with database driver for async jobs (notifications, report generation, backups).
- Laravel Cache for content caching with tag-based invalidation.
- Jobs for: SMS notifications, email notifications, PDF generation, scheduled report dispatch, database backup.
- All business logic in Service classes, not controllers.

### 4.3 React SPA Frontend

- **Framework**: React 18+ with TypeScript.
- **Build tool**: Vite.
- **Routing**: React Router v6+ with lazy-loaded route groups:
  - `/admin/*` — Admin panel (20 module routes, protected by auth check)
  - `/public/*` — Public website routes (open access)
  - `/portal/*` — Patient portal routes (protected by auth check)
- **State management**: React Context + hooks for auth/user state; React Query (TanStack Query) for server state caching and mutations.
- **UI components**: Shared component library under `src/shared/components/` (DataTable, Form fields, Modal, Card, Chart, Calendar, KPI widget).
- **API client**: Axios instance with interceptors for auth token/cookie attachment, error handling, and request/response transformation.
- **Form handling**: React Hook Form + Zod for client-side validation matching server rules.
- **Charts**: Recharts or Chart.js React wrapper for dashboard visualizations.
- **Rich text**: React Quill or TipTap for CMS content editing.
- **Styling**: Tailwind CSS 3 with a shared design system.

### 4.4 Authentication Flow

- React SPA makes a POST to `/api/login` → Laravel validates credentials → Sanctum issues a session cookie (SPA auth) or token (API auth).
- On page load, React calls `GET /api/user` to validate session and fetch user permissions.
- Frontend stores role/permissions in React context; route guards block unauthorized navigation.
- Patient portal uses same Sanctum SPA auth with separate login endpoint.

### 4.5 API Response Convention

All API responses follow a consistent JSON structure:

```json
{
  "data": { ... },
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  },
  "message": "Patient registered successfully"
}
```

Error responses:

```json
{
  "message": "Validation failed",
  "errors": {
    "phone": ["The phone field is required."],
    "email": ["The email must be a valid email address."]
  }
}
```

### 4.6 Database & Schema

- MySQL 8+ InnoDB — same 60+ table schema as v1.0 design (see existing docs/architecture.md).
- With the API-first approach, all queries go through Eloquent serialization (API Resources), allowing control over what data is exposed.
- UUIDs for public-facing IDs (patient ID, appointment reference, bill number) to avoid sequential ID exposure.
- Database migrations in the backend package.

### 4.7 Module Implementation Order

The same 23 vertical slices from the v1.0 roadmap apply, but each slice now includes:

- **Backend**: Migration, Model, API Controller, Form Request, Service class, API Resource, Route, Test
- **Frontend**: Page components, route config, API client integration, form components, table components, tests

Build order (unchanged from v1.0):

| Phase | Issues | Description |
|-------|--------|-------------|
| Foundation | 1→2→3 | Scaffolding, auth, RBAC, CMS foundation, public layout |
| Clinical Core | 4→5→6→7→8 | Patients, doctors, appointments, OPD, IPD |
| Diagnostics | 9→10 | Lab, pharmacy |
| Finance | 11 | Billing |
| Operations | 12→13→14→15→16→17 | OT, ER, blood bank, inventory, HR, radiology |
| Reports | 18 | Dashboards, reports |
| Public | 19→20→21→22 | Online booking, patient portal, public pages, blog |
| System | 23 | Settings, integrations |

### 4.8 Caching Strategy

- Laravel Cache with tag support for granular invalidation.
- Public API responses (doctor directory, blog, pages) cached at the HTTP level with configurable TTL.
- React Query provides client-side caching with stale-while-revalidate pattern.
- Cache invalidation triggered by webhook/event on relevant data changes.

### 4.9 CI/CD

- GitHub Actions at monorepo root.
- Parallel jobs: backend tests (PHPUnit/Pest), frontend tests (Vitest), lint (ESLint, PHP CS Fixer), type check (TypeScript).
- Build step compiles frontend assets, then a deploy step copies built assets or deploys backend and frontend independently.

---

## 5. Testing Decisions

### 5.1 Testing Philosophy

- Test external behavior, not implementation details. Tests verify that given an input, the system produces the correct output, without coupling to internal implementation.
- The API is the seam. All testing flows through HTTP requests against the Laravel API and asserts on JSON responses.
- A single testing seam is preferred — the HTTP API layer. This covers both backend logic and the contract the frontend depends on.

### 5.2 Backend Testing

- **Framework**: PHPUnit (or Pest) with Laravel's `RefreshDatabase` trait.
- **Test types**:
  - **Feature tests** (primary): HTTP tests that make real API calls against the application. Each test registers a patient, books an appointment, generates a bill, etc., and asserts on the JSON response structure and values.
  - **Unit tests**: For complex service methods (e.g., billing calculation, insurance co-payment computation) where pure logic exists.
- **What to test**:
  - API status codes (200, 201, 401, 403, 422, 404)
  - JSON response structure matches the API Resource definition
  - RBAC: each endpoint returns 403 when accessed by unauthorized role
  - Validation: invalid inputs return 422 with field-level errors
  - Business rules: duplicate detection, no double-booking, stock deduction on dispensing
  - Workflow transitions: appointment status flow, bill→payment→receipt
- **What not to test**:
  - Eloquent internals (trust the framework)
  - Blade views (none exist)
  - JavaScript behavior (tested on frontend)

### 5.3 Frontend Testing

- **Framework**: Vitest + React Testing Library.
- **Test types**:
  - **Component tests**: Render page components with mock API data, assert that correct UI renders (table rows, form fields, chart data points).
  - **Integration tests**: Test complete flows — e.g., fill registration form → submit → assert success toast appears.
  - **API client tests**: Test that Axios interceptors attach correct headers and handle errors.
- **What to test**:
  - Forms: validation messages appear on invalid input, submit calls correct API
  - Lists/tables: data renders correctly from mock API response
  - Auth guards: protected routes redirect to login when unauthenticated
  - Error states: API error shows appropriate message to user
- **What not to test**:
  - Laravel business logic (tested on backend)
  - Styling details
  - Third-party library behavior (Chart.js, React Router internals)

### 5.4 Prior Art

- Backend tests follow Laravel's HTTP test pattern (`$this->postJson()`, `$this->getJson()`), as documented in Laravel's testing docs and used widely in the Laravel ecosystem.
- Frontend tests follow React Testing Library's recommended approach: render → find element → assert.

---

## 6. Out of Scope

- Native mobile applications (iOS/Android) — the React SPA is responsive and works on mobile browsers. Native apps are a future phase using the same API.
- Telemedicine/video consultation — requires real-time media streaming infrastructure beyond this scope.
- PACS (Picture Archiving and Communication System) integration — radiology images are uploaded manually; full PACS integration is future work.
- HL7/FHIR interoperability with external EMR/EHR systems.
- AI-based diagnostic assistance, predictive analytics.
- Multi-branch/hospital chain support — this system targets a single hospital location.
- Barcode/RFID scanner hardware integration — barcodes are printed and can be scanned with commodity scanners; dedicated hardware integration is not implemented.
- Biometric attendance device integration — attendance is recorded manually in the SPA.
- Offline/first mode — the SPA requires internet connectivity.
- WebSocket/pusher real-time updates — polling-based refresh is used initially; real-time can be added later.

---

## 7. Further Notes

### 7.1 Relationship to v1.0

This PRD (v2.0) supersedes the previous v1.0 PRD. All domain content (module specs, workflows, user roles, schema, wireframe layouts) is carried forward from v1.0. The key changes are:

- **Architecture**: Monolithic Blade → Headless Laravel API + React SPA
- **Repository**: Single Laravel app → Monorepo with `packages/backend` and `packages/frontend`
- **Auth**: Laravel Breeze/Jetstream → Laravel Sanctum SPA authentication
- **Frontend**: Blade templates → React components with client-side routing
- **APIs**: Web routes → JSON API routes with consistent response format

### 7.2 New ADR Needed

The existing ADR 0001 (Monolithic Laravel Architecture) is now superseded. A new ADR (0003) should be written to document the decision to adopt a headless Laravel API + React SPA monorepo architecture, including rationale and trade-offs.

### 7.3 Dev Experience

- Root `package.json` scripts: `npm run dev` starts both Laravel (`php artisan serve`) and Vite dev server concurrently.
- `npm run build` builds the React app and runs any backend build steps.
- `npm run test` runs both backend and frontend test suites.
- Shared ESLint/Prettier config ensures consistent code style across PHP and TypeScript.
