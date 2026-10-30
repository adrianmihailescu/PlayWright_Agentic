# Playwright Test Report

## Run identification

- **Run ID:** `tasks-api-20261030T141804-bc37c161`
- **Command:** `npx playwright test` (run from `e2e`)
- **Testing handoff command window:** 2026-10-30 14:18:04.920–14:18:14.213 CEST
- **Playwright JSON start:** 2026-10-30 12:18:06.686 UTC
  (**14:18:06.686 CEST**)
- **Playwright elapsed duration:** 7,445.589 ms (7.446 s)
- **End derived from JSON start + elapsed duration:** 2026-10-30 14:18:14.132 CEST
- **Result:** 2 passed, 0 failed, 0 skipped

The handoff's command window and the JSON's Playwright start/duration describe
different timing boundaries. The test names, statuses, durations, totals, and
JSON timestamp below are taken from the exact selected run's JSON.

Sources: [Playwright JSON results](../results/tasks-api-20261030T141804-bc37c161.json) ·
[console output](../console/tasks-api-20261030T141804-bc37c161.log) ·
[Playwright HTML report](playwright-report/index.html).

## Test results

| Test | Status | Duration |
|---|---:|---:|
| creates, completes, and reloads tasks | Passed | 1.954 s |
| rejects an empty task title without creating a task | Passed | 1.029 s |
| **Total** | **2 passed / 0 failed / 0 skipped** | **7.446 s** |

No flaky results, retries, or errors were recorded in the selected run.

## Playwright-captured screenshots

- Application loaded: [task manager](../screenshots/tasks-api-20261030T141804-bc37c161-task-manager.png)
- Task creation: [tasks created](../screenshots/tasks-api-20261030T141804-bc37c161-tasks-created.png)
- Task completion: [tasks completed](../screenshots/tasks-api-20261030T141804-bc37c161-tasks-completed.png)
- Reload verification: [tasks after reload](../screenshots/tasks-api-20261030T141804-bc37c161-tasks-after-reload.png)
- Empty-title validation: [validation state](../screenshots/tasks-api-20261030T141804-bc37c161-empty-title-validation.png)

The five listed screenshots exist under
`e2e/artifacts/20261030/screenshots/`. The creation-state screenshot shows
both tasks after both creation actions; the completion screenshot shows both
tasks completed. No separate intermediate image per individual creation or
completion action was supplied.

## Failures and traces

The selected run had no test failures, so no failure details or failure traces
are associated with it. Its `test-output/` directory contains `.last-run.json`
only; no selected-run trace or failure context is available.

## Observed issue and separate same-date runs

The successful selected run is distinct from the following same-date runs;
their outcomes are not included in its totals:

- Baseline `tasks-api-20261030T141744-c5a19d3c`: 2 passed / 0 failed /
  0 skipped (10,402.804 ms). [JSON](../results/tasks-api-20261030T141744-c5a19d3c.json) ·
  [console](../console/tasks-api-20261030T141744-c5a19d3c.log).
- Headed diagnostic `tasks-api-20261030T141831-headed`: 0 passed / 2 failed /
  0 skipped (13,419.429 ms). Both tests failed the final `consoleErrors`
  assertion after a browser resource 404; the Testing handoff identifies it
  as `http://localhost:5174/favicon.ico`. Task-flow/validation assertions had
  been reached before that check.
- Debugger diagnostic `tasks-api-20261030T141953-debugger`: 0 passed / 1 failed /
  0 skipped (52,057.728 ms). The empty-title test likewise failed the final
  console-error assertion after a 404 message. Interactive debugger
  stepping/inspection remained incomplete.

Evidence for the headed diagnostic:

- [Playwright JSON](../results/tasks-api-20261030T141831-headed.json)
- [Console output](../console/tasks-api-20261030T141831-headed.log)
- [Create/complete/reload error context](../tasks-api-20261030T141831-headed/test-output/tasks-creates-completes-and-reloads-tasks-chromium/error-context.md)
- [Create/complete/reload trace](../tasks-api-20261030T141831-headed/test-output/tasks-creates-completes-and-reloads-tasks-chromium/trace.zip)
- [Empty-title error context](../tasks-api-20261030T141831-headed/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/error-context.md)
- [Empty-title trace](../tasks-api-20261030T141831-headed/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/trace.zip)

Evidence for the debugger diagnostic:

- [Playwright JSON](../results/tasks-api-20261030T141953-debugger.json)
- [Console output](../console/tasks-api-20261030T141953-debugger.log)
- [Empty-title error context](../tasks-api-20261030T141953-debugger/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/error-context.md)
- [Empty-title trace](../tasks-api-20261030T141953-debugger/test-output/tasks-rejects-an-empty-task-title-without-creating-a-task-chromium/trace.zip)

The 404 is an observed issue in separate diagnostic runs, not a failure of the
selected run. Its cause and broader impact are not established. No fix,
post-fix verification, or controlled defect simulation is evidenced. See the
[date-level defect notes](../bug-report.md) for preserved prior evidence and
the latest update.

## Unresolved issues and limitations

- The resource 404 remains unresolved; no fix or post-fix test evidence was
  provided.
- Interactive headed UI selection/debugger stepping was incomplete.
- The selected successful run produced no trace; failure traces are available
  only for the separately identified diagnostic runs.

## Report files

- [Markdown report](test-report.md)
- [PDF report](test-report.pdf)
