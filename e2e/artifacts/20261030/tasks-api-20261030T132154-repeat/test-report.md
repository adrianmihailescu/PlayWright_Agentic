# Playwright Test Report

## Run identification

- **Run ID:** `tasks-api-20261030T132154-repeat`
- **Playwright JSON start time:** 2026-10-30 11:21:55.682 UTC
  (2026-10-30 13:21:55.682 CEST)
- **Execution window from Testing handoff:** 2026-10-30 13:21:54–13:22:03
- **Playwright elapsed duration:** 7,976.071 ms (7.976 s)
- **Result:** 2 passed, 0 failed, 0 skipped

Source files: [Playwright JSON results](../results/tasks-api-20261030T132154-repeat.json) ·
[console output](../console/tasks-api-20261030T132154-repeat.log).

## Test results

| Test | Status | Duration |
|---|---:|---:|
| creates, completes, and reloads tasks | Passed | 2.673 s |
| rejects an empty task title without creating a task | Passed | 1.696 s |
| **Total** | **2 passed / 0 failed / 0 skipped** | **7.976 s** |

Durations and statuses are from the selected run's Playwright JSON; the console
log independently reports both tests passed (rounded to 2.7 s and 1.7 s).

## Playwright-captured screenshots

- Application loaded: [task manager](../screenshots/tasks-api-20261030T132154-repeat-task-manager.png)
- Task creation: [tasks created](../screenshots/tasks-api-20261030T132154-repeat-tasks-created.png)
- Task completion: [tasks completed](../screenshots/tasks-api-20261030T132154-repeat-tasks-completed.png)
- Reload verification: [tasks after reload](../screenshots/tasks-api-20261030T132154-repeat-tasks-after-reload.png)
- Empty-title validation: [validation state](../screenshots/tasks-api-20261030T132154-repeat-empty-title-validation.png)

All five linked files were verified to exist under
`e2e/artifacts/20261030/screenshots/`.

## Failures and traces

No failures were reported in this run. No run-specific trace files were
present in `test-output`; the
directory contains only Playwright's `.last-run.json` metadata. This successful
run therefore has no failure trace to link.

## Defects and unresolved issues

No defect was reported by the selected successful repeat run's results.
Separately, headed diagnostic run
`tasks-api-20261030T132256-headed-traced` recorded 0 passed / 2 failed / 0
skipped (6.717 s). Its final console-error assertions observed a resource 404;
the Testing handoff identifies the URL as
`http://localhost:5174/favicon.ico`. This is a separate-run observation and is
not included in this report's selected-run totals. No fix or post-fix
verification is claimed.

- [Separate headed-run JSON](../results/tasks-api-20261030T132256-headed-traced.json)
- [Separate headed-run console output](../console/tasks-api-20261030T132256-headed-traced.log)
- [Create/complete/reload failure context](../tasks-api-20261030T132256-headed-traced/test-output/tasks-creates-completes-and-reloads-tasks-chromium/error-context.md)
- [Create/complete/reload trace](../tasks-api-20261030T132256-headed-traced/test-output/tasks-creates-completes-and-reloads-tasks-chromium/trace.zip)
- [Empty-title failure context](../tasks-api-20261030T132256-headed-traced/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/error-context.md)
- [Empty-title trace](../tasks-api-20261030T132256-headed-traced/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/trace.zip)
- [Historical defect notes](../bug-report.md), which keeps findings from distinct runs separate.

The Testing handoff also notes that interactive UI selection and debugger
stepping were not completed. They are limitations, not results of this run.
