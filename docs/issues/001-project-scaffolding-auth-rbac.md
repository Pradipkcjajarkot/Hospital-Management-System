## What to build

Set up the monorepo foundation for the Hospital Management System. This includes:

1. **Monorepo scaffolding** — root `package.json` with workspace scripts (`dev`, `build`, `test`, `lint`), shared configs (ESLint, Prettier, TypeScript base), `.github/workflows/` for CI
2. **Backend package** — Fresh Laravel installation in `packages/backend/` with MySQL config, Sanctum for SPA auth, Spatie Laravel Permission for RBAC
3. **Frontend package** — Fresh Vite + React + TypeScript SPA in `packages/frontend/` with React Router, Axios client, Tailwind CSS
4. **Authentication API** — Register, Login (email/phone + password), Logout, Email Verification, Forgot Password, Reset Password endpoints
5. **OTP flow** — Send/verify 6-digit OTP for 2FA and password reset
6. **Sanctum SPA auth** — cookie-based session auth for the React SPA; `/api/user` endpoint to fetch authenticated user + permissions
7. **Role-Based Access Control (RBAC)** — Spatie roles/permissions seeded from the permission matrix
8. **11 user roles**: Super Admin, Admin, Doctor, Nurse, Receptionist, Lab Technician, Pharmacist, Accountant, HR, Department Head, Patient
9. **Permission matrix** — module-wise CRUD permissions per role, enforced via middleware on API routes
10. **User management API** — CRUD for users, role assignment (Super Admin only)
11. **Profile API** — view/update profile, change password, manage sessions
12. **Activity log observer** — on all core models, record create/update/delete to `activity_logs` table
13. **Device/session logging** — record IP, user agent, device type on login; expose via `/api/sessions`
14. **API route structure** — `api/admin/*` (role-guarded), `api/public/*` (open), `api/portal/*` (patient-guarded), `api/auth/*` (guest)
15. **Global search/filter** — reusable `FilterService` trait on backend; shared `DataTable` component on frontend
16. **Frontend auth pages** — Login, Register, Forgot Password, Reset Password, Email Verification, OTP challenge
17. **Frontend admin layout** — sidebar navigation, header with user menu, notification bell, message panel placeholder
18. **Frontend route guards** — redirect unauthenticated users to login, unauthorized roles to 403 page
19. **Error handling** — consistent JSON error responses, Axios interceptors for 401/403/422 handling

## Acceptance criteria

- [ ] `npm run dev` starts both Laravel API and Vite dev server
- [ ] Visitor can register, verify email, and log in
- [ ] User receives OTP on phone/email during registration and 2FA login
- [ ] Forgot/reset password flow works end-to-end via email link and OTP
- [ ] Super Admin can create users and assign roles via API
- [ ] Each role sees only permitted API endpoints (403 on unauthorized)
- [ ] Profile API returns authenticated user data with permissions
- [ ] Activity log records all Create/Update/Delete operations
- [ ] Session log records login IP, browser, device type
- [ ] Global search works across patients, doctors, appointments, users
- [ ] Admin layout renders with sidebar, header, and route outlet
- [ ] Unauthenticated requests to protected routes redirect to login

## Blocked by

None — can start immediately
