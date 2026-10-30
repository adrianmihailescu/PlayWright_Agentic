# Playwright Test Report

## Run identification

- **Run ID:** `tasks-api-20261030T143841-383257d4`
- **Command:** `npx playwright test` (run from `e2e`)
- **Testing handoff command window:** 2026-10-30 14:38:36–14:38:47 CEST
- **Playwright JSON start:** 2026-10-30 12:38:38.428 UTC
  (**2026-10-30 14:38:38.428 CEST**)
- **Playwright elapsed duration:** 8,609.398 ms (8.609 s)
- **End derived from JSON start + elapsed duration:** 2026-10-30 14:38:47.037 CEST
- **Result:** 2 passed, 0 failed, 0 skipped

The handoff command window and the JSON start/end are different timing
boundaries; exact execution timing and results below are taken from the
selected run's Playwright JSON. The run did not record retries, flaky results,
or errors.

Sources: [Playwright JSON results](../results/tasks-api-20261030T143841-383257d4.json) ·
[console output](../console/tasks-api-20261030T143841-383257d4.log) ·
[Playwright HTML report](playwright-report/index.html).

## Test results

| Test | Status | Test duration |
|---|---:|---:|
| creates, completes, and reloads tasks | Passed | 2.102 s |
| rejects an empty task title without creating a task | Passed | 1.084 s |
| **Total** | **2 passed / 0 failed / 0 skipped** | **8.609 s overall elapsed** |

The overall Playwright elapsed duration includes run overhead and is not the
sum of the two individual test durations.

## Playwright-captured screenshots

- Application loaded: [task manager](../screenshots/tasks-api-20261030T143841-383257d4-task-manager.png)
- Task creation: [tasks created](../screenshots/tasks-api-20261030T143841-383257d4-tasks-created.png)
- Task completion: [tasks completed](../screenshots/tasks-api-20261030T143841-383257d4-tasks-completed.png)
- Reload verification: [tasks after reload](../screenshots/tasks-api-20261030T143841-383257d4-tasks-after-reload.png)
- Empty-title validation: [validation state](../screenshots/tasks-api-20261030T143841-383257d4-empty-title-validation.png)

All five links point to the selected run's captured screenshots in
`e2e/artifacts/20261030/screenshots/`. No screenshot has been substituted or
generated for this report.

## Failures and traces

The selected run has no failed tests, so it has no failure details or failure
traces. Its run-local `test-output/` contains `.last-run.json`; no trace was
retained for this successful run. Console output and result JSON are linked
above.

## Separate same-date runs and observed issue

The following results are separate from this report's totals:

- Baseline `tasks-api-20261030T143825-b34656cd`: 2 passed / 0 failed /
  0 skipped; 8,028.626 ms overall elapsed. [JSON](../results/tasks-api-20261030T143825-b34656cd.json) ·
  [console](../console/tasks-api-20261030T143825-b34656cd.log).
- Headed diagnostic `tasks-api-20261030T144015-headed`: 0 passed / 2 failed /
  0 skipped; 9,880.963 ms. Both failures were at the final `consoleErrors`
  assertion after a browser resource 404; the Testing handoff identifies the
  resource as `http://localhost:5174/favicon.ico`. Task-flow/validation
  assertions had been reached before the final console check.
  [JSON](../results/tasks-api-20261030T144015-headed.json) ·
  [console output](../console/tasks-api-20261030T144015-headed.log) ·
  [create/complete/reload error context](../tasks-api-20261030T144015-headed/test-output/tasks-creates-completes-and-reloads-tasks-chromium/error-context.md) ·
  [create/complete/reload trace](../tasks-api-20261030T144015-headed/test-output/tasks-creates-completes-and-reloads-tasks-chromium/trace.zip) ·
  [empty-title error context](../tasks-api-20261030T144015-headed/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/error-context.md) ·
  [empty-title trace](../tasks-api-20261030T144015-headed/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/trace.zip).
- Debug diagnostic `tasks-api-20261030T144245-debug`: 0 passed / 1 failed /
  0 skipped; 16,556.144 ms. The empty-title test failed the same final
  console-error assertion after a 404 message.
  [JSON](../results/tasks-api-20261030T144245-debug.json) ·
  [console output](../console/tasks-api-20261030T144245-debug.log) ·
  [error context](../tasks-api-20261030T144245-debug/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/error-context.md) ·
  [trace](../tasks-api-20261030T144245-debug/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/trace.zip).

Testing also reported a separate UI attempt,
`tasks-api-20261030T144045-ui`, which exited before tests because the configured
`webServer` process exited with code 1. No matching artifact was retained in
the date tree; this outcome is from the Testing handoff and could not be
independently verified from a run result or console artifact.

The favicon 404 is an observed issue in the separate diagnostic runs, not a
failure of the selected successful run. Its cause and broader impact are not
established. No fix, verified post-fix result, or controlled defect
simulation is evidenced. See the [date-level defect notes](../bug-report.md)
for preserved history and the latest evidence update.

## Unresolved issues and limitations

- The favicon resource 404 remains unresolved; no fix or post-fix test evidence
  was supplied.
- The selected successful run has no retained trace.
- The separate UI attempt has no matching retained artifact in the date tree;
  its result is documented from the Testing handoff only.

## Report files

- [Markdown report](test-report.md)
- [PDF report](test-report.pdf)
