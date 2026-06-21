## What to build

Laboratory management module — test catalog, order workflow, and results reporting.

1. **Test Catalog** — Manage lab tests with name, code, category, sample type, reference ranges, price
2. **Lab Order Entry** — Doctor orders tests for a patient (from OPD/IPD), prints barcode label
3. **Sample Collection** — Mark sample collected, track collection time, link to barcode
4. **Result Entry** — Lab technician enters results (numeric, text, dropdown), marks abnormal values
5. **Result Approval** — Pathologist reviews and approves results
6. **Report Generation** — PDF report with patient info, test results, reference ranges, abnormal flags
7. **Patient Lab History** — View all past test results in timeline/comparison view
8. **External Lab** — Send tests to external lab, receive and import results

## Acceptance criteria

- [ ] Doctor can order lab tests from OPD/IPD consultation screen
- [ ] Barcode label prints with patient ID and test code
- [ ] Lab technician enters results, system flags abnormal values
- [ ] Approved results appear on patient portal and doctor's view
- [ ] PDF report is professional and print-ready

## Blocked by

#4 (Patient Management)
