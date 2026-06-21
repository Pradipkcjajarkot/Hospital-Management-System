## What to build

Emergency Room (ER) management — triage and fast-track emergency care.

1. **Triage Assessment** — Acuity scoring (Red/Yellow/Green) based on vitals and symptoms
2. **Fast-track Registration** — Minimal registration (name, age, complaint) for critical patients, full details later
3. **ER Dashboard** — Real-time view of all ER patients with acuity, wait time, status
4. **Emergency Team Alert** — Auto-notify relevant departments (cardiac, trauma, neuro) based on triage
5. **Trauma Bay Allocation** — Assign bed/bay in ER
6. **ER Workflow** — Triage → Treatment → Admission to IPD/OT or Discharge
7. **ER Statistics** — Arrival-to-treatment time, patient volume trends, acuity distribution

## Acceptance criteria

- [ ] Critical patient can be registered with just name and complaint in under 30 seconds
- [ ] Triage assigns acuity level with color coding on dashboard
- [ ] ER wait time displayed on public panel
- [ ] Patient transfer to IPD/OT creates admission/surgery request
- [ ] ER stats show average arrival-to-treatment time

## Blocked by

#4 (Patient Management)
