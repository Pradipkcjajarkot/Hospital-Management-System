## What to build

Operation Theater management — surgery scheduling and surgical records.

1. **OT Room Management** — Room master with facilities and equipment list
2. **Surgery Request** — Doctor requests surgery for patient with diagnosis, proposed procedure
3. **Surgery Scheduling** — Assign OT room, date, time slot, surgeon, anesthesiologist, nursing team
4. **Pre-operative Checklist** — Consent, lab results, fasting, pre-medication
5. **Intra-operative Records** — Procedure notes, findings, implants used, anesthesia records
6. **Post-operative Recovery** — Recovery room, vitals monitoring, post-op instructions
7. **Surgery Inventory** — Track implants, consumables used during surgery (deduct from inventory)
8. **OT Schedule** — Daily/weekly calendar view of scheduled surgeries

## Acceptance criteria

- [ ] Surgery can be requested and scheduled in available OT room/time
- [ ] Conflicts detected when scheduling same room/time
- [ ] Pre-op checklist must be completed before surgery can start
- [ ] Implants/consumables used auto-deduct from inventory
- [ ] OT schedule shows all surgeries for the day

## Blocked by

#4 (Patient Management), #5 (Doctor Management)
