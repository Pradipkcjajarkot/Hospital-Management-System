## What to build

Pharmacy management — inventory, dispensing, and purchase management.

1. **Drug Catalog** — Medicine master: name, generic name, brand, category, strength, form, manufacturer
2. **Inventory Management** — Stock-in (GRN), stock-out, current stock, batch/lot tracking, expiry date tracking
3. **Supplier Management** — Supplier master, contact, payment terms, supply history
4. **Purchase Orders** — Create PO, send to supplier, receive goods, update inventory
5. **Prescription Dispensing** — View pending prescriptions, dispense medicines, update inventory
6. **Low Stock Alerts** — Automatic alert when stock falls below minimum level
7. **Expiry Tracking** — List of near-expiry and expired medicines
8. **Stock Reports** — Fast/slow moving items, stock valuation, expiry report

## Acceptance criteria

- [ ] Drug catalog with search by name/generic/category
- [ ] Stock-in from purchase order updates inventory quantity and batch
- [ ] Dispensing reduces stock and records batch number
- [ ] Low stock triggers highlighted alert on dashboard
- [ ] Expired medicines flagged and not dispensible

## Blocked by

#4 (Patient Management)
