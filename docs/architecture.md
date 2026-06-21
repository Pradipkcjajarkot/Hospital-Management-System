# Hospital Management System — Architecture & Design

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PUBLIC PANEL (Website)                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Home    │ │ About    │ │ Depts    │ │ Doctor Directory │   │
│  │ Page    │ │ Us       │ │ & Serv.  │ │                  │   │
│  ├─────────┤ ├──────────┤ ├──────────┤ ├──────────────────┤   │
│  │ Online  │ │ Patient  │ │ Blog/    │ │ Contact/         │   │
│  │ Booking │ │ Portal   │ │ Gallery  │ │ Careers          │   │
│  └─────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                          HTTP Routes (Web)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LARAVEL APPLICATION                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              MIDDLEWARE LAYER                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │  │
│  │  │ Auth     │ │ RBAC     │ │ Logging  │ │ CSRF       │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                │                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              CONTROLLER LAYER                             │  │
│  │  ┌──────────────────────┐ ┌──────────────────────────┐  │  │
│  │  │  Admin Controllers   │ │  Public Controllers     │  │  │
│  │  │  20 module ctrls     │ │  14 feature ctrls       │  │  │
│  │  └──────────────────────┘ └──────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                │                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SERVICE LAYER (Business Logic)               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │  │
│  │  │Patient   │ │Appoint.  │ │Billing   │ │Notifica-   │ │  │
│  │  │Service   │ │Service   │ │Service   │ │tionService │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                │                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              MODEL LAYER (Eloquent ORM)                   │  │
│  │  50+ Models mapping to database tables                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                          MySQL Database
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ SMS Provider │  │ Email (SMTP) │  │ Backup Storage     │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Database Schema — Core Tables

### 2.1 System & Auth
```
users                    — id, name, email, password, phone, role_id, department_id, status, last_login
roles                    — id, name, guard_name
permissions              — id, name, guard_name
role_has_permissions     — pivot
model_has_roles          — pivot (user ↔ role)
audit_logs               — id, user_id, action, module, record_id, old_values, new_values, ip_address
```

### 2.2 Patient Management
```
patients                 — id, patient_uid, first_name, last_name, dob, gender, blood_group, phone, email
                            address, city, state, pincode, emergency_contact_name, emergency_contact_phone
                            allergy_info, id_proof_type, id_proof_number, registration_date, status
patient_medical_history  — id, patient_id, condition, diagnosis_date, notes, doctor_id
patient_documents        — id, patient_id, document_type, file_path, uploaded_by, notes
patient_vitals           — id, patient_id, bp_systolic, bp_diastolic, heart_rate, temperature, 
                            respiratory_rate, weight, height, bmi, recorded_at, recorded_by
```

### 2.3 Department & Doctor
```
departments              — id, name, slug, description, icon, status, display_order
doctors                  — id, user_id, department_id, specialization, qualification, experience_years, 
                            registration_no, consultation_fee_opd, consultation_fee_ipd, bio, status
doctor_schedules         — id, doctor_id, day_of_week, start_time, end_time, slot_duration, break_start, break_end
doctor_leaves            — id, doctor_id, start_date, end_date, reason, status
doctor_departments       — id, doctor_id, department_id (pivot for multi-department)
```

### 2.4 Appointment
```
appointments             — id, patient_id, doctor_id, department_id, appointment_date, start_time, end_time,
                            type (OPD/IPD/Online), status (pending/confirmed/checked-in/completed/cancelled),
                            token_number, reference_number, source (walkin/phone/online), notes, created_by
appointment_reminders    — id, appointment_id, sent_at, channel (SMS/Email), status
waitlist                 — id, patient_id, doctor_id, department_id, date, token_number, status
```

### 2.5 OPD
```
opd_registrations        — id, patient_id, appointment_id, token_number, check_in_time, vitals_id, status
consultations            — id, opd_registration_id, doctor_id, symptoms, diagnosis, icd_code, examination_notes,
                            consultation_time, follow_up_date
prescriptions            — id, consultation_id, patient_id, doctor_id, diagnosis, notes, created_at
prescription_items       — id, prescription_id, medicine_id, dosage, duration, frequency, instructions, quantity
```

