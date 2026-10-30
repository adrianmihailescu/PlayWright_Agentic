# Task Manager — Playwright Reporting Playbook

## Scope

This specification covers reporting only: collecting verified Playwright results and evidence, creating the Markdown/PDF report, and validating the report artifacts.

Test generation, test execution, and interactive browser debugging are specified in [tasks-api-tests.md](./tasks-api-tests.md). The reporting agent must use the exact results and evidence supplied by the testing agent; it must not infer that a test ran or passed.

## Inputs

- Playwright JSON results for the exact run being reported.
- Actual test names, statuses, durations, timestamps, failure messages, and error details.
- Playwright-captured screenshots, traces, and relevant console/test output.
- Existing report content, if present, to preserve relevant history.
- Testing agent's handoff identifying the run ID and evidence paths.

If the run or its evidence cannot be identified unambiguously, report the missing information instead of using an unrelated or stale `latest` artifact.

## Required date and run organization

Consume the exact run ID supplied by Testing and use its `YYYYMMDD` date token; if the run ID has no date token, use the local current date. All selected inputs must be under that date root:

- Results: `e2e/artifacts/YYYYMMDD/results/<run-id>.json`
- Console: `e2e/artifacts/YYYYMMDD/console/<run-id>.log`
- Screenshots: `e2e/artifacts/YYYYMMDD/screenshots/<run-id>-<step>.png`
- Run outputs: `e2e/artifacts/YYYYMMDD/<run-id>/test-output/` and `e2e/artifacts/YYYYMMDD/<run-id>/playwright-report/`
- Date-level defect notes: `e2e/artifacts/YYYYMMDD/bug-report.md`
- Reports: `e2e/artifacts/YYYYMMDD/<run-id>/test-report.md` and `test-report.pdf`

Never choose an ambiguous latest result, use evidence from another date, or overwrite a report from another date/run. A separately cited run is allowed only when it is explicitly identified and shares the selected date. In Markdown reports, link to existing evidence relative to the report file, and keep every link within the selected date root except an explicitly cited same-date run.

## Phase 1 — Screenshots and evidence

### Screenshot requirements

- Use screenshots captured by Playwright during browser execution. Do not generate, simulate, or substitute screenshots.
- Include relevant screenshots after application load, each task creation, task completion, post-reload verification, and failure when available.
- Use descriptive filenames that identify the run/scenario/step.
- Keep screenshots under `e2e/artifacts/YYYYMMDD/screenshots/`, named `<run-id>-<step>.png`.
- Link only to evidence files that exist.

### Result integrity

- Preserve the actual passed, failed, and skipped results from Playwright.
- Record the run timestamp, test names, durations, failure messages, and error details.
- Do not report a test as passed unless Playwright's results confirm it.
- Include relevant screenshots and trace/error context for failures when available.
- Do not fabricate results, failures, timestamps, screenshots, traces, or fixes.

## Phase 2 — Markdown/PDF report

Generate or update `e2e/artifacts/YYYYMMDD/<run-id>/test-report.pdf` from the `e2e` directory with `npm run report -- <run-id>`. The exact run ID may instead be supplied through `PW_ARTIFACT_RUN_ID`. The generator reads only `artifacts/YYYYMMDD/results/<run-id>.json`, screenshots matching `<run-id>-*.png` in that date's `screenshots/`, and that date's `bug-report.md`. Missing exact inputs are errors; there is no latest-results or current-results fallback. Create or update the companion Markdown report at `e2e/artifacts/YYYYMMDD/<run-id>/test-report.md` and date-specific defect notes at `e2e/artifacts/YYYYMMDD/bug-report.md`.

The report must include:

- A title, execution timestamp, exact run identifier, and overall summary.
- A results table with test name, status, and duration.
- Relevant screenshots with captions identifying the scenario and step.
- Failure details and related evidence for failed tests.
- A final section listing observed defects and unresolved issues.
- Readable layout and appropriately sized screenshots.

Keep general test-run results separate from individual defect descriptions. Document defects only when supported by actual evidence. Never label an issue fixed without verified post-fix test results. Preserve relevant existing report content when updating it.

## Phase 3 — Final verification

Before reporting completion:

1. Confirm both reports exist in `e2e/artifacts/YYYYMMDD/<run-id>/`.
2. Confirm that it is a valid, openable PDF.
3. Confirm that its timestamp, run identifier, test names, and totals correspond to the exact Playwright run supplied by Testing.
4. Confirm that report links point to existing evidence files.
5. Report both report paths and the selected date's `screenshots/` path.
6. Clearly list any missing evidence or verification that could not be completed.

## Final report

Return:

- Report files created or updated.
- Exact run identifier and timestamp.
- Actual test counts and statuses, including failures and skips.
- Verified screenshot/trace/result paths.
- PDF validation and exact-run verification outcome.
- Observed defects and unresolved issues, distinguishing confirmed facts from limitations.
