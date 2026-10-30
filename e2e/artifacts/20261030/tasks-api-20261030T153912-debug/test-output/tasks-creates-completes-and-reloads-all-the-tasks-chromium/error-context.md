# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tasks.spec.ts >> creates, completes, and reloads all the tasks
- Location: tests\tasks.spec.ts:55:5

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
        - generic [ref=f1e36]: Task A tasks-api-20261030T153912-debug
        - generic [ref=f1e37]: Completed
      - listitem [ref=f1e38]:
        - generic [aria-hidden] [ref=f1e39]: ✓
        - generic [ref=f1e40]: Task B tasks-api-20261030T153912-debug
        - generic [ref=f1e41]: Completed
  - generic [ref=f1e42]:
    - generic [ref=f1e43]: Built for focus.
    - generic [ref=f1e44]: React · TypeScript · .NET API
```

# Test source

```ts
  55  | test('creates, completes, and reloads all the tasks', async ({ page }) => {
  56  |   const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  57  |   const taskTitle1 = `Task A ${runId}`;
  58  |   const taskTitle2 = `Task B ${runId}`;
  59  | 
  60  |   const taskList = page.getByRole('list', {
  61  |     name: 'Tasks',
  62  |     exact: true,
  63  |   });
  64  |   const titleInput = page.getByLabel('Task title', {
  65  |     exact: true,
  66  |   });
  67  |   const addTaskButton = page.getByRole('button', {
  68  |     name: '+ Add task',
  69  |     exact: true,
  70  |   });
  71  | 
  72  |   await page.goto('/');
  73  | 
  74  |   await expect(
  75  |     page.getByRole('heading', {
  76  |       name: 'Task Manager',
  77  |       exact: true,
  78  |     })
  79  |   ).toBeVisible();
  80  | 
  81  |   await expect(taskList).toBeVisible();
  82  |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  83  |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  84  | 
  85  |   await captureScreenshot(page, 'task-manager');
  86  | 
  87  |   // Create two uniquely named tasks.
  88  |   for (const title of [taskTitle1, taskTitle2]) {
  89  |     await titleInput.fill(title);
  90  |     await addTaskButton.click();
  91  | 
  92  |     await expect(
  93  |       taskList.getByRole('listitem').filter({ hasText: title })
  94  |     ).toBeVisible();
  95  | 
  96  |     await expect(titleInput).toHaveValue('');
  97  |   }
  98  | 
  99  |   const task1 = taskList.getByRole('listitem').filter({
  100 |     has: page.getByText(taskTitle1, { exact: true }),
  101 |   });
  102 |   const task2 = taskList.getByRole('listitem').filter({
  103 |     has: page.getByText(taskTitle2, { exact: true }),
  104 |   });
  105 | 
  106 |   await expect(task1).toBeVisible();
  107 |   await expect(task2).toBeVisible();
  108 |   await expect(task1).not.toContainText('Completed');
  109 |   await expect(task2).not.toContainText('Completed');
  110 |   await expect(task1.getByRole('button', {
  111 |     name: `Complete ${taskTitle1}`,
  112 |     exact: true,
  113 |   })).toBeVisible();
  114 |   await expect(task2.getByRole('button', {
  115 |     name: `Complete ${taskTitle2}`,
  116 |     exact: true,
  117 |   })).toBeVisible();
  118 | 
  119 |   await captureScreenshot(page, 'tasks-created');
  120 | 
  121 |   // Complete only the first task.
  122 |   await task1.getByRole('button', {
  123 |     name: `Complete ${taskTitle1}`,
  124 |     exact: true,
  125 |   }).click();
  126 | 
  127 |   await expect(task1).toContainText('Completed');
  128 |   await expect(task2).not.toContainText('Completed');
  129 | 
  130 |   // Complete the second task.
  131 |   await task2.getByRole('button', {
  132 |     name: `Complete ${taskTitle2}`,
  133 |     exact: true,
  134 |   }).click();
  135 | 
  136 |   await expect(task1).toContainText('Completed');
  137 |   await expect(task2).toContainText('Completed');
  138 | 
  139 |   await captureScreenshot(page, 'tasks-completed');
  140 | 
  141 |   // Reload and verify persisted state.
  142 |   await page.reload();
  143 | 
  144 |   await expect(taskList).toBeVisible();
  145 |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  146 |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  147 |   await expect(task1).toBeVisible();
  148 |   await expect(task2).toBeVisible();
  149 |   await expect(task1).toContainText('Completed');
  150 |   await expect(task2).toContainText('Completed');
  151 | 
  152 |   await captureScreenshot(page, 'tasks-after-reload');
  153 | 
  154 |   expect(applicationErrors).toEqual([]);
> 155 |   expect(consoleErrors).toEqual([]);
      |                         ^ Error: expect(received).toEqual(expected) // deep equality
  156 |   expect(apiErrors).toEqual([]);
  157 | });
  158 | 
  159 | test('rejects an empty task title without creating a new task', async ({ page }) => {
  160 |   const { applicationErrors, consoleErrors, apiErrors } = observeErrors(page);
  161 |   const createRequests: string[] = [];
  162 | 
  163 |   page.on('request', (request) => {
  164 |     if (request.method() === 'POST' && /\/api\/tasks(?:[/?#]|$)/.test(request.url())) {
  165 |       createRequests.push(request.url());
  166 |     }
  167 |   });
  168 | 
  169 |   await page.goto('/');
  170 |   await expect(page.getByRole('heading', {
  171 |     name: 'Task Manager',
  172 |     exact: true,
  173 |   })).toBeVisible();
  174 |   await expect(page.getByText('Loading your tasks…')).toBeHidden();
  175 |   await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  176 | 
  177 |   const taskList = page.getByRole('list', {
  178 |     name: 'Tasks',
  179 |     exact: true,
  180 |   });
  181 |   await expect(taskList).toBeVisible();
  182 |   const initialTaskCount = await taskList.getByRole('listitem').count();
  183 |   const titleInput = page.getByLabel('Task title', { exact: true });
  184 | 
  185 |   await expect(titleInput).toHaveValue('');
  186 |   await page.getByRole('button', {
  187 |     name: '+ Add task',
  188 |     exact: true,
  189 |   }).click();
  190 | 
  191 |   await expect(page.getByRole('alert')).toHaveText('Title is required.');
  192 |   await expect(taskList.getByRole('listitem')).toHaveCount(initialTaskCount);
  193 |   expect(createRequests).toHaveLength(0);
  194 |   await captureScreenshot(page, 'empty-title-validation');
  195 | 
  196 |   expect(applicationErrors).toEqual([]);
  197 |   expect(consoleErrors).toEqual([]);
  198 |   expect(apiErrors).toEqual([]);
  199 | });
```