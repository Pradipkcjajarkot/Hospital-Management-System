## What to build

System settings and integration configuration.

1. **Hospital Profile** — Hospital name, logo, address, phone, email, social media links, TIN/registration numbers
2. **System Configuration** — Date format, timezone, currency, language (English), business hours
3. **Notification Settings** — SMS and email configuration (provider API keys, sender ID, templates)
4. **Email Templates** — Manage email content for appointment confirmation, reminders, billing
5. **SMS Templates** — Manage SMS content for reminders, alerts, OTP
6. **Backup Configuration** — Automated database backup schedule, retention policy
7. **System Logs** — View application logs, login history, audit trail
8. **Module Toggle** — Enable/disable modules from the menu
9. **Audit Trail Viewer** — Searchable log of all critical data changes (who, what, when)
10. **Cache Management** — Clear cache from admin panel

## Acceptance criteria

- [ ] Hospital profile renders on bills, reports, and public site
- [ ] SMS and email send successfully with configured provider
- [ ] Email/SMS templates editable from admin
- [ ] Database backup runs on schedule
- [ ] Audit trail shows data changes with user info and timestamp

## Blocked by

#1 (Project Scaffolding)