### 2.6 IPD & Bed Management
```
ipd_admissions           — id, patient_id, doctor_id, bed_id, admission_date, admission_time, diagnosis,
                            admitting_doctor, admission_type (emergency/elective), status (admitted/transferred/discharged)
ipd_treatment_records    — id, admission_id, doctor_id, progress_notes, recorded_at
ipd_nursing_notes        — id, admission_id, nurse_id, notes, vitals_id, recorded_at
ipd_discharge_summary    — id, admission_id, discharge_date, discharge_diagnosis, treatment_summary,
                            follow_up_instructions, medications_at_discharge, doctor_id
ipd_diet_plan            — id, admission_id, diet_type, restrictions, meal_schedule, notes

beds                     — id, ward_id, bed_number, bed_type (ward/semi-private/private/ICU/NICU), 
                            status (available/occupied/maintenance/reserved), price_per_day, notes
wards                    — id, name, floor, department_id, bed_count, nursing_station
bed_transfers            — id, bed_id, admission_id, from_date, to_date, reason
```

### 2.7 Billing
```
bills                    — id, bill_number, patient_id, bill_type (OPD/IPD/Pharmacy/Lab), bill_date, 
                            subtotal, discount_percent, discount_amount, tax_percent, tax_amount,
                            total_amount, paid_amount, due_amount, status (pending/paid/partial/cancelled), notes
bill_items               — id, bill_id, item_type (consultation/test/medicine/procedure/room), item_id, 
                            item_name, quantity, rate, amount
payments                 — id, bill_id, amount, payment_date, payment_mode (cash/card/upi/bank), 
                            reference_number, received_by, notes
insurance_claims         — id, bill_id, insurance_provider, policy_number, claim_amount, approved_amount,
                            status (submitted/approved/rejected), claim_date, settlement_date
packages                 — id, name, description, price, validity_days, items (JSON), status
package_orders           — id, package_id, patient_id, order_date, appointment_id, status
```

### 2.8 Pharmacy
```
medicines                — id, name, generic_name, category, manufacturer, strength, form, unit, 
                            min_stock, max_stock, reorder_level, status
medicine_batches         — id, medicine_id, batch_number, expiry_date, mfg_date, purchase_price, selling_price,
                            quantity, supplier_id, received_date
purchase_orders          — id, supplier_id, order_date, expected_date, status, total_amount, notes
purchase_order_items     — id, po_id, medicine_id, quantity, unit_price, total_price
suppliers                — id, name, contact_person, phone, email, address, payment_terms, status
pharmacy_dispensings     — id, prescription_id, medicine_batch_id, quantity, dispensed_at, dispensed_by, notes
stock_movements          — id, medicine_id, batch_id, type (in/out/transfer/adjustment), quantity, reference_type,
                            reference_id, notes, created_by
```

### 2.9 Lab
```
lab_tests                — id, name, code, category, sample_type, price, turnaround_hours, status
lab_test_reference_ranges — id, lab_test_id, gender, age_min, age_max, min_value, max_value, unit
lab_orders               — id, patient_id, doctor_id, order_date, status (ordered/collected/processing/completed)
lab_order_items          — id, lab_order_id, lab_test_id, status, result_value, result_text, 
                            approved_by, approved_at, is_abnormal
lab_samples              — id, lab_order_id, sample_type, collection_date, collected_by, barcode, status
```

### 2.10 Radiology
```
imaging_tests            — id, name, code, modality_type, price, preparation_instructions, status
imaging_orders           — id, patient_id, doctor_id, test_id, order_date, clinical_history, status
imaging_results          — id, imaging_order_id, radiologist_id, findings, impression, report_text, 
                            report_date, images (JSON), status (draft/final)
imaging_schedule         — id, imaging_order_id, modality_room_id, scheduled_date, scheduled_time, status
modality_rooms           — id, name, modality_type, location, status
```

### 2.11 Blood Bank
```
blood_donors             — id, donor_id (patient), blood_group, rh_factor, last_donation_date, 
                            medical_screening_status, screening_results (JSON), status
blood_units              — id, donor_id, blood_group, rh_factor, component, collection_date, expiry_date,
                            volume_ml, status (available/issued/quarantined/expired/discarded)
cross_matching           — id, blood_unit_id, patient_id, compatibility_result, test_date, technician_id
blood_issues             — id, blood_unit_id, patient_id, doctor_id, issue_date, quantity, cross_match_id
transfusion_records      — id, blood_issue_id, start_time, end_time, vitals_before, vitals_after, 
                            adverse_reaction, nurse_id
blood_camps              — id, name, location, start_date, end_date, organizer, units_collected
```

