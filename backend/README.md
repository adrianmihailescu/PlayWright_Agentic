# Tasks API

Minimal ASP.NET Core Web API for the React Task Manager frontend.

## Requirements

- .NET 10 SDK

If you use a different installed SDK, update `Tasks.Api/Tasks.Api.csproj`
to the target framework you have installed (for example `net8.0` or `net9.0`).

## Run

From the repository root:

```powershell
dotnet run --project backend/Tasks.Api/Tasks.Api.csproj
```

The API listens on `http://localhost:5000`.

## Endpoints

- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create a task with JSON `{ "title": "My task" }`
- `PUT /api/tasks/{id}/complete` — mark a task complete

The sample uses in-memory storage. Data resets when the API restarts.
CORS allows the Vite frontend at `http://localhost:5174`.
