
import { defineConfig, devices } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

function localDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function isValidDate(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
}

const suppliedRunId = process.env.PW_ARTIFACT_RUN_ID;
const runId = suppliedRunId
  ?? `tasks-api-${localDate()}T${new Date().toTimeString().slice(0, 8).replaceAll(':', '')}-${randomUUID().slice(0, 8)}`;
if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(runId)) {
  throw new Error('PW_ARTIFACT_RUN_ID must be a single safe path component.');
}

const runDateToken = runId.match(/(?:^|[-_])(\d{8})(?=T|[-_]|$)/)?.[1];
const artifactDate = runDateToken ?? localDate();
if (!isValidDate(artifactDate)) {
  throw new Error(`PW_ARTIFACT_RUN_ID contains an invalid date token: ${artifactDate}`);
}

process.env.PW_ARTIFACT_RUN_ID = runId;
process.env.PW_ARTIFACT_DATE = artifactDate;

const runArtifactsDir = resolve(__dirname, 'artifacts', artifactDate, runId);

export default defineConfig({
  testDir: './tests',
  outputDir: resolve(runArtifactsDir, 'test-output'),
  fullyParallel: true,

  reporter: [
    ['list'],
    ['html', {
      outputFolder: resolve(runArtifactsDir, 'playwright-report'),
      open: 'never',
    }],
    ['json', {
      outputFile: resolve(__dirname, 'artifacts', artifactDate, 'results', `${runId}.json`),
    }],
  ],

  use: {
    baseURL: 'http://localhost:5174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  webServer: [
    {
      command: 'dotnet run --launch-profile http',
      cwd: resolve(__dirname, '../backend'),
      url: 'http://localhost:5000/api/tasks',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --host localhost --port 5174 --strictPort',
      cwd: resolve(__dirname, '../frontend'),
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
