# Implementation Plan — Hospital Management System

Based on PRD v2.0 (Laravel API + React SPA Monorepo)

---

## Phase 1 — Foundation (Issues 1→2→3)

**Goal:** Monorepo scaffolding, auth identity, RBAC, admin layout, CMS foundation, public shell.

### Auth Flow Design

The authentication system uses **Laravel Sanctum SPA authentication** with the following flow:

#### 1. Login Flow

```
React SPA                  Laravel API                  Database
   │                           │                          │
   │  POST /api/login          │                          │
   │  { email, password }      │                          │
   │──────────────────────────►│                          │
   │                           │  Validate credentials     │
   │                           │─────────────────────────►│
   │                           │◄─────────────────────────│
   │                           │                          │
   │                           │  Sanctum issues           │
   │                           │  session cookie           │
   │◄──────────────────────────│                          │
   │                           │                          │
   │  200 OK                   │                          │
   │  { user, roles,           │                          │
   │    permissions }          │                          │
```

- Frontend sends `POST /api/login` with `email` + `password` + `CSRF token`
- Laravel validates via Sanctum; issues a session cookie (HTTP-only, SameSite=Strict)
- Response returns user object, assigned roles, and all permissions
- Frontend stores user context in React Context

#### 2. Session Validation

```
React SPA                  Laravel API
   │                           │
   │  GET /api/user            │
   │  (cookie sent             │
   │   automatically)          │
   │──────────────────────────►│
   │                           │  Verify Sanctum session
   │◄──────────────────────────│
   │  { user, roles,           │
   │    permissions }          │
```

- On app load, React calls `GET /api/user` to validate session
- Sanctum middleware checks cookie validity
- Returns user + roles + permissions; frontend populates auth context
- If 401, redirect to login page

#### 3. Logout

- Frontend calls `POST /api/logout`
- Sanctum invalidates session cookie
- Frontend clears auth context and redirects to login

#### 4. RBAC Integration

```
                  ┌─────────────────┐
                  │    11 Roles      │
                  │                  │
                  │ Super Admin      │
                  │ Admin            │
                  │ Doctor           │
                  │ Nurse            │
                  │ Receptionist     │
                  │ Lab Technician   │
                  │ Pharmacist       │
                  │ Accountant       │
                  │ HR               │
                  │ Department Head  │
                  │ Patient          │
                  └────────┬────────┘
                           │
           ┌───────────────┴───────────────┐
           │    Spatie Laravel Permission   │
           │                               │
           │  Module-wise CRUD permissions  │
           │  per role (permission matrix)  │
           └───────────────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
     ┌────────▼────────┐    ┌──────────▼──────────┐
     │  Backend Guard   │    │  Frontend Guard      │
     │                  │    │                      │
     │  Middleware on   │    │  Route-level checks  │
     │  routes:         │    │  + sidebar filtering │
     │  - auth:sanctum  │    │  - ProtectedRoute    │
     │  - role:doctor   │    │    component         │
     │  - permission:   │    │  - useAuth() hook    │
     │    patient.create│    │  - PermissionGate    │
     └─────────────────┘    └──────────────────────┘
```

- **Spatie Laravel Permission** manages roles and permissions at the database level
- Permission matrix defines CRUD access per module per role
- Backend middleware: `auth:sanctum` + custom role/permission middleware on API routes
- Frontend guards: `ProtectedRoute` component checks auth context before rendering routes; sidebar hides menu items the user lacks permission for

#### 5. Frontend Auth Architecture

```
packages/frontend/src/
  shared/
    api/
      client.ts          ← Axios instance (withCredentials: true)
      auth.ts            ← login(), logout(), getUser() functions
    context/
      AuthContext.tsx     ← React Context for user/roles/permissions
      AuthProvider.tsx    ← Wraps app; validates session on mount
    guards/
      ProtectedRoute.tsx  ← Redirects to /login if unauthenticated
      RoleGate.tsx        ← Renders children only if user has required role
      PermissionGate.tsx  ← Renders children only if user has required permission
    hooks/
      useAuth.ts          ← Convenience hook for AuthContext
      usePermission.ts    ← Check specific permissions
  admin/
    layouts/
      AdminLayout.tsx     ← Sidebar + header; filters menu by permissions
    pages/
      Login.tsx           ← Login form; calls auth service
      Dashboard.tsx       ← Post-login landing page
```

