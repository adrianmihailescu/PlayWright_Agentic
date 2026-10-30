# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tasks.spec.ts >> creates, completes, and reloads tasks
- Location: tests\tasks.spec.ts:60:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "Failed to load resource: the server responded with a status of 404 (Not Found) | {\"url\":\"http://localhost:5174/favicon.ico\",\"line\":0,\"column\":0,\"lineNumber\":0,\"columnNumber\":0}",
+ ]
```

# Page snapshot

```yaml
- main [ref=f1e3]:
  - generic [ref=f1e4]:
    - generic [aria-hidden] [ref=f1e5]: ✓
    - generic [ref=f1e6]:
      - paragraph [ref=f1e7]: YOUR WORKSPACE
      - heading "Task Manager" [level=1] [ref=f1e8]
    - generic [ref=f1e9]: API connected
  - generic [ref=f1e11]:
    - paragraph [ref=f1e12]: MAKE TODAY COUNT
    - heading "One thing at a time." [level=2] [ref=f1e13]
    - paragraph [ref=f1e14]: Capture your next step and keep your momentum going.
  - region [ref=f1e15]:
    - generic [ref=f1e16]:
      - generic [ref=f1e17]:
        - heading "Your tasks" [level=2] [ref=f1e18]
        - paragraph [ref=f1e19]: 4 total · 2 completed
      - generic [ref=f1e20]: 2 left
    - generic [ref=f1e21]:
      - generic [ref=f1e22]: Task title
      - textbox "Task title" [ref=f1e23]:
        - /placeholder: What needs to be done?
      - button "+ Add task" [ref=f1e24] [cursor=pointer]
    - list "Tasks" [ref=f1e25]:
      - listitem [ref=f1e26]:
        - generic [ref=f1e28]: Generic Task
        - button "Complete Generic Task" [ref=f1e29] [cursor=pointer]: Complete
      - listitem [ref=f1e30]:
        - generic [ref=f1e32]: Specific Task
        - button "Complete Specific Task" [ref=f1e33] [cursor=pointer]: Complete
      - listitem [ref=f1e34]:
        - generic [aria-hidden] [ref=f1e35]: ✓
        - generic [ref=f1e36]: Task A tasks-api-20261029T1704-investigate2
        - generic [ref=f1e37]: Completed
      - listitem [ref=f1e38]:
        - generic [aria-hidden] [ref=f1e39]: ✓
        - generic [ref=f1e40]: Task B tasks-api-20261029T1704-investigate2
        - generic [ref=f1e41]: Completed
  - generic [ref=f1e42]:
    - generic [ref=f1e43]: Built for focus.
    - generic [ref=f1e44]: React · TypeScript · .NET API
