# Implementation Plan — Vertical-Slice Issues

Based on PRD v2.0 (docs/prd). Each issue is a thin tracer-bullet through all layers (schema → API → UI → tests).

---

## Phase 1 — Foundation (Issues 1–3)

### Issue 1 — Project Scaffolding & Auth Identity
**Blocked by:** None — can start immediately

**End-to-end scope:**
- Monorepo setup (`packages/backend` Laravel API + `packages/frontend` React SPA)
- Shared root configs (ESLint, Prettier, TypeScript base, CI pipelines)
- Laravel Sanctum SPA authentication (login, logout, session validation via `GET /api/user`)
- User registration with email verification
- Password reset flow (forgot + reset with token/OTP)
- Frontend: AuthProvider context, ProtectedRoute guard, Login/Register/ForgotPassword/ResetPassword pages, admin layout shell (sidebar + header)
- HTTP tests covering all auth endpoints (200/401/422)

**User stories:** 61, 62, 63, 64, 65, 66

---

### Issue 2 — RBAC & User Management
**Blocked by:** Issue 1

**End-to-end scope:**
- Spatie Laravel Permission setup (roles + permissions tables)
- 11 roles: Super Admin, Admin, Doctor, Nurse, Receptionist, Lab Technician, Pharmacist, Accountant, HR, Department Head, Patient
- Permission matrix: module-wise CRUD per role
- User CRUD (admin): `GET/POST/PUT/DELETE /api/admin/users`
- Role/permission management: `GET/POST/PUT /api/admin/roles`
- Frontend: User management page (DataTable + create/edit modal), role/permission matrix UI
- RoleGate + PermissionGate components, permission-filtered sidebar
- HTTP tests: each endpoint returns 403 when accessed by unauthorized role

**User stories:** 2, 4, 61–67

---

### Issue 3 — CMS Foundation & Public Shell
**Blocked by:** Issue 1

**End-to-end scope:**
- `cms_pages`, `cms_content_blocks`, `cms_media`, `cms_menus` migrations
- CMS page CRUD (admin): `GET/POST/PUT/DELETE /api/admin/cms/pages`
- Public website shell: home page component, dynamic page renderer
- Public endpoints: `GET /api/public/pages/{slug}`, `GET /api/public/home`
- Shared DataTable component with search/filter/sort/pagination
- HTTP tests for CMS + public endpoints

**User stories:** 12, 46, 49, 52

---

## Phase 2 — Clinical Core (Issues 4–8)

### Issue 4 — Patient Management
**Blocked by:** Issue 2 (RBAC for permission checks)

**End-to-end scope:**
- Patients CRUD: `GET/POST /api/admin/patients`, `GET/PUT/DELETE /api/admin/patients/{id}`
- Auto-generated Patient ID with format `PAT-{year}-{sequential}`
- Duplicate detection on email/phone
- Frontend: patient list (DataTable), registration form (React Hook Form + Zod), patient detail view with history placeholder
- HTTP tests: CRUD operations, validation errors, duplicate detection

**User stories:** 6, 7, 24

---

### Issue 5 — Doctor Management
**Blocked by:** Issue 2 (RBAC)

**End-to-end scope:**
- Doctors CRUD: `GET/POST /api/admin/doctors`, `GET/PUT/DELETE /api/admin/doctors/{id}`
- Fields: qualifications, consultation fee, schedule (available days/times), leave tracking, status
- Frontend: doctor list (DataTable), doctor profile/edit form, schedule management UI
- HTTP tests

**User stories:** 8

---

### Issue 6 — Appointments
**Blocked by:** Issues 4, 5 (patients + doctors must exist)

**End-to-end scope:**
- Appointments CRUD with real-time slot availability checking
- Status workflow: scheduled → confirmed → checked_in → completed | cancelled | no_show
- `GET /api/admin/appointments/slots?doctor_id=&date=` — available time slots
- Frontend: appointment calendar + list view, booking form with slot picker, status management
- HTTP tests: booking, double-booking prevention, status transitions

**User stories:** 9, 25, 26

---

### Issue 7 — OPD & IPD
**Blocked by:** Issues 4, 6

