# Task Manager

A full-stack task management application with a React and TypeScript frontend, an ASP.NET Core REST API, and Playwright end-to-end coverage.

## Project structure

```text
.
├── backend/
│   ├── Properties/
│   ├── Program.cs
│   ├── Tasks.Api.csproj
│   └── appsettings.json
├── e2e/
│   ├── scripts/
│   ├── specs/
│   ├── tests/
│   └── playwright.config.ts
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── reports/
└── .gitignore
```

- **`backend/`** — ASP.NET Core API. `Program.cs` defines the task endpoints, CORS policy, and in-memory task store. The API listens on `http://localhost:5000`.
- **`frontend/`** — React and TypeScript application built and served by Vite on `http://localhost:5174`. The UI loads, creates, and completes tasks through the API. Configure the API endpoint with `VITE_API_URL`; see `.env.example`.
- **`e2e/`** — Playwright browser checks, configuration, workflow specifications, and report-generation script. The Playwright configuration starts the API and frontend when needed and writes run artifacts beneath `e2e/artifacts/`.
- **`reports/`** — Project-level reports.

## Architecture

The browser renders the React application. The frontend calls the ASP.NET Core API at `/api/tasks` using HTTP and JSON. The API provides endpoints to list tasks, create a task, and mark a task complete. CORS permits requests from the Vite development server.

Tasks are held in memory by the API process, so the task list resets when that process restarts. The API starts with two tasks.

## Requirements

- .NET 10 SDK
- Node.js and npm

## Run locally

Install the frontend dependencies:

```powershell
cd frontend
npm install
```

In a separate terminal, start the API from the repository root:

```powershell
dotnet run --project backend/Tasks.Api.csproj --launch-profile http
```

Start the frontend in another terminal:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5174`. The API is available at `http://localhost:5000`.

To use a different API URL, set `VITE_API_URL` in `frontend/.env.local`. The default is `http://localhost:5000/api/tasks`.

## Build the frontend

```powershell
cd frontend
npm run build
```

## End-to-end verification

Install the Playwright dependencies and browser from the `e2e/` directory:

```powershell
cd e2e
npm install
npx playwright install chromium
```

Run the browser checks:

```powershell
npx playwright test
```

The Playwright configuration starts the API and frontend automatically if they are not already running. It saves HTML reports, JSON results, screenshots, traces, and other run output under `e2e/artifacts/`.