```

# Test source

```ts
  60  | test('creates, completes, and reloads tasks', async ({ page }) => {
  61  |   const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  62  |   const taskTitle1 = `Task A ${runId}`;
  63  |   const taskTitle2 = `Task B ${runId}`;
  64  | 
  65  |   const taskList = page.getByRole('list', {
  66  |     name: 'Tasks',
  67  |     exact: true,
  68  |   });
  69  |   const titleInput = page.getByLabel('Task title', {
  70  |     exact: true,
  71  |   });
  72  |   const addTaskButton = page.getByRole('button', {
  73  |     name: '+ Add task',
  74  |     exact: true,
  75  |   });
  76  | 
  77  |   await page.goto('/');
  78  | 
  79  |   await expect(
  80  |     page.getByRole('heading', {
  81  |       name: 'Task Manager',
  82  |       exact: true,
  83  |     })
  84  |   ).toBeVisible();
  85  | 
  86  |   await expect(taskList).toBeVisible();
  87  |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  88  |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  89  | 
  90  |   await captureScreenshot(page, 'task-manager');
  91  | 
  92  |   // Create two uniquely named tasks.
  93  |   for (const title of [taskTitle1, taskTitle2]) {
  94  |     await titleInput.fill(title);
  95  |     await addTaskButton.click();
  96  | 
  97  |     await expect(
  98  |       taskList.getByRole('listitem').filter({ hasText: title })
  99  |     ).toBeVisible();
  100 | 
  101 |     await expect(titleInput).toHaveValue('');
  102 |   }
  103 | 
  104 |   const task1 = taskList.getByRole('listitem').filter({
  105 |     has: page.getByText(taskTitle1, { exact: true }),
  106 |   });
  107 |   const task2 = taskList.getByRole('listitem').filter({
  108 |     has: page.getByText(taskTitle2, { exact: true }),
  109 |   });
  110 | 
  111 |   await expect(task1).toBeVisible();
  112 |   await expect(task2).toBeVisible();
  113 |   await expect(task1).not.toContainText('Completed');
  114 |   await expect(task2).not.toContainText('Completed');
  115 |   await expect(task1.getByRole('button', {
  116 |     name: `Complete ${taskTitle1}`,
  117 |     exact: true,
  118 |   })).toBeVisible();
  119 |   await expect(task2.getByRole('button', {
  120 |     name: `Complete ${taskTitle2}`,
  121 |     exact: true,
  122 |   })).toBeVisible();
  123 | 
  124 |   await captureScreenshot(page, 'tasks-created');
  125 | 
  126 |   // Complete only the first task.
  127 |   await task1.getByRole('button', {
  128 |     name: `Complete ${taskTitle1}`,
  129 |     exact: true,
  130 |   }).click();
  131 | 
  132 |   await expect(task1).toContainText('Completed');
  133 |   await expect(task2).not.toContainText('Completed');
  134 | 
  135 |   // Complete the second task.
  136 |   await task2.getByRole('button', {
  137 |     name: `Complete ${taskTitle2}`,
  138 |     exact: true,
  139 |   }).click();
  140 | 
  141 |   await expect(task1).toContainText('Completed');
  142 |   await expect(task2).toContainText('Completed');
  143 | 
  144 |   await captureScreenshot(page, 'tasks-completed');
  145 | 
  146 |   // Reload and verify persisted state.
  147 |   await page.reload();
  148 | 
  149 |   await expect(taskList).toBeVisible();
  150 |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  151 |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  152 |   await expect(task1).toBeVisible();
  153 |   await expect(task2).toBeVisible();
  154 |   await expect(task1).toContainText('Completed');
  155 |   await expect(task2).toContainText('Completed');
  156 | 
  157 |   await captureScreenshot(page, 'tasks-after-reload');
  158 | 
  159 |   expect(applicationErrors).toEqual([]);
> 160 |   expect(consoleErrors).toEqual([]);
      |                         ^ Error: expect(received).toEqual(expected) // deep equality
  161 |   expect(apiErrors).toEqual([]);
  162 | });
  163 | 
  164 | test('rejects an empty task title without creating a task', async ({ page }) => {
  165 |   const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  166 |   const createRequests: string[] = [];
  167 | 
  168 |   page.on('request', (request) => {
  169 |     if (request.method() === 'POST' && /\/api\/tasks(?:[/?#]|$)/.test(request.url())) {
  170 |       createRequests.push(request.url());
  171 |     }
  172 |   });
  173 | 
  174 |   await page.goto('/');
  175 |   await expect(page.getByRole('heading', {
  176 |     name: 'Task Manager',
  177 |     exact: true,
  178 |   })).toBeVisible();
  179 |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  180 |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  181 | 
  182 |   const taskList = page.getByRole('list', {
  183 |     name: 'Tasks',
  184 |     exact: true,
  185 |   });
  186 |   await expect(taskList).toBeVisible();
  187 |   const initialTaskCount = await taskList.getByRole('listitem').count();
  188 |   const titleInput = page.getByLabel('Task title', { exact: true });
  189 | 
  190 |   await expect(titleInput).toHaveValue('');
  191 |   await page.getByRole('button', {
  192 |     name: '+ Add task',
  193 |     exact: true,
  194 |   }).click();
  195 | 
  196 |   await expect(page.getByRole('alert')).toHaveText('Title is required.');
  197 |   await expect(taskList.getByRole('listitem')).toHaveCount(initialTaskCount);
  198 |   expect(createRequests).toHaveLength(0);
  199 |   await captureScreenshot(page, 'empty-title-validation');
  200 | 
  201 |   expect(applicationErrors).toEqual([]);
  202 |   expect(consoleErrors).toEqual([]);
  203 |   expect(apiErrors).toEqual([]);
  204 | });
```