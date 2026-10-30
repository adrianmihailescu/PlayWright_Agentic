# Task Manager — Playwright Testing Playbook

## Environment

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:5000`
- Browser: Chromium
- Test file: `e2e/tests/tasks.spec.ts`

## Objective

Use Playwright to interact with the application like a real user. Create tasks, complete selected tasks, verify results, and rerun tests.

## Required artifact organization

Use the current **local** date in `YYYYMMDD` format for every run. Before running Playwright, set a unique run ID in the form `tasks-api-YYYYMMDDTHHmmss-<suffix>` and set `PW_ARTIFACT_DATE` to the same date. Set `PW_ARTIFACT_RUN_ID` to that exact ID; `e2e/playwright.config.ts` uses and propagates both values.

All run artifacts must be placed under `e2e/artifacts/YYYYMMDD/`:

- `e2e/artifacts/YYYYMMDD/<run-id>/test-output/`
- `e2e/artifacts/YYYYMMDD/<run-id>/playwright-report/`
- `e2e/artifacts/YYYYMMDD/results/<run-id>.json`
- `e2e/artifacts/YYYYMMDD/console/<run-id>.log`
- `e2e/artifacts/YYYYMMDD/screenshots/<run-id>-<step>.png`

From the `e2e` directory, create the console folder and save the complete run output with `Tee-Object` or an equivalent tee. For example:

```powershell
$artifactDate = Get-Date -Format 'yyyyMMdd'
$runId = "tasks-api-$($artifactDate)T$(Get-Date -Format 'HHmmss')-$([guid]::NewGuid().ToString('N').Substring(0,8))"
$env:PW_ARTIFACT_DATE = $artifactDate
$env:PW_ARTIFACT_RUN_ID = $runId
New-Item -ItemType Directory -Force -Path "artifacts\$artifactDate\console" | Out-Null
npx playwright test 2>&1 | Tee-Object -FilePath "artifacts\$artifactDate\console\$runId.log"
$testExitCode = $LASTEXITCODE
```

Check and report the captured exit code. Use a new run ID for each execution, including repeats. Do not select or hand off `latest` results or artifacts from another date.

## Phase 1 — Open and inspect

1. Open the frontend in Chromium.
2. Verify the **Task Manager** heading is visible.
3. Inspect the task input, Add task button, and task list.
4. Confirm that the task list has loaded.
5. Record any application or API errors.

## Phase 2 — Fill in multiple tasks

1. Generate unique titles for two new tasks.
2. Locate the input labelled **Task title**.
3. Fill it with the first title.
4. Click **Add task**.
5. Verify the first task appears in the list.
6. Verify the input is cleared.
7. Repeat for the second task.
8. Verify both tasks appear and are initially incomplete.

## Phase 3 — Complete and check tasks

1. Locate the first task's list item by its exact title.
2. Click only that item's **Complete `<task title>`** button.
3. Verify the first task displays **Completed**.
4. Verify the second task is still incomplete.
5. Complete the second task using its own button.
6. Verify both tasks display **Completed**.

## Phase 4 — Reload and verify

1. Reload the browser page.
2. Wait for the task list to load.
3. Verify both created tasks are still visible.
4. Verify both remain completed.
5. If state is lost, investigate the API and report the failure.

## Phase 5 — Validation

1. Leave the task input empty.
2. Click **Add task**.
3. Verify the alert **Title is required.** appears.
4. Verify no empty task was added.

## Phase 6 — Execute and repeat

1. Generate or update executable tests in `e2e/tests/tasks.spec.ts`.
2. Run the complete Playwright test suite.
3. Inspect failures and determine their root causes.
4. Fix incorrect test code when justified by evidence.
5. Do not hide failures by removing assertions or skipping tests.
6. Run the complete test suite a second time.
7. Compare both runs and hand off actual results/evidence to the reporting agent.

## Implementation rules

- Use `@playwright/test` and TypeScript.
- Prefer `getByRole` and `getByLabel`.
- Scope task-specific actions to the correct list item.
- Use web-first assertions.
- Avoid fixed sleeps.
- Use unique task titles on every run.
- Keep tests independent.
- Do not modify production code during test generation or healing.
- Do not claim a browser action or test succeeded unless verified.
- Preserve test outputs, screenshots, traces, and result files needed by Reporting; the reporting requirements are in [tasks-api-reporting.md](./tasks-api-reporting.md).

## Phase 7 — Interactive Playwright execution and visual debugging

### Objective

Run the Task Manager end-to-end tests interactively so the developer can observe browser actions, inspect page elements, follow execution, investigate failures, and understand how Playwright interacts with the application.

Use the existing tests. Do not create artificial bugs or change application behavior just to demonstrate tools.

### Verify the environment

1. Inspect the existing Playwright configuration and test files.
2. Ensure the frontend is running at `http://localhost:5174`.
3. Ensure the backend is running at `http://localhost:5000`.
4. Verify that the required browser is installed.
5. Confirm that tests run normally before enabling interactive debugging.
6. Preserve existing application code and tests unless a specific correction is required.

### Launch Playwright UI mode

1. Open a terminal in the `e2e` directory.
2. Execute:

   ```powershell
   npx playwright test --ui
   ```

3. Open the Playwright UI if it does not open automatically.
4. Show the available tests in the test explorer.
5. Explain how to select and run an individual test and how to run the complete suite.
6. Show the execution timeline, test steps, errors, and available DOM snapshots.
7. Keep the UI open for developer inspection when the environment supports it.

### Show browser actions

Run existing tests in headed mode so browser actions are visible. Demonstrate the interactions covered by the tests:

- Navigate to Task Manager.
- Find the task title input, fill a title, and click Add task.
- Verify the created task.
- Complete a task and verify its completed status.
- Submit an empty title and verify validation when the relevant test exists.

Explain the actual locator used for each action and what its assertion verifies. Do not claim an action occurred unless it is in the test code or was observed during execution.

### Step-by-step debugging

1. Run a selected test with the Playwright debugger:

   ```powershell
   npx playwright test --debug
   ```

2. Demonstrate stepping through the test and inspecting the current page and locator.
3. Explain how to resume execution and stop the debugger.
4. If needed, add `await page.pause()` temporarily at a useful point.
5. Remove temporary debugging statements when complete unless the developer explicitly requests that they remain.

### Trace viewer and failure evidence

1. Inspect the Playwright configuration for trace and screenshot settings.
2. Run a test with tracing enabled if needed.
3. Open the actual recorded trace:

   ```powershell
   npx playwright show-trace <actual-trace-file.zip>
   ```

4. Demonstrate inspection of actions, screenshots, DOM snapshots, console output, and errors available in the trace.
5. Explain the difference between live headed execution and replaying a recorded trace.

### Interactive completion criteria

The exercise is complete when the developer has been shown how to launch UI mode, watch tests in a visible browser, inspect test steps and locators, pause/debug execution, inspect a recorded trace, and identify/investigate an actual test failure.

Do not claim interactive execution was demonstrated if tools were only described or commands were merely printed. If the environment prevents an interactive step, report it as incomplete.

## Testing handoff

Return to the reporting agent:

- Test files changed and scenarios covered.
- Exact commands and run identifiers/prefixes.
- Run timestamps and actual passed/failed/skipped counts and durations.
- JSON and console output paths.
- Screenshot and trace paths.
- Any failures, suspected application defects, or interactive steps that could not be completed.

Do not write the Markdown/PDF test report; reporting requirements are in [tasks-api-reporting.md](./tasks-api-reporting.md).