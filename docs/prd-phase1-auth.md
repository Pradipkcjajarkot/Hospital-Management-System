# Phase 1 — Authentication & RBAC — PRD

**Version:** 1.0  
**Status:** Draft  
**Applies to:** Issue #1 (Project Scaffolding, Auth & RBAC)  
**Last Updated:** June 23, 2026

---

## 1. Problem Statement

The hospital management system requires a secure, role-based access control system that serves three distinct user groups:

- **Admin staff** (receptionists, nurses, doctors, pharmacists, accountants, HR, admins) who need access to the admin panel with granular, role-specific permissions
- **Patients** who need self-service access to their own data via the patient portal
- **Public visitors** who browse the public website without authentication

Without a unified auth system, the hospital risks unauthorized data access, role confusion (e.g., a nurse accessing admin-level financial data), and a poor user experience from repeated logins across different parts of the application.

## 2. Solution

A **Laravel Sanctum-based SPA authentication** system powering both the admin panel and patient portal from a single identity layer, with **Spatie Laravel Permission** providing fine-grained RBAC.

### 2.1 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    REACT SPA                                      │
│                                                                   │
│  AuthProvider (Context)                                           │
│  ├── useAuth() hook → { user, roles, permissions, login, logout }│
│  ├── ProtectedRoute → redirects to /login if unauthenticated     │
│  ├── RoleGate → conditionally renders UI based on role           │
│  └── PermissionGate → conditionally renders UI based on perm     │
│                                                                   │
│  AdminLayout                                                     │
│  ├── Sidebar filtered by permissions                             │
│  └── Header with user dropdown (profile, logout)                 │
│                                                                   │
│  Login Page                                                      │
│  ├── Email + password form                                       │
│  └── CSRF token initialization on mount                         │
└──────────────────────────┬───────────────────────────────────────┘
                           │ POST /api/login
                           │ GET  /api/user  (session validation)
                           │ POST /api/logout
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    LARAVEL API                                     │
│                                                                   │
│  Middleware Stack:                                                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ StartSession → EncryptCookies → AddQueuedCookiesToResponse│    │
│  │ → EnsureFrontendRequestsAreStateful (Sanctum)             │    │
│  │ → auth:sanctum (route group)                              │    │
│  │ → CheckRole / CheckPermission (custom)                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  AuthController                                                   │
│  ├── login()  → Validate → Sanctum issue session                 │
│  ├── logout() → Invalidate session                               │
│  └── user()   → Return authenticated user + roles + perms        │
│                                                                   │
│  Spatie Laravel Permission                                        │
│  ├── PermissionRegistrar → caches permissions                     │
│  ├── DirectPermissionGuard                                       │
│  └── Blade/API directives (@can, $user->can())                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Authentication Flow (Detailed)

#### Step 1: CSRF Protection Init

```
React SPA                         Laravel
   │                                │
   │ GET /sanctum/csrf-cookie       │
   │───────────────────────────────►│
   │                                │ Set XSRF-TOKEN cookie
   │◄───────────────────────────────│
```

- Called once when login page mounts
- Sanctum sets `XSRF-TOKEN` cookie (available to JS)
- Subsequent mutating requests include this as `X-XSRF-TOKEN` header

#### Step 2: Login

```
React SPA                         Laravel                         DB
   │                                │                             │
   │ POST /api/login                │                             │
   │ X-XSRF-TOKEN: <token>          │                             │
   │ { email, password }            │                             │
   │───────────────────────────────►│                             │
   │                                │ Validate credentials         │
   │                                │────────────────────────────►│
   │                                │◄────────────────────────────│
   │                                │                             │
   │                                │ Create Sanctum session       │
   │                                │ Set laravel_session cookie   │
   │                                │ (HTTP-only, SameSite=Strict) │
   │                                │                             │
   │◄───────────────────────────────│                             │
   │ 200 {                         │                             │
   │   data: {                     │                             │
   │     user: { id, name, email },│                             │
   │     roles: ['Doctor'],        │                             │
   │     permissions: [            │                             │
   │       'patient.view',         │                             │
   │       'appointment.create'    │                             │
   │     ]                         │                             │
   │   },                          │                             │
   │   message: 'Login successful' │                             │
   │ }                             │                             │
```

