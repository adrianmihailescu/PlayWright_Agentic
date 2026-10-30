const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const artifactsDir = path.resolve(__dirname, '..', 'artifacts');
const runId = process.argv[2] ?? process.env.PW_ARTIFACT_RUN_ID;

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

function isValidDate(value) {
  if (!/^\d{8}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function collectTests(suite, parentTitles = []) {
  const titles = suite.title ? [...parentTitles, suite.title] : parentTitles;
  const ownTests = (suite.specs ?? []).flatMap((spec) => (spec.tests ?? []).map((test) => {
    const results = test.results ?? [];
    const statuses = results.map((result) => result.status);
    const status = statuses.includes('failed') || statuses.includes('timedOut')
      ? 'failed'
      : statuses.includes('passed')
        ? 'passed'
        : statuses.includes('skipped')
          ? 'skipped'
          : test.expectedStatus === 'skipped'
            ? 'skipped'
            : 'unknown';
    const errors = results.flatMap((result) => result.errors ?? []);

    return {
      name: [...titles, spec.title, test.title].filter(Boolean).join(' › '),
      status,
      duration: results.reduce((total, result) => total + (result.duration ?? 0), 0),
      errors,
    };
  }));

  return [...ownTests, ...(suite.suites ?? []).flatMap((child) => collectTests(child, titles))];
}

async function main() {
  if (!runId) {
    throw new Error('An exact run ID is required as an argument or through PW_ARTIFACT_RUN_ID.');
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(runId)) {
    throw new Error('The run ID must be a single safe path component.');
  }
  const dateToken = runId.match(/(?:^|[-_])(\d{8})(?=T|[-_]|$)/)?.[1];
  const artifactDate = dateToken ?? localDate();
  if (!isValidDate(artifactDate)) {
    throw new Error(`The run ID contains an invalid date token: ${artifactDate}`);
  }

  const dateDir = path.join(artifactsDir, artifactDate);
  const screenshotsDir = path.join(dateDir, 'screenshots');
  const reportJsonPath = path.join(dateDir, 'results', `${runId}.json`);
  const pdfPath = path.join(dateDir, runId, 'test-report.pdf');
  const bugReportPath = path.join(dateDir, 'bug-report.md');
  const reportContent = await fs.readFile(reportJsonPath, 'utf8');
  const bugReport = await fs.readFile(bugReportPath, 'utf8');
  const report = JSON.parse(reportContent);
  if (!report.stats
    || !Number.isFinite(report.stats.expected)
    || !Number.isFinite(report.stats.unexpected)
    || !Number.isFinite(report.stats.skipped)) {
    throw new Error(`Playwright JSON has missing or invalid test statistics: ${reportJsonPath}`);
  }
  const tests = (report.suites ?? []).flatMap((suite) => collectTests(suite));
  const counts = {
    passed: tests.filter((test) => test.status === 'passed').length,
    failed: tests.filter((test) => test.status === 'failed').length,
    skipped: tests.filter((test) => test.status === 'skipped').length,
  };
  if (tests.some((test) => test.status === 'unknown')) {
    throw new Error('Playwright JSON contains a test with an unknown result status.');
  }
  if (counts.passed !== report.stats.expected
    || counts.failed !== report.stats.unexpected
    || counts.skipped !== report.stats.skipped) {
    throw new Error('Parsed test totals do not match Playwright reporter statistics.');
  }
  const files = (await fs.readdir(screenshotsDir))
    .filter((name) => name.startsWith(`${runId}-`) && name.endsWith('.png'))
    .sort();
  if (files.length === 0) {
    throw new Error(`No screenshots were found for run ${runId} in ${screenshotsDir}.`);
  }

  const screenshots = await Promise.all(files.map(async (name) => {
    const data = await fs.readFile(path.join(screenshotsDir, name));
    const caption = name.slice(runId.length + 1, -4).replaceAll('-', ' ');
    return `<figure><img src="data:image/png;base64,${data.toString('base64')}" alt="${escapeHtml(caption)}"><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
  }));
  const rows = tests.map((test) => `
    <tr>
      <td>${escapeHtml(test.name)}</td>
      <td class="status-${escapeHtml(test.status)}">${escapeHtml(test.status)}</td>
      <td>${(test.duration / 1000).toFixed(2)} s</td>
    </tr>`).join('');
  const failures = tests.flatMap((test) => test.errors.map((error) => `
    <article><h3>${escapeHtml(test.name)}</h3><pre>${escapeHtml(error.message ?? JSON.stringify(error))}</pre></article>`)).join('');
  const timestamp = report.stats?.startTime
    ? new Date(report.stats.startTime).toLocaleString()
    : new Date().toLocaleString();
  const summary = `${counts.passed} passed · ${counts.failed} failed · ${counts.skipped} skipped`;
  const html = `<!doctype html>
    <html><head><meta charset="utf-8"><title>Playwright Test Report</title>
    <style>
      @page { size: A4; margin: 16mm; }
      body { font: 10pt Arial, sans-serif; color: #202124; }
      h1 { margin-bottom: 4px; } h2 { margin-top: 28px; border-bottom: 1px solid #bbb; padding-bottom: 5px; }
      .muted { color: #555; } table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #bbb; padding: 7px; text-align: left; }
      th { background: #eee; } .status-passed { color: #176b2c; } .status-failed { color: #a00000; font-weight: bold; }
      figure { margin: 16px 0 24px; page-break-inside: avoid; }
      img { display: block; width: 100%; max-height: 190mm; object-fit: contain; }
      figcaption { margin-top: 4px; color: #444; font-size: 9pt; }
      pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f3f3f3; padding: 8px; }
    </style></head><body>
    <h1>Playwright Test Report</h1>
    <p class="muted">Execution timestamp: ${escapeHtml(timestamp)}</p>
    <p><strong>Run ID:</strong> ${escapeHtml(runId)}<br><strong>Summary:</strong> ${escapeHtml(summary)}</p>
    <h2>Test results</h2>
    <table><thead><tr><th>Test name</th><th>Status</th><th>Duration</th></tr></thead><tbody>${rows}</tbody></table>
    <h2>Execution screenshots</h2>${screenshots.length ? screenshots.join('') : '<p>No screenshots could be associated with the selected run.</p>'}
    <h2>Failure details</h2>${failures || '<p>No test failures were reported in this run.</p>'}
    <h2>Defects and unresolved issues</h2>
    <p>${bugReport
      ? 'See the detailed bug report below.'
      : 'No application defects were observed in the covered task workflows. No artificial defects were introduced; the current playbook calls for interactive debugging without changing application behavior.'}</p>
    ${bugReport ? `<h2>Bug report</h2><pre>${escapeHtml(bugReport)}</pre>` : ''}
    </body></html>`;

  await fs.mkdir(path.dirname(pdfPath), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }

  const pdf = await fs.readFile(pdfPath);
  if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-')) || !pdf.toString('latin1').includes('%%EOF')) {
    throw new Error('Generated PDF failed its file integrity checks.');
  }
  console.log(`Created ${pdfPath} (${pdf.length} bytes)`);
  console.log(`Results source: ${reportJsonPath}`);
  console.log(`Included ${files.length} screenshots for run ${runId}.`);
  console.log(`Report summary: ${summary}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
