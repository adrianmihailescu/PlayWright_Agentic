# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tasks.spec.ts >> creates, completes, and reloads tasks
- Location: tests\tasks.spec.ts:49:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "Failed to load resource: the server responded with a status of 404 (Not Found)",
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
        - paragraph [ref=f1e19]: 6 total · 4 completed
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
        - generic [ref=f1e36]: Task A tasks-api-20261029T1647-ui
        - generic [ref=f1e37]: Completed
      - listitem [ref=f1e38]:
        - generic [aria-hidden] [ref=f1e39]: ✓
        - generic [ref=f1e40]: Task B tasks-api-20261029T1647-ui
        - generic [ref=f1e41]: Completed
      - listitem [ref=f1e42]:
        - generic [aria-hidden] [ref=f1e43]: ✓
        - generic [ref=f1e44]: Task A tasks-api-20261029T1648-debug
        - generic [ref=f1e45]: Completed
      - listitem [ref=f1e46]:
        - generic [aria-hidden] [ref=f1e47]: ✓
        - generic [ref=f1e48]: Task B tasks-api-20261029T1648-debug
        - generic [ref=f1e49]: Completed
  - generic [ref=f1e50]:
    - generic [ref=f1e51]: Built for focus.
    - generic [ref=f1e52]: React · TypeScript · .NET API
```

# Test source

```ts
  49  | test('creates, completes, and reloads tasks', async ({ page }) => {
  50  |   const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  51  |   const taskTitle1 = `Task A ${runId}`;
  52  |   const taskTitle2 = `Task B ${runId}`;
  53  | 
  54  |   const taskList = page.getByRole('list', {
  55  |     name: 'Tasks',
  56  |     exact: true,
  57  |   });
  58  |   const titleInput = page.getByLabel('Task title', {
  59  |     exact: true,
  60  |   });
  61  |   const addTaskButton = page.getByRole('button', {
  62  |     name: '+ Add task',
  63  |     exact: true,
  64  |   });
  65  | 
  66  |   await page.goto('/');
  67  | 
  68  |   await expect(
  69  |     page.getByRole('heading', {
  70  |       name: 'Task Manager',
  71  |       exact: true,
  72  |     })
  73  |   ).toBeVisible();
  74  | 
  75  |   await expect(taskList).toBeVisible();
  76  |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  77  |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  78  | 
  79  |   await captureScreenshot(page, 'task-manager');
  80  | 
  81  |   // Create two uniquely named tasks.
  82  |   for (const title of [taskTitle1, taskTitle2]) {
  83  |     await titleInput.fill(title);
  84  |     await addTaskButton.click();
  85  | 
  86  |     await expect(
  87  |       taskList.getByRole('listitem').filter({ hasText: title })
  88  |     ).toBeVisible();
  89  | 
  90  |     await expect(titleInput).toHaveValue('');
  91  |   }
  92  | 
  93  |   const task1 = taskList.getByRole('listitem').filter({
  94  |     has: page.getByText(taskTitle1, { exact: true }),
  95  |   });
  96  |   const task2 = taskList.getByRole('listitem').filter({
  97  |     has: page.getByText(taskTitle2, { exact: true }),
  98  |   });
  99  | 
  100 |   await expect(task1).toBeVisible();
  101 |   await expect(task2).toBeVisible();
  102 |   await expect(task1).not.toContainText('Completed');
  103 |   await expect(task2).not.toContainText('Completed');
  104 |   await expect(task1.getByRole('button', {
  105 |     name: `Complete ${taskTitle1}`,
  106 |     exact: true,
  107 |   })).toBeVisible();
  108 |   await expect(task2.getByRole('button', {
  109 |     name: `Complete ${taskTitle2}`,
  110 |     exact: true,
  111 |   })).toBeVisible();
  112 | 
  113 |   await captureScreenshot(page, 'tasks-created');
  114 | 
  115 |   // Complete only the first task.
  116 |   await task1.getByRole('button', {
  117 |     name: `Complete ${taskTitle1}`,
  118 |     exact: true,
  119 |   }).click();
  120 | 
  121 |   await expect(task1).toContainText('Completed');
  122 |   await expect(task2).not.toContainText('Completed');
  123 | 
  124 |   // Complete the second task.
  125 |   await task2.getByRole('button', {
  126 |     name: `Complete ${taskTitle2}`,
  127 |     exact: true,
  128 |   }).click();
  129 | 
  130 |   await expect(task1).toContainText('Completed');
  131 |   await expect(task2).toContainText('Completed');
  132 | 
  133 |   await captureScreenshot(page, 'tasks-completed');
  134 | 
  135 |   // Reload and verify persisted state.
  136 |   await page.reload();
  137 | 
  138 |   await expect(taskList).toBeVisible();
  139 |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  140 |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  141 |   await expect(task1).toBeVisible();
  142 |   await expect(task2).toBeVisible();
  143 |   await expect(task1).toContainText('Completed');
  144 |   await expect(task2).toContainText('Completed');
  145 | 
  146 |   await captureScreenshot(page, 'tasks-after-reload');
  147 | 
  148 |   expect(applicationErrors).toEqual([]);
> 149 |   expect(consoleErrors).toEqual([]);
      |                         ^ Error: expect(received).toEqual(expected) // deep equality
  150 |   expect(apiErrors).toEqual([]);
  151 | });
  152 | 
  153 | test('rejects an empty task title without creating a task', async ({ page }) => {
  154 |   const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  155 |   const createRequests: string[] = [];
  156 | 
  157 |   page.on('request', (request) => {
  158 |     if (request.method() === 'POST' && /\/api\/tasks(?:[/?#]|$)/.test(request.url())) {
  159 |       createRequests.push(request.url());
  160 |     }
  161 |   });
  162 | 
  163 |   await page.goto('/');
  164 |   await expect(page.getByRole('heading', {
  165 |     name: 'Task Manager',
  166 |     exact: true,
  167 |   })).toBeVisible();
  168 |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  169 |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  170 | 
  171 |   const taskList = page.getByRole('list', {
  172 |     name: 'Tasks',
  173 |     exact: true,
  174 |   });
  175 |   await expect(taskList).toBeVisible();
  176 |   const initialTaskCount = await taskList.getByRole('listitem').count();
  177 |   const titleInput = page.getByLabel('Task title', { exact: true });
  178 | 
  179 |   await expect(titleInput).toHaveValue('');
  180 |   await page.getByRole('button', {
  181 |     name: '+ Add task',
  182 |     exact: true,
  183 |   }).click();
  184 | 
  185 |   await expect(page.getByRole('alert')).toHaveText('Title is required.');
  186 |   await expect(taskList.getByRole('listitem')).toHaveCount(initialTaskCount);
  187 |   expect(createRequests).toHaveLength(0);
  188 |   await captureScreenshot(page, 'empty-title-validation');
  189 | 
  190 |   expect(applicationErrors).toEqual([]);
  191 |   expect(consoleErrors).toEqual([]);
  192 |   expect(apiErrors).toEqual([]);
  193 | });
```