### 2.12 OT
```
ot_rooms                 — id, name, floor, facilities (JSON), status (available/occupied/maintenance)
surgeries                — id, patient_id, doctor_id, ot_room_id, procedure_name, diagnosis, 
                            scheduled_date, start_time, end_time, status (requested/scheduled/in-progress/completed/cancelled)
surgery_team             — id, surgery_id, staff_id, role (surgeon/anesthesiologist/nurse/technician)
pre_op_checklist         — id, surgery_id, item_name, is_checked, checked_by, checked_at
intra_op_records         — id, surgery_id, procedure_notes, findings, anesthesia_type, anesthesia_notes,
                            implants_used (JSON), blood_loss, complications
post_op_recovery         — id, surgery_id, recovery_room, start_time, end_time, vitals, instructions
```

### 2.13 Emergency
```
er_triage                — id, patient_id, arrival_time, chief_complaint, acuity_level (red/yellow/green),
                            vital_signs (JSON), triage_by, triage_notes
er_registrations         — id, patient_id, triage_id, registration_time, mode_of_arrival (walkin/ambulance),
                            referring_hospital, status (in-treatment/admitted/discharged)
er_treatments            — id, er_registration_id, doctor_id, diagnosis, treatment, procedures, notes
er_dashboard             — derived view — real-time aggregate from er_registrations and triage
```

### 2.14 Inventory
```
inventory_items          — id, name, category, unit, min_stock, max_stock, reorder_level, status
inventory_batches        — id, item_id, batch_number, expiry_date, quantity, unit_price, supplier_id
stock_grn                — id, supplier_id, received_date, po_reference, notes, created_by
stock_grn_items          — id, grn_id, item_id, batch_number, quantity, unit_price, expiry_date
stock_issues             — id, department_id, issued_date, notes, issued_by
stock_issue_items        — id, stock_issue_id, item_id, batch_id, quantity
requisitions             — id, department_id, requested_by, request_date, status, approved_by, approved_date
requisition_items        — id, requisition_id, item_id, quantity, approved_quantity
assets                   — id, name, category, model, serial_number, purchase_date, warranty_until,
                            location, status, maintenance_schedule (JSON)
```

### 2.15 HR & Payroll
```
employees                — id, user_id, department_id, employee_code, designation, joining_date,
                            salary, bank_account, pan_number, documents (JSON), status
attendance               — id, employee_id, date, status (present/absent/leave/holiday), check_in, check_out
leaves                   — id, employee_id, leave_type (sick/casual/annual), start_date, end_date, 
                            reason, status (pending/approved/rejected), approved_by
payroll                  — id, employee_id, month, year, basic_pay, allowances (JSON), deductions (JSON),
                            gross_pay, net_pay, status (draft/paid)
employee_loans           — id, employee_id, amount, installments, monthly_deduction, status, balance
training_records         — id, employee_id, course_name, provider, start_date, end_date, certificate, expiry_date
```

### 2.16 CMS
```
cms_pages                — id, title, slug, content, meta_title, meta_description, og_image, template,
                            status (draft/published), published_at, created_by
cms_content_blocks       — id, name, type (hero/testimonial/feature/cta), title, subtitle, description,
                            image, link, display_order, status
cms_media                — id, name, file_path, type (image/video/document), mime_type, size, alt_text,
                            folder_id, uploaded_by
cms_media_folders        — id, name, parent_id
cms_menus                — id, name, location (header/footer), status
cms_menu_items           — id, menu_id, parent_id, title, url, page_id, target, display_order
cms_blog_posts           — id, title, slug, content, excerpt, featured_image, category_id, 
                            meta_title, meta_description, status, published_at, author_id
cms_blog_categories      — id, name, slug, description
cms_gallery_albums       — id, title, description, cover_image, status, display_order
cms_gallery_items        — id, album_id, media_id, caption, display_order
cms_events               — id, title, slug, description, start_date, end_date, location, type, status
cms_feedback             — id, patient_id, rating, title, message, status (pending/approved/rejected), created_at
cms_career_jobs          — id, title, department, location, type, description, requirements, status, expires_at
cms_job_applications     — id, job_id, name, email, phone, resume, cover_letter, status
```

### 2.17 Settings
```
settings                 — id, key, value, group (general/notification/integration)
```

## 3. BPR Workflow Diagrams

### 3.1 Patient Journey (Registration → Discharge)