#### Step 3: Session Validation (on page load)

```
React SPA                         Laravel
   │                                │
   │ GET /api/user                  │
   │ Cookie: laravel_session=...    │
   │───────────────────────────────►│
   │                                │ Verify session via Sanctum
   │◄───────────────────────────────│
   │ 200 { user, roles, permissions }   OR   401 Unauthenticated
```

#### Step 4: Logout

```
React SPA                         Laravel
   │                                │
   │ POST /api/logout               │
   │ X-XSRF-TOKEN: <token>          │
   │───────────────────────────────►│
   │                                │ Invalidate Sanctum session
   │                                │ Delete session cookie
   │◄───────────────────────────────│
   │ 200 { message: 'Logged out' }  │
```

### 2.3 RBAC Design

#### 2.3.1 Roles (11)

| Role | Scope | Typical Access |
|------|-------|---------------|
| Super Admin | All modules, all perms | System configuration, user management, audit logs |
| Admin | All operational modules | Patient, doctor, appointment, billing, CMS management |
| Doctor | Clinical modules | View patients, record consultations, prescribe, order labs |
| Nurse | Clinical support | Record vitals, manage IPD nursing, view appointments |
| Receptionist | Front desk | Register patients, book appointments, generate tokens |
| Lab Technician | Lab module | View lab orders, enter results, manage samples |
| Pharmacist | Pharmacy module | View prescriptions, dispense medicines, manage inventory |
| Accountant | Finance module | Generate bills, record payments, insurance claims |
| HR | HR module | Employee records, payroll, leave management |
| Department Head | Department dashboards | View department reports, manage department staff |
| Patient | Patient portal | View own appointments, reports, bills |

#### 2.3.2 Permission Matrix (per-module CRUD)

Each admin module gets 4 permissions: `{module}.create`, `{module}.view`, `{module}.update`, `{module}.delete`.

**20 modules:** Dashboard, Patient, Doctor, Appointment, OPD, IPD, Billing, Pharmacy, Lab, Radiology, BloodBank, OT, Emergency, Bed, Inventory, HR, Report, CMS, Setting, User

Total: 80 permissions (20 modules × 4 CRUD ops).

Permissions are seeded via database seeder and assigned to roles. The matrix defining which role gets which permission is defined in `database/seeders/RoleAndPermissionSeeder.php`.

### 2.4 Authorization Enforcement

#### Backend (3-layer)

| Layer | Mechanism | What it checks |
|-------|-----------|----------------|
| Route middleware | `auth:sanctum` | Valid session exists |
| Route middleware | `role:doctor,nurse` | User has one of the listed roles |
| Controller/FormRequest | `$this->authorize('patient.create')` or Gate | Specific permission check |

#### Frontend (3-layer)

| Layer | Component | What it does |
|-------|-----------|--------------|
| Route guard | `<ProtectedRoute>` | Redirects to `/login` if `useAuth()` shows no user |
| UI gate | `<RoleGate roles={['Admin']}>` | Hides children if user lacks role |
| UI gate | `<PermissionGate perm="patient.create">` | Hides children (buttons, links) if user lacks permission |

### 2.5 Session & Security

| Concern | Implementation |
|---------|---------------|
| Session driver | `database` (not file — for potential horizontal scaling) |
| Cookie domain | Configurable via `SESSION_DOMAIN` in `.env` |
| CSRF | Sanctum's built-in SPA CSRF protection |
| Password hashing | Laravel's bcrypt (default) |
| Rate limiting | `throttle:api` middleware on login (5 attempts/minute) |
| Account lockout | After 5 failed attempts, 1-minute lockout (Laravel built-in) |
| Password validation | Min 8 chars, mixed case + number (custom rule) |
| Session timeout | 120 minutes inactivity (configurable) |
| Audit logging | `audit_logs` table: user_id, action, ip_address, user_agent, timestamp |

## 3. User Stories

