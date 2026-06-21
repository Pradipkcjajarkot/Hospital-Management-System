## What to build

Set up the Laravel project foundation for the Hospital Management System. This includes:

1. **Laravel installation** with MySQL database configuration
2. **Authentication system** using Laravel Breeze or Jetstream (admin login)
3. **Role-Based Access Control (RBAC)** using Spatie Laravel Permission package
4. **Admin panel layout** — responsive sidebar navigation with the module menu structure
5. **11 user roles**: Super Admin, Admin, Doctor, Nurse, Receptionist, Lab Technician, Pharmacist, Accountant, HR, Department Head, Patient
6. **Permission matrix** — module-wise CRUD permissions per role
7. **Middleware** to enforce role/permission checks on routes
8. **User management** — CRUD for users, role assignment
9. **Base controllers** (Admin/Public namespace structure)
10. **Error handling**, logging, and basic security middleware

## Acceptance criteria

- [ ] `php artisan serve` starts the app; login page loads
- [ ] Super Admin can create users and assign roles
- [ ] Each role sees only permitted menu items in the sidebar
- [ ] Unauthorized access returns 403
- [ ] Admin layout has sidebar navigation with collapsible menu groups
- [ ] Audit log records login/logout and critical actions

## Blocked by

None — can start immediately