**End-to-end scope:**
- OPD consultations: record symptoms, diagnosis, vitals (BP/pulse/temp/SpO2), prescriptions, lab/imaging orders
- IPD admissions: bed allocation, daily progress notes, discharge summary
- `beds` and `wards` tables for IPD bed management
- Frontend: OPD consultation screen, IPD admission/discharge workflow, nursing notes
- HTTP tests

**User stories:** 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23

---

### Issue 8 — Messaging & Notifications
**Blocked by:** Issue 1 (auth)

**End-to-end scope:**
- `conversations`, `messages`, `message_recipients` tables
- Internal messaging API: list conversations, view thread, send reply, mark as read
- Notifications table (Laravel's built-in system)
- Notification types: appointment reminders, lab results, bill generated, message received, low stock, leave, surgery, system announcement
- `GET /api/notifications`, `POST /api/notifications/{id}/read`, `POST /api/notifications/read-all`
- Device/session logging: `session_logs` table, `GET /api/sessions`, `DELETE /api/sessions/{id}`
- Frontend: message slide-over panel, notification bell with unread badge, sessions page in settings
- HTTP tests

**User stories:** 69, 72, 73, 74, 75, 77, 78

---

## Phase 3 — Diagnostics (Issues 9–10)

### Issue 9 — Laboratory
**Blocked by:** Issue 2 (RBAC), Issue 4 (patients)

**End-to-end scope:**
- Lab test catalog (name, category, reference ranges, price)
- Lab orders from OPD consultation or direct
- Test result entry with auto-flag abnormal values
- Barcode printing for sample tracking
- Batch result entry for multiple orders
- Frontend: lab dashboard, pending orders queue, result entry forms
- HTTP tests

**User stories:** 28, 29, 30

---

### Issue 10 — Pharmacy
**Blocked by:** Issue 2 (RBAC)

**End-to-end scope:**
- Drug catalog (brand, generic, category, strength, price)
- Prescription dispensing with batch selection (FIFO for near-expiry)
- Purchase orders: requisition → approval → PO → GRN
- Low stock alerts and expiry reports
- Frontend: pharmacy dashboard, dispensing queue, drug catalog management, PO workflow
- HTTP tests

**User stories:** 31, 32, 33, 34, 35

---

## Phase 4 — Finance (Issue 11)

### Issue 11 — Billing
**Blocked by:** Issues 4, 6, 7, 9, 10 (patients, appointments, OPD/IPD, lab, pharmacy data)

**End-to-end scope:**
- Multi-type bill generation: OPD consultation, IPD stay, pharmacy, lab, health packages
- Auto-calculation of totals, taxes, discounts
- Payment recording: cash, card, UPI, bank transfer, insurance
- Refund processing with reason + approval workflow
- Insurance claim submission and tracking
- Daily collection report with revenue breakdown
- Frontend: billing screen, payment entry, refund modal, reports view
- HTTP tests

**User stories:** 27, 36, 37, 38, 39, 40

---

## Phase 5 — Operations (Issues 12–17)

### Issue 12 — Operation Theatre
**Blocked by:** Issues 4, 5, 7 (patients, doctors, OPD)

**End-to-end scope:**
- Surgery request with procedure details and urgency
- OT scheduling with room availability
- Pre-operative checklist, intra-operative notes, post-operative instructions
- Frontend: OT dashboard, surgery scheduling, notes entry
- HTTP tests

**User stories:** 19

---

### Issue 13 — Emergency Room
**Blocked by:** Issues 4, 6 (patients, appointments)

**End-to-end scope:**
- ER triage assessment (severity level, vitals, chief complaint)
- Rapid patient registration for walk-in emergencies
- Bed allocation in ER ward
- Live ER wait time display for public
- Frontend: ER dashboard, triage form, bed board
- HTTP tests

**User stories:** 50

---

### Issue 14 — Blood Bank
**Blocked by:** Issue 4 (patients)

**End-to-end scope:**
- Donor registration and deferral tracking
- Blood grouping and component separation
- Inventory by blood type and component
- Cross-matching for transfusion, issue and return
- Frontend: donor management, inventory dashboard, cross-matching workflow
- HTTP tests

---

### Issue 15 — Central Inventory
**Blocked by:** Issue 2 (RBAC)

**End-to-end scope:**
- Non-pharmacy item catalog (consumables, equipment, linen)
- Requisition → approval → issue workflow
- Stock levels with reorder thresholds
- Vendor management
- Frontend: inventory dashboard, requisition forms, stock alerts
- HTTP tests

---

### Issue 16 — Human Resources
**Blocked by:** Issue 2 (RBAC)

**End-to-end scope:**
- Employee records (personal, employment, financial, documents)
- Payroll processing with salary components and deductions
- Leave management: apply → approve → balance tracking
- HR reports (attendance summary, payroll summary, turnover)
- Frontend: employee list, payroll screen, leave application form
- HTTP tests

**User stories:** 41, 42, 43, 44, 45

---

### Issue 17 — Radiology
**Blocked by:** Issue 4 (patients)

**End-to-end scope:**
- Imaging order from OPD consultation
- Modality/room scheduling
- PACS image upload (manual)
- Radiology report with findings and impression
- Frontend: order entry, image upload, report entry
- HTTP tests

---

## Phase 6 — Reports (Issue 18)

### Issue 18 — Dashboards & Reports
**Blocked by:** All data phases 1–5

**End-to-end scope:**
- Role-based dashboards: KPIs (bed occupancy, today's revenue, pending results, appointment counts)
- Report generation with date filters and department filters
- PDF/Excel export
- Chart visualizations (Recharts or Chart.js)
- Frontend: dashboard widgets, report builder page, export buttons
- HTTP tests

**User stories:** 1, 11, 13, 45, 69

---

## Phase 7 — Public Website & Patient Portal (Issues 19–22)

### Issue 19 — Public Pages
**Blocked by:** Issue 3 (CMS), Issues 4, 5 (data)

**End-to-end scope:**
- Home page: hero banners, stats counters, featured departments, testimonials
- Doctor directory with search and filter by specialization/department
- Department detail pages with OPD schedules
- Health blog with article list + detail view
- Gallery and events pages
- Frontend: lazy-loaded public route group, all page components
- HTTP tests

**User stories:** 46, 47, 49, 52

---

### Issue 20 — Online Appointment Booking
**Blocked by:** Issue 19 (public pages), Issue 6 (appointments)

**End-to-end scope:**
- 5-step guided booking flow (select department → select doctor → select slot → enter details → confirm)
- Real-time slot availability display
- Booking confirmation with optional email/SMS
- Frontend: step-by-step booking wizard component
- HTTP tests

**User stories:** 48

---

### Issue 21 — Patient Portal
**Blocked by:** Issue 1 (auth), Issues 4–6 (patient data)

**End-to-end scope:**
- Patient login (`/api/portal/login` scoped to patient role)
- View upcoming and past appointments
- View lab reports and prescriptions (PDF download)
- View bills and payment history
- Cancel or reschedule appointments online
- Frontend: portal layout, all portal page components
- HTTP tests

**User stories:** 55, 56, 57, 58, 59, 60

---

### Issue 22 — Careers & Contact
**Blocked by:** Issue 19 (public pages)

**End-to-end scope:**
- Job listings page with department filter
- Job application form with resume upload
- Contact form with department routing
- Feedback submission
- Frontend: careers page, application form, contact page
- HTTP tests

**User stories:** 51, 53

---

## Phase 8 — System (Issue 23)

### Issue 23 — Settings & Integrations
**Blocked by:** All phases (configures all modules)

**End-to-end scope:**
- User preferences: theme (light/dark), language, timezone, notification preferences per event type
- System settings: hospital profile, business hours, notification templates, backup schedules
- `settings` key-value table with type casting
- Cache with tag-based invalidation on setting updates
- Activity log observer on all core models
- `GET /api/admin/activity-logs` with filters
- Frontend: settings pages (user preferences, system settings, activity log viewer)
- HTTP tests

**User stories:** 3, 5, 67, 68, 76, 79

---

## Dependency Graph

```
Phase 1 (Foundation: 1→2→3)
  ├── Phase 2 (Clinical Core: 4→5→6→7→8)
  │     ├── Phase 3 (Diagnostics: 9→10)
  │     │     └── Phase 4 (Finance: 11)
  │     ├── Phase 5 (Operations: 12→13→14→15→16→17)
  │     └── Phase 7 (Public: 19→20→21→22 — depends on CMS + Doctors/Appointments)
  ├── Phase 6 (Reports: 18 — depends on all data phases 1-5)
  └── Phase 8 (Settings: 23 — configures all phases)
```