1. As a **staff member**, I want to log in with my email and password, so that I can access the admin panel.
2. As a **staff member**, I want to see only the menu items and features my role permits, so that I'm not distracted by irrelevant modules.
3. As a **Super Admin**, I want to create users, assign roles, and manage permissions, so that staff access is properly configured.
4. As a **Super Admin**, I want to view audit logs of who logged in/out and when, so that I can monitor system access.
5. As a **developer**, I want to protect API routes with middleware that checks both authentication and authorization, so that security is enforced at the API layer.
6. As a **developer**, I want permission checks available both on the backend (middleware) and frontend (components), so that unauthorized actions are prevented at every level.

## 4. Out of Scope

- OAuth / Social login (Google, Facebook)
- Two-factor authentication (2FA)
- Remember-me / persistent sessions
- Password reset flow (will be added in a later phase)
- User registration (users are created by Super Admin only)
- API token generation for third-party integrations
- LDAP / Active Directory integration
- Session management UI (force logout other sessions)

## 5. Acceptance Criteria

- [ ] Login page renders at `/login`; CSRF cookie exchange happens automatically
- [ ] Valid credentials return 200 with user + roles + permissions; session cookie set
- [ ] Invalid credentials return 422 with validation error
- [ ] 5 failed attempts trigger 1-minute lockout
- [ ] Authenticated user can access `/admin/*` routes
- [ ] Unauthenticated requests to protected routes return 401
- [ ] Unauthorized role requests return 403
- [ ] Logout clears session and redirects to login
- [ ] Super Admin can create/edit/delete users and assign roles
- [ ] Users can have multiple roles
- [ ] Sidebar dynamically renders menu items based on permissions
- [ ] `<ProtectedRoute>` redirects to login when unauthenticated
- [ ] `<PermissionGate>` hides elements when permission is missing
- [ ] All auth endpoints return consistent JSON response format
- [ ] Audit log records login and logout with IP and timestamp

## 6. Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| Laravel Sanctum | SPA session-based auth | ^4.x |
| Spatie Laravel Permission | RBAC management | ^6.x |
| Axios | HTTP client (frontend) | ^1.x |
| React Router v6 | Client-side routing | ^6.x |

## 7. API Contract

### POST /api/login

**Request:**
```json
{
  "email": "admin@hospital.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Dr. Sharma",
      "email": "admin@hospital.com"
    },
    "roles": ["Doctor", "Department Head"],
    "permissions": ["patient.view", "patient.create", "appointment.view", "appointment.create"]
  },
  "message": "Login successful"
}
```

**Response (422):**
```json
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["These credentials do not match our records."]
  }
}
```

**Response (429 — rate limited):**
```json
{
  "message": "Too many login attempts. Please try again in 60 seconds."
}
```

### GET /api/user

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Dr. Sharma",
      "email": "admin@hospital.com"
    },
    "roles": ["Doctor"],
    "permissions": ["patient.view", "appointment.create"]
  }
}
```

**Response (401):**
```json
{
  "message": "Unauthenticated"
}
```

### POST /api/logout

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## 8. Testing Strategy

### Backend (PHPUnit)

| Test | What it verifies |
|------|-----------------|
| `test_user_can_login_with_valid_credentials` | 200 + session cookie set + user returned |
| `test_user_cannot_login_with_invalid_credentials` | 422 + error message |
| `test_login_is_rate_limited` | 429 after 5 attempts |
| `test_authenticated_user_can_access_protected_route` | 200 |
| `test_unauthenticated_user_gets_401` | 401 |
| `test_unauthorized_role_gets_403` | 403 for route with role middleware |
| `test_user_can_logout` | 200 + session invalidated |
| `test_super_admin_can_list_users` | 200 + user collection |
| `test_super_admin_can_assign_roles` | 200 + user has role |
| `test_audit_log_created_on_login` | audit_logs table has entry |

### Frontend (Vitest + React Testing Library)

| Test | What it verifies |
|------|-----------------|
| `LoginPage renders login form` | Email + password fields + submit button visible |
| `LoginPage calls API on submit` | Axios POST called with credentials |
| `LoginPage shows error on failure` | Error toast/message displayed |
| `ProtectedRoute redirects unauthenticated` | Navigation to /login |
| `ProtectedRoute renders children when authenticated` | Children rendered |
| `Sidebar hides items based on permissions` | Only permitted menu items shown |
| `AuthProvider fetches user on mount` | GET /api/user called |
| `Logout clears context and redirects` | Auth context cleared, navigated to /login |
