import { useEffect, useState, type FormEvent } from 'react';

type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  async function loadTasks() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Could not load tasks.');
    const data = (await response.json()) as Task[];
    setTasks(data);
    setApiAvailable(true);
    setError('');
  }

  useEffect(() => {
    loadTasks()
      .catch(() => {
        setApiAvailable(false);
        setError('Cannot connect to the API. Start the .NET backend and try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Title is required.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not create task.');
      }

      setTitle('');
      await loadTasks();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create task.');
    }
  }

  async function completeTask(id: number) {
    try {
      const response = await fetch(`${API_URL}/${id}/complete`, { method: 'PUT' });
      if (!response.ok) throw new Error('Could not complete task.');
      await loadTasks();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not complete task.');
    }
  }

  const completedCount = tasks.filter((task) => task.isCompleted).length;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">✓</div>
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Task Manager</h1>
        </div>
        <span className={`connection ${apiAvailable ? 'online' : 'offline'}`}>
          <span className="status-dot" />
          {apiAvailable ? 'API connected' : 'API unavailable'}
        </span>
      </header>

      <section className="welcome">
        <p className="eyebrow">MAKE TODAY COUNT</p>
        <h2>One thing at a time.</h2>
        <p className="welcome-copy">Capture your next step and keep your momentum going.</p>
      </section>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <div className="panel-heading">
          <div>
            <h2 id="tasks-heading">Your tasks</h2>
            <p className="muted">{tasks.length} total · {completedCount} completed</p>
          </div>
          <span className="count-pill">{tasks.length - completedCount} left</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            autoComplete="off"
          />
          <button type="submit" className="add-button">+ Add task</button>
        </form>

        {error && <p role="alert" className="error-message">{error}</p>}

        {loading ? (
          <p className="empty-state">Loading your tasks…</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✦</span>
            <p>No tasks yet. Add one above to get started.</p>
          </div>
        ) : (
          <ul className="task-list" aria-label="Tasks">
            {tasks.map((task) => (
              <li className={`task-item ${task.isCompleted ? 'is-completed' : ''}`} key={task.id}>
                <span className="task-status" aria-hidden="true">
                  {task.isCompleted ? '✓' : ''}
                </span>
                <span className="task-title">{task.title}</span>
                {task.isCompleted ? (
                  <span className="completed-label">Completed</span>
                ) : (
                  <button
                    type="button"
                    className="complete-button"
                    onClick={() => completeTask(task.id)}
                    aria-label={`Complete ${task.title}`}
                  >
                    Complete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">
        <span>Built for focus.</span>
        <span>React · TypeScript · .NET API</span>
      </footer>
    </main>
  );
}

export default App;
