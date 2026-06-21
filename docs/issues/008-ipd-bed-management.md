## What to build

Inpatient (IPD) management with bed management — full admission-to-discharge workflow.

1. **Admission** — Admit patient from OPD/ER: select bed, admitting doctor, diagnosis, admission notes
2. **Bed Management Dashboard** — Real-time view of all beds (ward, semi-private, private, ICU, NICU) with status (available, occupied, maintenance, reserved)
3. **Bed Allocation & Transfer** — Assign patient to bed, transfer between beds/wards
4. **Daily Treatment Records** — Progress notes, vitals, medications, investigations ordered
5. **Nursing Care** — Nursing notes, input/output charting, care plan
6. **Diet Management** — Diet plan per patient (type, restrictions, schedule)
7. **Discharge Planning** — Expected discharge date, discharge summary, follow-up instructions
8. **Discharge** — Finalize discharge, generate discharge summary PDF, free bed
9. **Admission Forecast** — Pending admissions vs available beds

## Acceptance criteria

- [ ] Patient can be admitted with bed allocation in one workflow
- [ ] Bed dashboard shows real-time occupancy with color coding (green=available, red=occupied, yellow=maintenance)
- [ ] Daily treatment notes can be added by doctors and nurses
- [ ] Discharge generates PDF summary and frees bed
- [ ] Bed occupancy reports show historical trends

## Blocked by

#4 (Patient Management)