```
Patient → [Reception] → Registered → [OPD] → Token → Doctor Consultation
                                                          │
                                                   ┌──────┴──────┐
                                                   ▼             ▼
                                              Lab Tests     Pharmacy
                                                   │             │
                                                   └──────┬──────┘
                                                          ▼
                                                     Diagnosis
                                                          │
                                          ┌───────────────┴───────────────┐
                                          ▼                               ▼
                                     OPD Treatment                  IPD Admission
                                          │                               │
                                     Prescription                  Bed Allocation
                                          │                               │
                                     Billing + Payment              Daily Treatment
                                          │                               │
                                     Discharge                      Discharge Summary
                                                                         │
                                                                    Bill Settlement
                                                                         │
                                                                    Discharge
```

### 3.2 Appointment to Consultation

```
Patient Books ──→ System Checks ──→ Available? ──Yes──→ Create Appointment
Appointment       Doctor Schedule                                    │
     │                                                         Send Confirmation
     │                                                            (SMS/Email)
     │                     ┌─────────────────────────────────────────┘
     │                     ▼
     │               Patient arrives
     │                     │
     ▼                     ▼
Phone Booking ──→ Reception Check-in
Walk-in        ──→ Generate Token
                     │
                     ▼
               Patient in Queue
                     │
                     ▼
               Doctor Calls
                     │
                     ▼
               Consultation
                     │
                     ▼
            Prescription/Follow-up
```

### 3.3 Emergency Triage

```
Patient Arrives (Walk-in/Ambulance)
         │
         ▼
   Triage Nurse Assessment
         │
    ┌────┴────┴────┬──────────────────┐
    ▼              ▼                  ▼
Red (Critical)  Yellow (Urgent)   Green (Non-urgent)
    │              │                  │
    ▼              ▼                  ▼
Immediate Care  Fast-track        Standard Care
    │           Registration       Registration
    ▼              │                  │
Parallel Regis- ──┘                  │
tration + Care                       │
    │                                │
    └──────────┬─────────────────────┘
               ▼
        Diagnostics/Treatment
               │
        ┌──────┴──────┐
        ▼             ▼
    Admit to      Discharge
    IPD/OT        with Follow-up
```

### 3.4 Lab Workflow

```
Doctor Orders Test → Order Created → Sample Label (Barcode) Printed
                                              │
                                              ▼
                                    Sample Collection (Phlebotomist)
                                              │
                                              ▼
                                    Lab Receives Sample
                                              │
                                              ▼
                                    Test Processing (Analyzer/Manual)
                                              │
                                              ▼
                                    Result Entry (Technician)
                                              │
                                              ▼
                                    Result Review & Approval (Pathologist)
                                              │
                                              ▼
                                    Report Published
                                              │
                                   ┌──────────┴──────────┐
                                   ▼                     ▼
                            Doctor View           Patient Portal
```

### 3.5 Billing Flow

```
Patient Visits → Services Rendered
                       │
                       ▼
             Services Recorded in System
                       │
                       ▼
             Bill Generated (Auto/Manual)
                       │
                  ┌────┴────┐
                  ▼         ▼
             Insurance    Self-pay
                  │         │
                  ▼         ▼
          Claim Submitted   Payment
                  │         │
            ┌─────┘    ┌────┴────┐
            ▼          ▼         ▼
        Approved    Cash     Card/UPI
            │          │         │
            ▼          ▼         ▼
     Insurance Payment Payment  Receipt
     + Patient Due   Recorded
            │
            ▼
     Balance Payment
```

## 4. Wireframe Layouts

