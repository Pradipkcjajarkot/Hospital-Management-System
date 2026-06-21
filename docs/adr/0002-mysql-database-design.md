# ADR 0002: MySQL Database Design Approach

## Status
Accepted

## Context
The system handles complex healthcare data relationships:
- Patients ↔ Appointments ↔ Doctors ↔ Departments
- IPD admissions ↔ Bed allocation ↔ Treatment records
- Billing ↔ Services ↔ Insurance claims
- Pharmacy ↔ Inventory ↔ Prescriptions
- Lab tests ↔ Orders ↔ Results

## Decision
Use **MySQL with InnoDB engine** for the primary database.

Key design principles:
- **EAV (Entity-Attribute-Value)** only where truly needed (patient vitals, lab test results)
- **Normalized schema** up to 3NF for transactional data (appointments, billing, inventory)
- **Soft deletes** for all patient and medical records (regulatory compliance)
- **UUID primary keys** for externally-referenced entities (patients, appointments) to avoid enumeration attacks
- **Auto-increment IDs** for internal entities (logs, audit trails)
- **JSON columns** for flexible metadata (doctor schedules, test configurations)
- **Composite indexes** on frequently queried patterns (patient_id + created_at, doctor_id + appointment_date)

## Consequences
- MySQL is well-supported by Laravel with first-class migrations
- InnoDB provides ACID compliance for financial transactions
- UUIDs in URLs prevent data leakage through sequential IDs
- JSON columns provide flexibility without full EAV complexity
