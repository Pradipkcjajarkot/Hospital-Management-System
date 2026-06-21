## What to build

Public-facing online appointment booking system on the website.

1. **Booking Flow** — Step 1: Select Department → Step 2: Select Doctor (with profile) → Step 3: Select Date & Time (show available slots) → Step 4: Patient Details (name, phone, email) → Step 5: Confirmation
2. **Real-time Availability** — Query doctor's schedule and existing appointments to show free slots
3. **Captcha** — Prevent spam bookings
4. **Confirmation** — Show booking reference; send SMS/email confirmation
5. **Cancel/Reschedule** — Patient can cancel/reschedule using reference number and phone
6. **Admin Notification** — Admin notified of new booking
7. **Department & Doctor List** — Integrated with public doctor directory

## Acceptance criteria

- [ ] Complete booking flow works in under 5 steps
- [ ] Only available time slots shown (booked slots hidden)
- [ ] Confirmation SMS/email sent with reference number
- [ ] Cancel/reschedule works with reference + phone verification
- [ ] Booking appears in admin appointment system automatically

## Blocked by

#6 (Appointment System), #3 (Public Layout)