### 4.1 Admin Panel Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [☰]  Hospital Name                      [🔔] [👤 Admin] [🚪] │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│ NAV      │  ┌─────────────────────────────────────────────┐    │
│          │  │  Dashboard / Content Area                     │    │
│ ──────── │  │                                                │    │
│ Dashboard│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │    │
│ Patients │  │  │ KPI  │ │ KPI  │ │ KPI  │ │ KPI  │        │    │
│ Doctors  │  │  │ Card │ │ Card │ │ Card │ │ Card │        │    │
│ Appoint. │  │  └──────┘ └──────┘ └──────┘ └──────┘        │    │
│ OPD      │  │                                                │    │
│ IPD      │  │  ┌──────────────────────────────────┐        │    │
│ Billing  │  │  │  Chart / Table                     │        │    │
│ Pharmacy │  │  │                                    │        │    │
│ Lab      │  │  └──────────────────────────────────┘        │    │
│ Blood Bk │  │                                                │    │
│ OT       │  │  ┌──────────────────────────────────┐        │    │
│ ER       │  │  │  Recent Activity / Alerts         │        │    │
│ Inventory│  │  │                                    │        │    │
│ HR       │  │  └──────────────────────────────────┘        │    │
│ Reports  │  │                                                │    │
│ CMS      │  │                                                │    │
│ Settings │  │                                                │    │
│          │  │                                                │    │
└──────────┴──────────────────────────────────────────────────────┘
```

### 4.2 Admin - Patient Registration Form

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Patients    [+ Add New Patient]     [Save] [Cancel] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─ Patient Information ───────────────────────────────────────┐ │
│ │ First Name    [________________]  Last Name [______________] │
│ │ Date of Birth [____-__-__]       Gender    [Male ▼]          │
│ │ Blood Group   [A+ ▼]             Phone     [______________] │
│ │ Email         [________________]                             │
│ │ Address       [____________________________________________] │
│ │ City          [____________]    State    [________________]  │
│ │ Pincode       [____________]                                │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─ Emergency Contact ──────────────────────────────────────────┐ │
│ │ Name   [________________]  Phone   [________________]        │ │
│ │ Relation [__________]                                        │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─ ID Proof ───────────────────────────────────────────────────┐ │
│ │ Type   [Aadhaar ▼]    Number  [________________]            │ │
│ │ Upload [Browse...]                                          │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─ Medical Info ───────────────────────────────────────────────┐ │
│ │ Allergies [________________________________________________] │ │
│ │ Notes     [________________________________________________] │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Public Website Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [🚑 Emergency: 1-XXX-XXX-XXXX]       24/7 Emergency Services   │
├─────────────────────────────────────────────────────────────────┤
│ [Logo]  Hospital Name                 [📞 Contact] [📍 Find Us] │
│                                                                  │
│ Home │ About │ Departments ▼ │ Doctors │ Appointments │ More ▼  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌── Hero Banner Slider (CMS Managed) ──────────────────────┐  │
│  │                                                           │  │
│  │     "Your Health, Our Priority"                           │  │
│  │     Leading Multi-Speciality Hospital                     │  │
│  │     [Book Appointment]  [Find a Doctor]                   │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── Stats Counter ──────────────────────────────────────────┐  │
│  │  [500+ Doctors]  [50+ Departments]  [10K+ Patients/Month] │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── Featured Departments ───────────────────────────────────┐  │
│  │  [Cardiology]  [Neurology]  [Orthopedics]  [Pediatrics]   │  │
│  │  [Oncology]    [ENT]        [Ophthalmology] [Dental]      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── Testimonials ───────────────────────────────────────────┐  │
│  │  "Excellent care and treatment" — Patient Name            │  │
│  │  "Highly skilled doctors"       — Patient Name            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── Latest News/Events ─────────────────────────────────────┐  │
│  │  • Free Health Camp on June 30                            │  │
│  │  • New MRI Machine Installed                              │  │
│  │  • CME Program on Cardiology                              │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ Footer: Links | Contact | Social Media | Newsletter Signup      │
│ © 2026 Hospital Name. All rights reserved.                      │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Appointment Booking Flow (Public)

```
Step 1: Select Department              Step 2: Select Doctor
┌──────────────────────┐              ┌──────────────────────┐
│ Cardiology       [→] │              │ Dr. John Smith       │
│ Neurology        [→] │              │  MBBS, MD, DM Cardio │
│ Orthopedics      [→] │              │  Available: Mon-Fri  │
│ Pediatrics      [→]  │              │  ⭐ 4.8 (120 reviews)│
│ ENT              [→] │              │                      │
└──────────────────────┘              │ Dr. Sarah Lee        │
                                      │  MBBS, MD Cardio     │
