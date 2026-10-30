# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tasks.spec.ts >> rejects an empty task title without creating a task
- Location: tests\tasks.spec.ts:153:5

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
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [aria-hidden] [ref=e5]: ✓
    - generic [ref=e6]:
      - paragraph [ref=e7]: YOUR WORKSPACE
      - heading "Task Manager" [level=1] [ref=e8]
    - generic [ref=e9]: API connected
  - generic [ref=e11]:
    - paragraph [ref=e12]: MAKE TODAY COUNT
    - heading "One thing at a time." [level=2] [ref=e13]
    - paragraph [ref=e14]: Capture your next step and keep your momentum going.
  - region [ref=e15]:
    - generic [ref=e16]:
      - generic [ref=e17]:
        - heading "Your tasks" [level=2] [ref=e18]
        - paragraph [ref=e19]: 6 total · 4 completed
      - generic [ref=e20]: 2 left
    - generic [ref=e21]:
      - generic [ref=e22]: Task title
      - textbox "Task title" [ref=e23]:
        - /placeholder: What needs to be done?
      - button "+ Add task" [active] [ref=e24] [cursor=pointer]
    - alert [ref=e25]: Title is required.
    - list "Tasks" [ref=e26]:
      - listitem [ref=e27]:
        - generic [ref=e29]: Generic Task
        - button "Complete Generic Task" [ref=e30] [cursor=pointer]: Complete
      - listitem [ref=e31]:
        - generic [ref=e33]: Specific Task
        - button "Complete Specific Task" [ref=e34] [cursor=pointer]: Complete
      - listitem [ref=e35]:
        - generic [aria-hidden] [ref=e36]: ✓
        - generic [ref=e37]: Task A tasks-api-20261029T1647-ui
        - generic [ref=e38]: Completed
      - listitem [ref=e39]:
        - generic [aria-hidden] [ref=e40]: ✓
        - generic [ref=e41]: Task B tasks-api-20261029T1647-ui
        - generic [ref=e42]: Completed
      - listitem [ref=e43]:
        - generic [aria-hidden] [ref=e44]: ✓
        - generic [ref=e45]: Task A tasks-api-20261029T1648-debug
        - generic [ref=e46]: Completed
      - listitem [ref=e47]:
        - generic [aria-hidden] [ref=e48]: ✓
        - generic [ref=e49]: Task B tasks-api-20261029T1648-debug
        - generic [ref=e50]: Completed
  - generic [ref=e51]:
    - generic [ref=e52]: Built for focus.
    - generic [ref=e53]: React · TypeScript · .NET API
```

# Test source

```ts
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
  149 |   expect(consoleErrors).toEqual([]);
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
> 191 |   expect(consoleErrors).toEqual([]);
      |                         ^ Error: expect(received).toEqual(expected) // deep equality
  192 |   expect(apiErrors).toEqual([]);
  193 | });
```