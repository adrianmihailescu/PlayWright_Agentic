# Playwright Test Report

## Run identification

- **Run ID:** `tasks-api-20261030T135953-8046ed91`
- **Command:** `npx playwright test` (run from `e2e`)
- **Playwright JSON start:** 2026-10-30 11:59:55.410 UTC
  (2026-10-30 13:59:55.410 CEST)
- **Playwright elapsed duration:** 8,413.616 ms (8.414 s)
- **End derived from JSON start + elapsed duration:** 2026-10-30 14:00:03.824 CEST
- **Result:** 2 passed, 0 failed, 0 skipped

The Testing handoff gave a rounded execution window of 13:59:53–14:00:03
CEST, while the JSON's exact start is 13:59:55.410 CEST (2.410 seconds
later); its elapsed duration implies an end at 14:00:03.824 CEST. This report
uses the exact JSON timestamp and duration as the source of truth. The
run-ID's `13:59:53` token is not the JSON `stats.startTime`.

Sources: [Playwright JSON results](../results/tasks-api-20261030T135953-8046ed91.json) ·
[console output](../console/tasks-api-20261030T135953-8046ed91.log).
The console independently records both tests passed (rounded total 8.4 s).

## Test results

| Test | Status | Duration |
|---|---:|---:|
| creates, completes, and reloads tasks | Passed | 2.094 s |
| rejects an empty task title without creating a task | Passed | 1.148 s |
| **Total** | **2 passed / 0 failed / 0 skipped** | **8.414 s** |

Durations and totals are from the selected run's Playwright JSON; no retries,
flaky results, or failures were recorded.

## Playwright-captured screenshots

- Application loaded: [task manager](../screenshots/tasks-api-20261030T135953-8046ed91-task-manager.png)
- Task creation: [tasks created](../screenshots/tasks-api-20261030T135953-8046ed91-tasks-created.png)
- Task completion: [tasks completed](../screenshots/tasks-api-20261030T135953-8046ed91-tasks-completed.png)
- Reload verification: [tasks after reload](../screenshots/tasks-api-20261030T135953-8046ed91-tasks-after-reload.png)
- Empty-title validation: [validation state](../screenshots/tasks-api-20261030T135953-8046ed91-empty-title-validation.png)

All five screenshot files were verified under
`e2e/artifacts/20261030/screenshots/`.

## Failures and traces

The selected run had no test failures and no failure traces. Its
`test-output/` directory contains only `.last-run.json`; no selected-run trace
or failure context is available.

## Observed issue and separate same-date runs

The selected successful run did not report a console error or observe the
resource issue below. Separate same-date runs are not included in its totals:

- Baseline `tasks-api-20261030T135933-371a19e6`: 2 passed / 0 failed /
  0 skipped (12.635 s, per its JSON).
- Headed run `tasks-api-20261030T140017-25c8fb85`: 0 passed / 2 failed /
  0 skipped (9.909 s). Both tests reached their final `consoleErrors` checks
  and failed on a console message reporting a resource 404 (Not Found). The
  Testing handoff identifies the requested resource as
  `http://localhost:5174/favicon.ico`; no fix or post-fix verification is
  evidenced.

Evidence for the separate headed run:

- [Playwright JSON](../results/tasks-api-20261030T140017-25c8fb85.json)
- [Console output](../console/tasks-api-20261030T140017-25c8fb85.log)
- [Create/complete/reload error context](../tasks-api-20261030T140017-25c8fb85/test-output/tasks-creates-completes-and-reloads-tasks-chromium/error-context.md)
- [Create/complete/reload trace](../tasks-api-20261030T140017-25c8fb85/test-output/tasks-creates-completes-and-reloads-tasks-chromium/trace.zip)
- [Empty-title error context](../tasks-api-20261030T140017-25c8fb85/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/error-context.md)
- [Empty-title trace](../tasks-api-20261030T140017-25c8fb85/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/trace.zip)
- [Date-level defect notes](../bug-report.md)

## Unresolved issues and limitations

- The favicon/resource 404 is an observed issue in the separate headed run;
  its cause and broader impact are not established here. No fix or
  post-fix test evidence exists, so it remains unresolved.
- Interactive test selection and debugger inspection were not completed.
  Testing reported no production-code or Playwright-test edits. No controlled
  defect simulation was performed.

## Report files

- [Markdown report](test-report.md)
- [PDF report](test-report.pdf)