Step 3: Select Date & Time            │  Available: Mon-Sat  │
┌──────────────────────┐              └──────────────────────┘
│ June 2026            │
│ Su Mo Tu We Th Fr Sa │              Step 4: Your Details
│       1  2  3  4  5  │              ┌──────────────────────┐
│  6  7  8  9 10 11 12 │              │ Name    [_________] │
│ 13 14 15 16 17 18 19 │              │ Phone   [_________] │
│ 20 21 22 23 24 25 26 │              │ Email   [_________] │
│ 27 28 29 30          │              │ Notes   [_________] │
│                      │              └──────────────────────┘
│ Available Slots:     │
│ □ 09:00  □ 09:30     │              Step 5: Confirm
│ □ 10:00  □ 10:30     │              ┌──────────────────────┐
│ □ 11:00  □ 11:30     │              │ ✓ Appointment Booked │
│                      │              │ Ref: AP-2026-06234   │
│                      │              │ Dr. John Smith       │
│                      │              │ Mon, 22 Jun 2026     │
│                      │              │ 10:00 AM             │
│                      │              │                      │
│                      │              │ SMS sent to 98XXXXX  │
│                      │              └──────────────────────┘
└──────────────────────┘
```

### 4.5 Dashboard (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard                                    [Today ▼] [↻]    │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ │
│ │ 🏥 Beds │ │ 📅 Appts│ │ 💰 Today│ │ 👥 Total │ │ ⏳ Pending│ │
│ │ 145/200 │ │ 48 today│ │ ₹85,000│ │ Patients│ │ Lab: 12  │ │
│ │  72%    │ │ 12 pend │ │         │ │ 15,432  │ │          │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └──────────┘ │
│                                                                  │
│ ┌── Monthly Revenue ───────────┐ ┌── Appointments Today ─────┐ │
│ │                              │ │ ┌──────────────────────┐ │ │
│ │  ₹500K ┤╱╲                   │ │ │ Doctor       #      │ │ │
│ │  ₹400K ┤  ╲╱╲                 │ │ │ Dr. Smith   12     │ │ │
│ │  ₹300K ┤    ╲╱                 │ │ │ Dr. Lee     8      │ │ │
│ │  ₹200K ┤                     │ │ │ Dr. Patel   6      │ │ │
│ │  ₹100K ┤                     │ │ └──────────────────────┘ │ │
│ │      Jan Feb Mar Apr May Jun │ │                          │ │
│ └──────────────────────────────┘ └──────────────────────────┘ │
│                                                                  │
│ ┌── Recent Appointments ─────────────────────────────────────┐ │
│ │ Time │ Patient        │ Doctor        │ Status             │ │
│ │ 09:00│ Ram Sharma     │ Dr. Smith     │ ✅ Checked-in     │ │
│ │ 09:30│ Sita Patel     │ Dr. Lee       │ ⏳ Waiting         │ │
│ │ 10:00│ Anil Gupta     │ Dr. Smith     │ ❌ Cancelled       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌── Alerts ───────────────────────────────────────────────────┐ │
│ │ ⚠ Pharmacy: Paracetamol below reorder level                │ │
│ │ ⚠ Blood Bank: O-ve stock critical (2 units)                │ │
│ │ ⚠ 5 beds in maintenance                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Route Structure

```
# Admin Routes (prefix: /admin)
/admin/dashboard
/admin/patients/{action?}
/admin/doctors/{action?}
/admin/appointments/{action?}
/admin/opd/{action?}
/admin/ipd/{action?}
/admin/beds/{action?}
/admin/billing/{action?}
/admin/pharmacy/{action?}
/admin/lab/{action?}
/admin/radiology/{action?}
/admin/blood-bank/{action?}
/admin/ot/{action?}
/admin/emergency/{action?}
/admin/inventory/{action?}
/admin/hr/{action?}
/admin/reports/{action?}
/admin/users/{action?}
/admin/cms/{action?}
/admin/settings/{action?}

# Public Routes
/                       → Home
/about                  → About Us
/departments            → Department listing
/departments/{slug}     → Department detail
/doctors                → Doctor directory
/doctors/{id}           → Doctor profile
/appointments           → Online booking
/appointments/confirm   → Booking confirmation
/patient-portal         → Patient login
/patient-portal/{action}→ Dashboard, history, reports
/blog                   → Blog listing
/blog/{slug}            → Blog detail
/gallery                → Photo/video gallery
/events                 → Events & news
/contact                → Contact form
/careers                → Job listings
/careers/{id}/apply     → Job application
/health-packages        → Package listing
/emergency              → Emergency info
/feedback               → Feedback form
```

## 6. Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Backend Framework | Laravel 11.x |
| Frontend | Blade + Bootstrap 5 / Tailwind CSS 3 |
| Database | MySQL 8+ (InnoDB) |
| Authentication | Laravel Breeze/Jetstream |
| Authorization | Spatie Laravel Permission |
| Queue | Laravel Queue (database driver) |
| Cache | Laravel Cache (file/database) |
| Email | Laravel Mail (SMTP) |
| SMS | Laravel Notification + Provider SDK |
| Charts | Chart.js / ApexCharts |
| PDF | DomPDF / Barryvdh DomPDF |
| Export | Laravel Excel (Maatwebsite) |
| Barcode | Picqer PHP Barcode Generator |
