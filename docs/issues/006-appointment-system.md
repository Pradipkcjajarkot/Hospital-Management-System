## What to build

Appointment booking system (admin-side) for walk-in, phone, and online-originated appointments.

1. **Book Appointment** — Select department → doctor → date → time slot → patient (search/select)
2. **Calendar View** — Day/week/month views showing booked slots
3. **Status Management** — Pending → Confirmed → Checked-in → Completed → Cancelled
4. **Waitlist** — Queue management with token system for walk-ins
5. **Reschedule/Cancel** — Change appointment with notification trigger
6. **SMS/Email Reminders** — Automated reminders X hours before appointment
7. **Doctor Availability Check** — Real-time check during booking
8. **Appointment History** — Per patient appointment timeline

## Acceptance criteria

- [ ] Walk-in patient appointment can be booked in under 30 seconds
- [ ] Calendar shows doctor-wise appointments with color-coded statuses
- [ ] Doctors see only their own appointments
- [ ] Cancelled appointments free the slot
- [ ] SMS reminder sent automatically (queue-based)
- [ ] Receptionist can check-in patient, updating status

## Blocked by

#4 (Patient Management), #5 (Doctor Management)