#### 6. Auth Database Tables

| Table | Purpose |
|-------|---------|
| `users` | All system users (staff + patients) |
| `roles` | Spatie roles table |
| `permissions` | Spatie permissions table |
| `role_has_permissions` | Spatie pivot |
| `model_has_roles` | Spatie pivot (user→role) |
| `model_has_permissions` | Spatie pivot (direct user permissions) |
| `personal_access_tokens` | Sanctum token management |
| `sessions` | Session storage |
| `audit_logs` | Login/logout + critical action audit trail |

#### 7. API Route Structure

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/login` | Public |
| POST | `/api/logout` | Authenticated |
| GET | `/api/user` | Authenticated |
| GET | `/sanctum/csrf-cookie` | Public (Sanctum CSRF init) |
| CRUD | `/api/admin/users` | Super Admin |
| CRUD | `/api/admin/roles` | Super Admin |
| READ | `/api/admin/permissions` | Super Admin |

See `docs/prd-phase1-auth.md` for full API contracts, RBAC permission matrix, security configuration, and testing strategy.

### Backend APIs

- `POST /api/register`, `POST /api/login`, `POST /api/logout`
- `POST /api/email/verify/send`, `GET /api/email/verify/{id}/{hash}`
- `POST /api/otp/send`, `POST /api/otp/verify`
- `POST /api/forgot-password`, `POST /api/reset-password`
- `GET /api/user`, `GET /api/profile`, `PUT /api/profile`, `PUT /api/profile/password`
- `GET /api/sessions`, `DELETE /api/sessions/{id}`
- `GET /api/admin/users`, `POST /api/admin/users`, `PUT /api/admin/users/{id}`, `DELETE /api/admin/users/{id}`
- `GET /api/admin/roles`, `POST /api/admin/roles`, `PUT /api/admin/roles/{id}`
- `GET /api/admin/cms/pages`, `POST /api/admin/cms/pages`, `PUT /api/admin/cms/pages/{id}`
- `GET /api/public/pages/{slug}`, `GET /api/public/home`
- Activity log observer on User model

### Frontend Pages

- Auth pages: Login, Register, Email Verification, OTP challenge, Forgot Password, Reset Password
- Admin layout: sidebar nav, header (user menu, notification bell placeholder, message icon placeholder), route outlet
- User management page (Super Admin): table of users, create/edit modal, role assignment
- Role/permission matrix page
- Profile page: view/edit name/phone/email/avatar, change password
- Sessions page: active sessions list, revoke button
- CMS page management (admin): create/edit pages with rich text, publish/draft
- Public website shell: home page component, CMS page renderer
- Shared DataTable component with search/filter/sort/pagination

### Database Migrations

- `users` (with email_verified_at, phone, avatar, preferences JSON)
- `personal_access_tokens` (Sanctum)
- `roles` + `permissions` + `model_has_roles` + `model_has_permissions` + `role_has_permissions` (Spatie)
- `activity_logs`
- `session_logs`
- `sessions` (Laravel session table)
- `cms_pages`, `cms_content_blocks`, `cms_media`, `cms_menus`

### Tests

- Registration flow (success, duplicate email, validation errors)
- Login/logout (valid, invalid, unverified)
- OTP send/verify (valid code, expired, rate limit)
- Password reset flow (request, reset, invalid token)
- Email verification (send, verify, resend)
- Profile CRUD
- RBAC: each role sees only permitted endpoints
- Session listing and revocation

### Dependencies

None — start here.

---

## Phase 2 — Clinical Core (Issues 4→5→6→7→8)

**Goal:** Patients, doctors, appointments, OPD, IPD + messaging + notifications.

### Backend APIs

- `GET /api/admin/patients`, `POST /api/admin/patients`, `GET /api/admin/patients/{id}`, `PUT /api/admin/patients/{id}`
- `GET /api/admin/doctors`, `POST /api/admin/doctors`, `PUT /api/admin/doctors/{id}`
- `GET /api/admin/doctors/{id}/schedules`, `PUT /api/admin/doctors/{id}/schedules`
- `GET /api/admin/appointments`, `POST /api/admin/appointments`, `PUT /api/admin/appointments/{id}/status`
- `GET /api/admin/opd`, `POST /api/admin/opd/register`, `POST /api/admin/opd/{id}/vitals`, `POST /api/admin/opd/{id}/consultation`
- `GET /api/admin/ipd`, `POST /api/admin/ipd/admit`, `POST /api/admin/ipd/{id}/progress`, `POST /api/admin/ipd/{id}/discharge`
- `GET /api/admin/beds`, `POST /api/admin/beds/allocate`, `POST /api/admin/beds/transfer`
- `GET /api/admin/messages/conversations`, `POST /api/admin/messages/conversations`, `POST /api/admin/messages/conversations/{id}/reply`
- `GET /api/notifications`, `POST /api/notifications/{id}/read`, `POST /api/notifications/read-all`
- Patient timeline, document upload/download
- Doctor leave management, OPD schedule management
- Activity log observers on Patient, Doctor, Appointment, OPD, IPD models
- Notification triggers for appointment reminders (queued job)

### Frontend Pages

- Patient management page: registration form, patient list with search, patient detail with timeline, document upload
- Doctor management page: doctor list with search, profile form, schedule editor (weekly + overrides), leave requests
- Appointment management page: calendar views (day/week/month), booking form, status actions (confirm, check-in, complete, cancel, no-show)
- OPD page: token display board, check-in flow, vitals form, consultation screen (diagnosis, prescriptions, lab/imaging orders)
- IPD page: admission form with bed selection, daily progress notes, nursing notes, discharge summary
- Bed management page: ward-wise dashboard, bed map, allocate/transfer/maintenance actions
- Messaging panel: conversation list, thread view, new conversation modal, unread badge
- Notification bell dropdown with unread count, notification list page
- Global search bar in header (searching patients, doctors, appointments)
- Activity log viewer (admin page)

### Database Migrations

- `patients`, `patient_documents`, `patient_medical_history`
- `doctors`, `doctor_schedules`, `doctor_schedule_overrides`, `doctor_leaves`
- `appointments`
- `opd_registrations`, `opd_vitals`, `consultations`, `prescriptions`, `prescription_items`
- `ipd_admissions`, `ipd_progress_notes`, `ipd_nursing_notes`, `ipd_discharge_summaries`
- `wards`, `beds`, `bed_transfers`
- `conversations`, `messages`, `message_recipients`
- `notifications` (Laravel built-in)

### Tests

- Patient CRUD + duplicate detection
- Doctor CRUD + schedule management
- Appointment booking (no double-booking, status transitions)
- OPD flow: register → vitals → consult → prescribe
- IPD flow: admit → progress → discharge
- Bed allocation/release/transfer
- Messaging: create conversation, reply, read/unread
- Notifications: send, mark read, list
- Activity logs recorded for all above

### Dependencies

Phase 1 complete.

---

## Phase 3 — Diagnostics (Issues 9→10)

**Goal:** Lab management, pharmacy management.

### Backend APIs

- `GET /api/admin/lab/tests`, `POST /api/admin/lab/tests`, `PUT /api/admin/lab/tests/{id}`
- `POST /api/admin/lab/orders`, `GET /api/admin/lab/orders`, `POST /api/admin/lab/orders/{id}/collect`, `POST /api/admin/lab/orders/{id}/results`, `POST /api/admin/lab/orders/{id}/approve`
- `GET /api/admin/pharmacy/medicines`, `POST /api/admin/pharmacy/medicines`
- `POST /api/admin/pharmacy/purchase-orders`, workflow: create → approve → receive → GRN
- `GET /api/admin/pharmacy/prescriptions` (queue), `POST /api/admin/pharmacy/prescriptions/{id}/dispense`
- `GET /api/admin/pharmacy/inventory`, alerts for low stock, expiry
- Activity log observers on LabOrder, Medicine, StockMovement models
- Notification triggers for lab results ready, low stock alerts

### Frontend Pages

- Lab test catalog page (CRUD)
- Lab order workflow page: order list, sample collection, result entry (with reference ranges, abnormal flags), batch entry, approval
- Lab report PDF generation/preview
- Pharmacy medicine catalog page
- Purchase order workflow page: requisition → approve → PO → GRN
- Prescription queue page with dispensing form (batch selection, auto-deduct stock)
- Pharmacy inventory dashboard with low stock/expiry alerts
- Stock movement report page

### Database Migrations

- `lab_tests`, `lab_test_reference_ranges`, `lab_orders`, `lab_order_items`, `lab_results`
- `medicine_catalog`, `medicine_batches`
- `purchase_orders`, `purchase_order_items`, `grn_items`
- `pharmacy_dispensings`
- `suppliers`
- `stock_movements`

### Tests

- Lab: order → collect → result entry → approve flow
- Test reference range flagging (high/low)
- Pharmacy: medicine CRUD, batch tracking, dispensing
- Purchase order workflow end-to-end
- Stock deduction on dispensing, expired batch blocking
- Low stock alert triggering

### Dependencies

Phase 2 complete (patients, appointments, OPD exist).

---

## Phase 4 — Finance (Issue 11)

**Goal:** Billing, payments, insurance claims.

### Backend APIs

- `GET /api/admin/billing/bills`, `POST /api/admin/billing/bills/generate`
- `POST /api/admin/billing/bills/{id}/add-item`, `POST /api/admin/billing/bills/{id}/apply-discount`
- `POST /api/admin/billing/bills/{id}/payment` (multi-mode split payments)
- `POST /api/admin/billing/bills/{id}/refund`
- `GET /api/admin/billing/insurance/providers`, `POST /api/admin/billing/insurance/claims`
- `GET /api/admin/billing/reports/daily-collection`, `GET /api/admin/billing/reports/revenue-by-department`
- PDF bill generation + print
- Activity log observer on Bill, Payment, InsuranceClaim models
- Notification for bill generated, payment received, refund processed

### Frontend Pages

- Bill generate page (OPD/IPD/Pharmacy/Lab/Package types), add bill items, apply discount
- Payment capture form (cash with denomination, card, UPI, bank transfer, insurance split)
- Bill detail page with print/PDF download
- Refund form with approval workflow
- Insurance providers master page
- Insurance claim submission and tracking page
- Daily collection report page
- Revenue dashboard (department/doctor/service breakdown)
- Pending payments report page

### Database Migrations

- `bills`, `bill_items`, `bill_discounts`
- `payments`, `payment_split_details`
- `refunds`
- `insurance_providers`, `patient_insurance`, `insurance_claims`
- `concessions`

### Tests

- Bill auto-generation from services rendered
- Split payment with multiple modes
- Discount approval workflow (threshold check)
- Insurance claim lifecycle
- Refund reverts transactions correctly
- Daily collection report accuracy

### Dependencies

Phase 2 + 3 complete (services to bill from: OPD, IPD, pharmacy, lab).

---

## Phase 5 — Operations (Issues 12→13→14→15→16→17)

**Goal:** OT, Emergency, Blood Bank, Inventory, HR/Payroll, Radiology.

### Backend APIs

- `GET /api/admin/ot/rooms`, `POST /api/admin/ot/surgeries`, workflow: request → schedule → pre-op → intra-op → post-op
- `GET /api/admin/er/triage`, `POST /api/admin/er/register`, `POST /api/admin/er/{id}/treat`
- `GET /api/admin/blood-bank/donors`, `POST /api/admin/blood-bank/donors`, blood units, cross-match, transfusion
- `GET /api/admin/inventory/items`, `POST /api/admin/inventory/requisitions`, PO workflow, stock adjustments
- `GET /api/admin/hr/employees`, `POST /api/admin/hr/employees`, attendance, leave, payroll processing
- `GET /api/admin/radiology/tests`, imaging orders, upload images, reporting
- Activity log observers on all new models
- Notification triggers: surgery scheduled, critical ER, blood low stock, leave approved

### Frontend Pages

- OT management: room master, surgery request/schedule calendar, pre-op checklist, intra-op record, post-op recovery
- Emergency: triage assessment (color-coded acuity), ER dashboard, fast-track registration, ER-to-IPD/OT transfer
- Blood Bank: donor management, blood unit tracking, cross-matching, transfusion record, compatibility matrix
- Inventory: item catalog, requisition workflow, PO workflow, GRN, stock adjustment, asset register
- HR: employee master, attendance entry, leave management calendar, payroll processing, payslip PDF
- Radiology: imaging test catalog, order workflow, image upload/viewer, reporting with findings/conclusion

### Database Migrations (~20+ tables)

- `ot_rooms`, `surgeries`, `surgery_team`, `pre_op_checklist`, `intra_op_records`, `post_op_recovery`
- `er_triage`, `er_registrations`, `er_treatments`
- `blood_donors`, `blood_units`, `cross_matching`, `blood_issues`, `transfusion_records`, `blood_camps`
- `inventory_items`, `inventory_batches`, `inventory_requisitions`, `inventory_grn`, `inventory_issues`, `assets`
- `employees`, `employee_documents`, `attendance`, `employee_leaves`, `payroll`, `payroll_items`, `employee_loans`
- `radiology_tests`, `radiology_orders`, `radiology_images`, `radiology_reports`

### Tests

- OT: surgery request → schedule → pre-op → intra-op → post-op
- ER: triage → fast-track registration → treatment → transfer
- Blood Bank: donor → unit → cross-match → issue → transfusion
- Inventory: requisition → PO → GRN → stock adjustment
- HR: employee CRUD → leave apply/approve → payroll generate
- Radiology: order → image upload → reporting

### Dependencies

Phase 1 + 2 complete (patients, doctors, appointments needed).

---

## Phase 6 — Reports & Dashboards (Issue 18)

**Goal:** Configurable reports, KPI dashboards, admin dashboard.

### Backend APIs

- `GET /api/admin/dashboard/kpi` — aggregated KPI data
- `GET /api/admin/dashboard/charts/revenue-trend`, `department-distribution`, `appointment-status`, `daily-patient-count`
- `GET /api/admin/reports/{category}` — patient, financial, operational, clinical, HR, pharmacy reports
- Report filters: date range, department, doctor, service
- Report export: `GET /api/admin/reports/{id}/export?format=pdf|csv|xlsx`
- Scheduled report configuration: `POST /api/admin/reports/schedules`
- Dashboard widget configuration: `GET/PUT /api/admin/dashboard/widgets`

### Frontend Pages

- Admin dashboard page: KPI cards, charts (revenue bar, department pie, appointment donut, patient line), recent activity, alerts
- Reports page: category selector, date range picker, filter controls, export buttons
- Report view page: chart + table combined view
- Scheduled reports configuration page
- Dashboard widget layout editor (drag-and-drop, save per user)

### Tests

- KPI aggregation queries return correct values
- Chart data matches underlying data
- Report export generates valid PDF/CSV/XLSX
- Scheduled report enqueues job and delivers
- Widget layout persists per user

### Dependencies

All phases 1–5 complete (all data sources exist).

---

## Phase 7 — Public Website & Patient Portal (Issues 19→20→21→22)

**Goal:** Online appointment booking, patient portal, public pages, blog/gallery/events.

### Backend APIs

- `GET /api/public/doctors`, `GET /api/public/doctors/{id}` (public)
- `GET /api/public/doctors/{id}/slots?date=` (available slots)
- `POST /api/public/appointments` (booking with captcha)
- `POST /api/public/appointments/cancel` (reference + phone verification)
- `GET /api/portal/dashboard`, `GET /api/portal/appointments`, `GET /api/portal/reports`, `GET /api/portal/bills`, `GET /api/portal/history`
- `GET /api/public/blog`, `GET /api/public/blog/{slug}`
- `GET /api/public/gallery`, `GET /api/public/events`
- `POST /api/public/contact`, `POST /api/public/feedback`
- `GET /api/public/careers`, `POST /api/public/careers/{id}/apply`
- `GET /api/public/health-packages`, `POST /api/public/health-packages/{id}/book`
- `GET /api/public/emergency` (wait time, contact info)
- Public pages rendered from CMS (Phase 1)

### Frontend Pages

- Public header/footer layout (CMS-managed navigation)
- Home page: hero slider, stats counters, featured departments, testimonials, latest blog
- About Us page: mission/vision, timeline, leadership team
- Departments & Services: listing, detail page with doctors and OPD schedule
- Doctor Directory: searchable/filterable listing, profile page with schedule and "Book Appointment" CTA
- Online Booking: 5-step wizard (Department → Doctor → Date/Time → Patient Details → Confirmation)
- Patient Portal: login, dashboard, appointments, lab reports, prescriptions, bills, medical history, profile
- Blog: listing with category filter, detail with related posts
- Gallery: album grid, photo lightbox, video gallery
- Events & News: listing, calendar view, detail
- Contact Us: form, map embed, contact info
- Careers: job listing, apply form with resume upload
- Health Packages: listing, detail, booking
- Emergency Info: contacts, wait time, ambulance info

### Database Migrations

- Blog posts, categories
- Gallery albums, media items
- Events
- Job listings, applications
- Health packages, bookings
- Contact/feedback submissions

### Tests

- Online booking: 5-step flow, availability, confirmation, cancel/reschedule
- Patient portal: login, data access scoped to patient only
- Public pages render CMS content correctly
- Blog CRUD and listing/filtering
- Gallery lightbox and album organization
- Contact form submission
- Job application with file upload
- Health package booking

### Dependencies

Phase 1 (CMS, public layout), Phase 2 (doctors, appointments).

---

## Phase 8 — System & Settings (Issue 23)

**Goal:** Settings, integrations, user preferences, notification templates.

### Backend APIs

- `GET/PUT /api/admin/settings` — hospital profile, system config, notification settings
- `GET/PUT /api/settings` — user preferences (theme, language, timezone, notification prefs)
- `GET/PUT /api/admin/settings/notification-templates` — email/SMS template management
- `POST /api/admin/settings/test-email`, `POST /api/admin/settings/test-sms` — channel testing
- `POST /api/admin/backup` — manual backup trigger
- `GET /api/admin/backups` — list backups with download
- `POST /api/admin/settings/cache-clear` — cache invalidation
- Module enable/disable toggle
- System health check endpoint

### Frontend Pages

- Hospital Profile settings page (name, logo, address, social media)
- System Configuration page (date format, timezone, currency, business hours)
- Email/SMS Settings page (SMTP config, provider API keys, test send)
- Notification Template editor (per event type, per channel)
- User Preferences page (theme toggle, language, timezone, notification per-event toggles)
- Backup management page (manual trigger, download, schedule config)
- System Logs viewer (error logs, access logs)
- Module Manager page (enable/disable toggles)
- Settings search

### Tests

- System settings persist and cache correctly
- User preferences persist and apply (theme, etc.)
- Notification template rendering with variables
- Test email/SMS delivery
- Backup generation and download
- Cache clear invalidates correctly

### Dependencies

All prior phases complete (settings configure them).

---

## Dependency Graph

```
Phase 1 (Foundation)
  ├── Phase 2 (Clinical Core) + Messaging + Notifications
  │     ├── Phase 3 (Diagnostics: Lab, Pharmacy)
  │     │     └── Phase 4 (Finance: Billing)
  │     ├── Phase 5 (Operations: OT, ER, Blood Bank, Inventory, HR, Radiology)
  │     └── Phase 7 (Public: depends on Phase 1 CMS + Phase 2 Doctors/Appointments)
  ├── Phase 6 (Reports: depends on all data phases 1-5)
  └── Phase 8 (Settings: configures all phases)
```
