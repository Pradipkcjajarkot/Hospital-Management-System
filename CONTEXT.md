# Hospital Management System — Domain Glossary

## Domain

A multi-speciality hospital management system handling 200+ beds with full administrative and public-facing capabilities.

## Project Status

- **Phase 0 (Scaffold)**: ✅ Laravel 12.12.2 installed, React + Vite wired, `npm run build` passes
- **Phase 1 (Auth/RBAC)**: 🔜 Next — install Sanctum, create auth routes/controllers/migrations, build React auth pages
- **Architecture**: Headless Laravel API + React SPA (ADR 0003)
- **Testing**: Feature tests via HTTP JSON endpoints (single API seam)
- **GitHub**: pushed to `origin/main`
- **Blocker**: `gh` CLI not authenticated — run `gh auth login -p https -w` to create GitHub issues from PRD

## Glossary

| Term | Definition |
|------|-----------|
| Hospital | A multi-speciality healthcare institution with 200+ beds capacity |
| Department | A specialized unit within the hospital (e.g., Cardiology, Orthopedics, Pediatrics, Emergency) |
| System Scope | Covers all standard hospital departments: Medicine, Surgery, OB/GYN, Pediatrics, Emergency, Radiology, Lab, Pharmacy, Rehabilitation |
| Admin Module | A functional unit in the admin panel — there are 20 modules: Dashboard, Patient Mgmt, Doctor Mgmt, Staff Mgmt, Appointment & Scheduling, OPD Mgmt, IPD Mgmt, Billing & Finance, Pharmacy, Lab & Diagnostics, Radiology & Imaging, Blood Bank, OT Mgmt, Emergency (ER), Bed Mgmt, Inventory & Store, HR & Payroll, Reports & Analytics, User & Role Mgmt, CMS, Settings |
| Public Panel | The patient-facing website with 14 features: Home, About Us, Departments & Services, Doctor Directory, Online Appointment Booking, Patient Portal, Health Blog, Contact Us, Feedback & Reviews, Careers, Gallery & Media, Events & News, Emergency Info, Health Packages |
| CMS (Content Management System) | The content management layer allowing admin to manage: static pages, dynamic content blocks, blog/news articles with categories, media library, navigation menus, SEO metadata |
| CMS Architecture | Headless Laravel API + React SPA — Laravel serves JSON API, React renders admin and public views |
| BPR Workflow | A key hospital business process being re-engineered. 8 workflows: Patient Journey, Appointment to Consultation, Emergency Triage, Lab Workflow, Pharmacy Workflow, Billing & Insurance, OT Workflow, IPD Workflow |
| User Role | A system role with defined permissions. 11 roles: Super Admin, Admin, Doctor, Nurse, Receptionist, Lab Technician, Pharmacist, Accountant, HR, Department Head, Patient |
