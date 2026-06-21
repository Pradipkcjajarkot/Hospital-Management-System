## What to build

Outpatient Department (OPD) workflow — the core clinical flow for non-admitted patients.

1. **OPD Token System** — Generate queue token on check-in, display on waiting screen
2. **Doctor Consultation Screen** — Doctor sees patient queue, calls next patient
3. **Prescription Management** — Add medicines, dosage, duration, instructions; print prescription
4. **Diagnosis Recording** — Symptoms, examination notes, diagnosis (ICD code optional)
5. **Follow-up Scheduling** — Book follow-up appointment from consultation screen
6. **OPD Statistics** — Daily patient count, average consultation time, department-wise OPD stats
7. **Vitals Recording** — BP, temperature, pulse, height, weight, BMI

## Acceptance criteria

- [ ] Patient checked-in gets a token number displayed on screen
- [ ] Doctor can view queue and "call next" patient
- [ ] Prescription with medicines, dosage, instructions can be created and printed
- [ ] Follow-up booked without leaving consultation screen
- [ ] OPD stats show daily/weekly/monthly trends

## Blocked by

#6 (Appointment System)
