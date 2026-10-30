import { randomUUID } from 'node:crypto';
import { env } from 'node:process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const runId = env.PW_ARTIFACT_RUN_ID ?? randomUUID();
const localDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};
const artifactDate = env.PW_ARTIFACT_DATE ?? localDate();

async function captureScreenshot(
  page: Page,
  step: string
): Promise<void> {
  const screenshotsDir = resolve(
    process.cwd(),
    'artifacts',
    artifactDate,
    'screenshots'
  );

  await mkdir(screenshotsDir, { recursive: true });

  await page.screenshot({
    path: resolve(screenshotsDir, `${runId}-${step}.png`),
    fullPage: true,
  });
}

function observeErrors(page: Page): {
  applicationErrors: string[];
  consoleErrors: string[];
  apiErrors: string[];
} {
  const applicationErrors: string[] = [];
  const consoleErrors: string[] = [];
  const apiErrors: string[] = [];

  page.on('pageerror', (error) => applicationErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.url().includes('/api/tasks') && response.status() >= 400) {
      apiErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  return { applicationErrors, consoleErrors, apiErrors };
}

test('creates, completes, and reloads all the tasks', async ({ page }) => {
  const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  const taskTitle1 = `Task A ${runId}`;
  const taskTitle2 = `Task B ${runId}`;

  const taskList = page.getByRole('list', {
    name: 'Tasks',
    exact: true,
  });
  const titleInput = page.getByLabel('Task title', {
    exact: true,
  });
  const addTaskButton = page.getByRole('button', {
    name: '+ Add task',
    exact: true,
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Task Manager',
      exact: true,
    })
  ).toBeVisible();

  await expect(taskList).toBeVisible();
  await expect(page.getByText('Loading your tasks…')).toBeHidden();
  await expect(page.getByText('API connected', { exact: true })).toBeVisible();

  await captureScreenshot(page, 'task-manager');

  // Create two uniquely named tasks.
  for (const title of [taskTitle1, taskTitle2]) {
    await titleInput.fill(title);
    await addTaskButton.click();

    await expect(
      taskList.getByRole('listitem').filter({ hasText: title })
    ).toBeVisible();

    await expect(titleInput).toHaveValue('');
  }

  const task1 = taskList.getByRole('listitem').filter({
    has: page.getByText(taskTitle1, { exact: true }),
  });
  const task2 = taskList.getByRole('listitem').filter({
    has: page.getByText(taskTitle2, { exact: true }),
  });

  await expect(task1).toBeVisible();
  await expect(task2).toBeVisible();
  await expect(task1).not.toContainText('Completed');
  await expect(task2).not.toContainText('Completed');
  await expect(task1.getByRole('button', {
    name: `Complete ${taskTitle1}`,
    exact: true,
  })).toBeVisible();
  await expect(task2.getByRole('button', {
    name: `Complete ${taskTitle2}`,
    exact: true,
  })).toBeVisible();

  await captureScreenshot(page, 'tasks-created');

  // Complete only the first task.
  await task1.getByRole('button', {
    name: `Complete ${taskTitle1}`,
    exact: true,
  }).click();

  await expect(task1).toContainText('Completed');
  await expect(task2).not.toContainText('Completed');

  // Complete the second task.
  await task2.getByRole('button', {
    name: `Complete ${taskTitle2}`,
    exact: true,
  }).click();

  await expect(task1).toContainText('Completed');
  await expect(task2).toContainText('Completed');

  await captureScreenshot(page, 'tasks-completed');

  // Reload and verify persisted state.
  await page.reload();

  await expect(taskList).toBeVisible();
  await expect(page.getByText('Loading your tasks…')).toBeHidden();
  await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  await expect(task1).toBeVisible();
  await expect(task2).toBeVisible();
  await expect(task1).toContainText('Completed');
  await expect(task2).toContainText('Completed');

  await captureScreenshot(page, 'tasks-after-reload');

  expect(applicationErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(apiErrors).toEqual([]);
});

test('rejects an empty task title without creating a new task', async ({ page }) => {
  const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  const createRequests: string[] = [];

  page.on('request', (request) => {
    if (request.method() === 'POST' && /\/api\/tasks(?:[/?#]|$)/.test(request.url())) {
      createRequests.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page.getByRole('heading', {
    name: 'Task Manager',
    exact: true,
  })).toBeVisible();
  await expect(page.getByText('Loading your tasks…')).toBeHidden();
  await expect(page.getByText('API connected', { exact: true })).toBeVisible();

  const taskList = page.getByRole('list', {
    name: 'Tasks',
    exact: true,
  });
  await expect(taskList).toBeVisible();
  const initialTaskCount = await taskList.getByRole('listitem').count();
  const titleInput = page.getByLabel('Task title', { exact: true });

  await expect(titleInput).toHaveValue('');
  await page.getByRole('button', {
    name: '+ Add task',
    exact: true,
  }).click();

  await expect(page.getByRole('alert')).toHaveText('Title is required.');
  await expect(taskList.getByRole('listitem')).toHaveCount(initialTaskCount);
  expect(createRequests).toHaveLength(0);
  await captureScreenshot(page, 'empty-title-validation');

  expect(applicationErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(apiErrors).toEqual([]);
});