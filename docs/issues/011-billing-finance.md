## What to build

Billing & finance module covering all revenue streams.

1. **OPD Billing** — Consultation fee, lab tests, pharmacy, procedures — consolidated OPD bill
2. **IPD Billing** — Room charges, doctor visits, procedures, medicines, consumables — daily/MIS bill
3. **Payment Collection** — Cash, card, UPI, bank transfer — record and reconcile
4. **Discount & Concession** — Percentage/flat discount with approval workflow
5. **Refund Processing** — Partial/full refund with reason, approval
6. **Package Management** — Health checkup packages with fixed price and included services
7. **Tax Configuration** — GST/VAT rate configuration per service/item
8. **Financial Reports** — Daily collection, monthly revenue, department-wise revenue, pending payments
9. **Bill Format** — Professional print-ready bill with hospital logo, TIN, break down

## Acceptance criteria

- [ ] OPD bill auto-generates from consultation + ordered tests/medicines
- [ ] Multiple payment modes supported in one transaction
- [ ] Package billing applies package price instead of individual item prices
- [ ] Daily collection report matches actual payments received
- [ ] Refund updates financial records correctly

## Blocked by

#4 (Patient Management), #5 (Doctor Management)
