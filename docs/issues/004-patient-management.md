## What to build

Patient management module covering registration through full lifecycle.

1. **Patient Registration** — Form with demographics, contact, emergency contact, blood group, allergies, ID proof upload
2. **Unique Patient ID** — Auto-generated (e.g., HOSP-YYYY-XXXXX) with barcode
3. **Patient Search** — Search by name, phone, patient ID, with advanced filters
4. **Patient Profile** — Comprehensive view with timeline of visits, admissions, bills
5. **Medical History** — Past diagnoses, surgeries, allergies, medications, family history
6. **Document Management** — Upload/view/delete patient documents (reports, prescriptions, ID)
7. **Merge Duplicates** — Merge two patient records into one with audit trail
8. **Export** — Patient list export to PDF/Excel

## Acceptance criteria

- [ ] Admin/Receptionist can register a new patient with all required fields
- [ ] Unique Patient ID generated and displayed as barcode
- [ ] Search returns results by name/phone/ID within 2 seconds
- [ ] Patient profile shows timeline of all interactions
- [ ] Duplicate detection on registration (matching name + phone)
- [ ] Documents can be uploaded and viewed

## Blocked by

#1 (Project Scaffolding)
